// convex/companies.ts

import { ErrorMessages } from "@/types/errors";
import { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { generateSlug } from "@/utils/helper";

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
