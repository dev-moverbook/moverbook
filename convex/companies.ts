// convex/companies.ts

import { ErrorMessages } from "@/types/errors";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { generateSlug, generateUniqueSlug } from "@/utils/helper";
import { CompanySchema, ConnectedAccountSchema } from "@/types/convex-schemas";
import {
  isUserInOrg,
  validateCompany,
  validateCompanyContact,
  validateCompliance,
  validateWebIntegrations,
} from "./backendUtils/validate";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import {
  GetCompanyDetailsResponse,
  GetCompanyIdBySlugResponse,
  UpdateCompanyLogoResponse,
  UpdateCompanyResponse,
} from "@/types/convex-responses";
import { createCompanyRecords, shouldExposeError } from "./backendUtils/helper";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { internal } from "./_generated/api";
import { updateClerkOrgName } from "./backendUtils/clerk";
import { Id } from "./_generated/dataModel";

export const createCompany = internalMutation({
  args: {
    clerkOrganizationId: v.string(),
    name: v.string(),
    clerkUserId: v.string(),
  },

  handler: async (ctx, args): Promise<string> => {
    const { clerkOrganizationId, name, clerkUserId } = args;

    try {
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
    } catch (error) {
      console.error(ErrorMessages.COMPANY_DB_CREATE_ERROR, error);
      throw new Error(ErrorMessages.COMPANY_DB_CREATE_ERROR);
    }
  },
});

export const getCompanyClerkOrgId = query({
  args: { clerkOrgId: v.string() },
  handler: async (ctx, args): Promise<CompanySchema | null> => {
    try {
      const company = await ctx.db
        .query("companies")
        .filter((q) => q.eq(q.field("clerkOrganizationId"), args.clerkOrgId))
        .first();

      return company || null;
    } catch (error) {
      console.error("Error finding organization by Clerk ID:", error);
      return null;
    }
  },
});

export const getCompanyClerkOrgIdInternal = internalQuery({
  args: { clerkOrgId: v.string() },
  handler: async (ctx, args): Promise<CompanySchema | null> => {
    try {
      const company = await ctx.db
        .query("companies")
        .filter((q) => q.eq(q.field("clerkOrganizationId"), args.clerkOrgId))
        .first();

      return company || null;
    } catch (error) {
      console.error("Error finding organization by Clerk ID:", error);
      throw new Error(ErrorMessages.COMPANY_DB_QUERY_BY_CLERK_ORG_ID);
    }
  },
});

export const getCompanyByIdInternal = internalQuery({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<CompanySchema | null> => {
    const { companyId } = args;
    try {
      return await ctx.db.get(companyId);
    } catch (error) {
      console.error(ErrorMessages.COMPANY_DB_QUERY_BY_ID, error);
      throw new Error(ErrorMessages.COMPANY_DB_QUERY_BY_ID);
    }
  },
});

export const getCompanyBySlugInternal = internalQuery({
  args: { slug: v.string() },
  handler: async (ctx, args): Promise<CompanySchema | null> => {
    const { slug } = args;
    try {
      return await ctx.db
        .query("companies")
        .filter((q) => q.eq(q.field("slug"), slug))
        .first();
    } catch (error) {
      console.error(ErrorMessages.COMPANY_DB_QUERY_BY_SLUG, error);
      throw new Error(ErrorMessages.COMPANY_DB_QUERY_BY_SLUG);
    }
  },
});

export const getCompanyIdBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args): Promise<GetCompanyIdBySlugResponse> => {
    const { slug } = args;
    try {
      const company = await ctx.db
        .query("companies")
        .filter((q) => q.eq(q.field("slug"), slug))
        .first();

      const validatedCompany = validateCompany(company);

      const connectedAccount: ConnectedAccountSchema | null = await ctx.db
        .query("connectedAccounts")
        .filter((q) => q.eq(q.field("customerId"), validatedCompany.customerId))
        .first();

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          companyId: validatedCompany._id,
          connectedAccountId: connectedAccount?.stripeAccountId || null,
          connectedAccountStatus: connectedAccount?.status || null,
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(errorMessage, error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: errorMessage,
      };
    }
  },
});

export const getCompanyDetails = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetCompanyDetailsResponse> => {
    const { companyId } = args;

    try {
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
        status: ResponseStatus.SUCCESS,
        data: {
          company,
          compliance,
          webIntegrations,
          companyContact,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: ErrorMessages.GENERIC_ERROR,
      };
    }
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

    try {
      const updatedFields: { name?: string; timeZone?: string; slug?: string } =
        {
          ...updates,
        };

      let slug: string | undefined;

      if (updates.name) {
        slug = await generateUniqueSlug(ctx, updates.name);
        updatedFields.slug = slug;
      }

      await ctx.db.patch(companyId, updatedFields);

      return { companyId, slug };
    } catch (error) {
      console.error("Error updating company:", error);
      throw new Error(ErrorMessages.COMPANY_DB_UPDATE);
    }
  },
});

export const updateCompanyLogo = mutation({
  args: {
    companyId: v.id("companies"),
    imageUrl: v.string(),
  },
  handler: async (ctx, args): Promise<UpdateCompanyLogoResponse> => {
    const { companyId, imageUrl } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(companyId, { imageUrl });

      return {
        status: ResponseStatus.SUCCESS,
        data: { companyId },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error("Internal Error:", errorMessage, error);

      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: shouldExposeError(errorMessage)
          ? errorMessage
          : ErrorMessages.GENERIC_ERROR,
      };
    }
  },
});
