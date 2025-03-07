// convex/companies.ts

import { ErrorMessages } from "@/types/errors";
import { Id } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { generateSlug } from "@/utils/helper";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { CompanySchema } from "@/types/convex-schemas";

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

      const baseSlug = generateSlug(name);
      let slug = baseSlug;
      let suffix = 1;

      while (true) {
        const existing = await ctx.db
          .query("companies")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .first();

        if (!existing) break; // Slug is unique

        slug = `${baseSlug}-${suffix++}`; // Append suffix if not unique
      }

      const companyId = await ctx.db.insert("companies", {
        calendarEmail: null,
        clerkOrganizationId,
        companyEmail: null,
        companyPhone: null,
        customerId: user.customerId,
        imageUrl: null,
        isActive: true,
        name,
        slug,
      });

      await ctx.db.patch(user._id, {
        companyId,
      });
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
