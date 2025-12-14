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
import {
  isUserInOrg,
  validateCompany,
  validateCompanyContact,
  validateDocExists,
  validateUser,
} from "./backendUtils/validate";
import { ClerkRoles, StripeAccountStatus } from "@/types/enums";
import {
  GetCompanyDetailsData,
  GetCompanyIdBySlugResponse,
} from "@/types/convex-responses";
import { createCompanyRecords } from "./backendUtils/helper";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { internal } from "./_generated/api";
import { updateClerkOrgName } from "./functions/clerk";
import { Doc, Id } from "./_generated/dataModel";
import { getFirstByCompanyId } from "./backendUtils/queries";
import { throwConvexError } from "./backendUtils/errors";
import { getBaseUrl } from "@/utils/helper";

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
      throwConvexError(ErrorMessages.USER_NOT_FOUND, {
        code: "NOT_FOUND",
        showToUser: true,
      });
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
      createCompanyRecords(ctx, companyId, slug),
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
    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const userId = identity.convexId as Id<"users">;
    const user = validateUser(await ctx.db.get(userId), true);

    const connectedAccount: Doc<"connectedAccounts"> | null = await ctx.db
      .query("connectedAccounts")
      .filter((q) => q.eq(q.field("customerId"), validatedCompany.customerId))
      .first();

    const companyContact: Doc<"companyContacts"> = validateCompanyContact(
      await ctx.db
        .query("companyContacts")
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
      user,
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

    const company = await validateCompany(ctx.db, companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    const compliance = await getFirstByCompanyId(
      ctx.db,
      "compliances",
      companyId,
      ErrorMessages.COMPLIANCE_NOT_FOUND
    );

    const webIntegrations = await getFirstByCompanyId(
      ctx.db,
      "webIntegrations",
      companyId,
      ErrorMessages.WEB_INTEGRATIONS_NOT_FOUND
    );

    const companyContact = await getFirstByCompanyId(
      ctx.db,
      "companyContacts",
      companyId,
      ErrorMessages.COMPANY_CONTACT_NOT_FOUND
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
  handler: async (
    ctx,
    args
  ): Promise<{ companyId: Id<"companies">; slug?: string }> => {
    const { companyId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await ctx.runQuery(
      internal.companies.getCompanyByIdInternal,
      {
        companyId,
      }
    );
    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );

    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    if (updates.name) {
      await updateClerkOrgName(
        validatedCompany.clerkOrganizationId,
        updates.name
      );
    }

    const result = await ctx.runMutation(
      internal.companies.updateCompanyInternal,
      {
        companyId,
        updates,
      }
    );

    if (updates.name) {
      const webIntegrations = await ctx.runQuery(
        internal.webIntegrations.getWebIntegrationsByCompanyId,
        {
          companyId,
        }
      );
      if (!webIntegrations) {
        throw new Error(ErrorMessages.WEB_INTEGRATIONS_NOT_FOUND);
      }
      const baseUrl = getBaseUrl();
      await ctx.runMutation(internal.webIntegrations.updateWebformUrl, {
        webIntegrationsId: webIntegrations._id,
        updates: {
          webform: `${baseUrl}/${result.slug}/new-move`,
        },
      });
    }

    return {
      companyId: result._id,
      slug: result.slug,
    };
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
  handler: async (ctx, args): Promise<Doc<"companies">> => {
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
    const company = await ctx.db.get(companyId);

    if (!company) {
      throw new Error(ErrorMessages.COMPANY_NOT_FOUND);
    }

    return company;
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

    const company = await validateCompany(ctx.db, companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(companyId, { imageUrl });

    return companyId;
  },
});

export const getCompanyClerkUserId = query({
  args: v.object({ clerkUserId: v.string() }),
  handler: async (
    ctx,
    { clerkUserId }
  ): Promise<{
    company: Doc<"companies"> | null;
    user: Doc<"users"> | null;
  } | null> => {
    const user = validateUser(
      await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkUserId"), clerkUserId))
        .first()
    );
    if (!user.companyId) {
      return { company: null, user };
    }
    const company = await ctx.db.get(user.companyId);

    return { company, user };
  },
});
