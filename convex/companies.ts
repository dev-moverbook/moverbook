import { ErrorMessages } from "@/types/errors";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { generateUniqueSlug } from "@/utils/helper";
import { CompanySchema } from "@/types/convex-schemas";
import {
  isUserInOrg,
  validateCompany,
  validateCompanyContact,
  validateCompliance,
  validateUser,
  validateWebIntegrations,
} from "./backendUtils/validate";
import { ClerkRoles, ResponseStatus, StripeAccountStatus } from "@/types/enums";
import {
  GetCompanyClerkUserIdResponse,
  GetCompanyDetailsData,
  GetCompanyDetailsResponse,
  GetCompanyIdBySlugResponse,
  UpdateCompanyLogoResponse,
  UpdateCompanyResponse,
} from "@/types/convex-responses";
import {
  createCompanyRecords,
  handleInternalError,
  shouldExposeError,
} from "./backendUtils/helper";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { internal } from "./_generated/api";
import { updateClerkOrgName } from "./backendUtils/clerk";
import { Doc, Id } from "./_generated/dataModel";

export const createCompany = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    name: v.string(),
    clerkUserId: v.string(),
  },

  handler: async (ctx, args): Promise<string> => {
    const { clerkOrganizationId, name, clerkUserId } = args;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .first();

    if (!user) {
      console.error(ErrorMessages.USER_NOT_FOUND);
      throw new Error(ErrorMessages.USER_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new Error(ErrorMessages.USER_INACTIVE);
    }

    if (!user.customerId) {
      throw new Error(ErrorMessages.USER_NOT_CUSTOMER);
    }

    const slug = await generateUniqueSlug(ctx, name);

    const companyId = await ctx.db.insert("companies", {
      clerkOrganizationId,
      customerId: user.customerId,
      imageUrl: null,
      isActive: true,
      name,
      slug,
      timeZone: "UTC",
    });

    Promise.all([
      ctx.db.patch(user._id, {
        companyId,
      }),
      createCompanyRecords(ctx, companyId),
    ]);
    return slug;
  },
});

export const getCompanyClerkOrgId = query({
  args: { clerkOrgId: v.string() },
  handler: async (ctx, args): Promise<Doc<"companies"> | null> => {
    const company = await ctx.db
      .query("companies")
      .filter((q) => q.eq(q.field("clerkOrganizationId"), args.clerkOrgId))
      .first();

    return company;
  },
});

export const getCompanyClerkOrgIdInternal = internalQuery({
  args: { clerkOrgId: v.string() },
  handler: async (ctx, args): Promise<Doc<"companies"> | null> => {
    const company = await ctx.db
      .query("companies")
      .filter((q) => q.eq(q.field("clerkOrganizationId"), args.clerkOrgId))
      .first();

    return company;
  },
});

export const getCompanyByIdInternal = internalQuery({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<Doc<"companies"> | null> => {
    const { companyId } = args;

    return await ctx.db.get(companyId);
  },
});

export const getCompanyBySlugInternal = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args): Promise<Doc<"companies"> | null> => {
    const { slug } = args;
    return await ctx.db
      .query("companies")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();
  },
});

export const getCompanyIdBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args): Promise<GetCompanyIdBySlugResponse> => {
    const { slug } = args;

    const identity = await requireAuthenticatedUser(ctx);

    const company = await ctx.db
      .query("companies")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();

    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const connectedAccount: Doc<"connectedAccounts"> | null = await ctx.db
      .query("connectedAccounts")
      .filter((q) => q.eq(q.field("customerId"), validatedCompany.customerId))
      .first();

    const companyContact: Doc<"companyContact"> = validateCompanyContact(
      await ctx.db
        .query("companyContact")
        .filter((q) => q.eq(q.field("companyId"), validatedCompany._id))
        .first()
    );

    const isCompanyContactComplete =
      !!companyContact.email &&
      !!companyContact.phoneNumber &&
      !!companyContact.address;

    const isStripeComplete =
      connectedAccount?.status === StripeAccountStatus.VERIFIED;

    return {
      companyId: validatedCompany._id,
      connectedAccountId: connectedAccount?.stripeAccountId || null,
      connectedAccountStatus: connectedAccount?.status || null,
      timeZone: validatedCompany.timeZone,
      isCompanyContactComplete,
      isStripeComplete,
    };
  },
});

export const getCompanyDetails = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetCompanyDetailsData> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    const compliance = validateCompliance(
      await ctx.db
        .query("compliance")
        .filter((q) => q.eq(q.field("companyId"), company._id))
        .first()
    );

    const webIntegrations = validateWebIntegrations(
      await ctx.db
        .query("webIntegrations")
        .filter((q) => q.eq(q.field("companyId"), company._id))
        .first()
    );

    const companyContact = validateCompanyContact(
      await ctx.db
        .query("companyContact")
        .filter((q) => q.eq(q.field("companyId"), company._id))
        .first()
    );
    return {
      company,
      compliance,
      webIntegrations,
      companyContact,
    };
  },
});

export const updateCompany = action({
  args: {
    companyId: v.id("companies"),
    updates: v.object({
      name: v.optional(v.string()),
      timeZone: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateCompanyResponse> => {
    const { companyId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const company = validateCompany(
        await ctx.runQuery(internal.companies.getCompanyByIdInternal, {
          companyId,
        })
      );

      isUserInOrg(identity, company.clerkOrganizationId);

      if (updates.name) {
        await updateClerkOrgName(company.clerkOrganizationId, updates.name);
      }

      const result = await ctx.runMutation(
        internal.companies.updateCompanyInternal,
        {
          companyId,
          updates,
        }
      );

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          companyId: result.companyId,
          slug: result.slug,
        },
      };
    } catch (error) {
      console.error("Error updating company:", error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: ErrorMessages.GENERIC_ERROR,
      };
    }
  },
});

export const updateCompanyInternal = internalMutation({
  args: {
    companyId: v.id("companies"),
    updates: v.object({
      name: v.optional(v.string()),
      timeZone: v.optional(v.string()),
    }),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ companyId: Id<"companies">; slug?: string }> => {
    const { companyId, updates } = args;

    const updatedFields: { name?: string; timeZone?: string; slug?: string } = {
      ...updates,
    };

    let slug: string | undefined;

    if (updates.name) {
      slug = await generateUniqueSlug(ctx, updates.name);
      updatedFields.slug = slug;
    }

    await ctx.db.patch(companyId, updatedFields);

    return { companyId, slug };
  },
});

export const updateCompanyLogo = mutation({
  args: {
    companyId: v.id("companies"),
    imageUrl: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"companies">> => {
    const { companyId, imageUrl } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(companyId, { imageUrl });

    return companyId;
  },
});

export const getCompanyClerkUserId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args): Promise<Doc<"companies"> | null> => {
    const { clerkUserId } = args;

    const user = validateUser(
      await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkUserId"), clerkUserId))
        .first()
    );

    if (!user.companyId) {
      return null;
    }

    const company = await ctx.db.get(user.companyId);

    return company;
  },
});
