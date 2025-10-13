import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ClerkRoles } from "@/types/enums";
import {
  isUserInOrg,
  validateCategory,
  validateCompany,
} from "./backendUtils/validate";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { Id } from "./_generated/dataModel";

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    updates: v.object({
      name: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"categories">> => {
    const { categoryId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const category = validateCategory(await ctx.db.get(categoryId));
    const company = validateCompany(await ctx.db.get(category.companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(categoryId, updates);

    return categoryId;
  },
});

export const createCategory = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    parentCategory: v.optional(v.id("categories")),
  },
  handler: async (ctx, args): Promise<Id<"categories">> => {
    const { companyId, name, parentCategory } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    if (parentCategory) {
      validateCategory(await ctx.db.get(parentCategory));
    }

    const categoryId = await ctx.db.insert("categories", {
      companyId,
      name,
      parentCategory,
      isActive: true,
      isStarter: false,
    });

    return categoryId;
  },
});
