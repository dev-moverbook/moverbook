import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { ClerkRoles } from "@/types/enums";
import {
  isUserInOrg,
  validateCategory,
  validateCompany,
  validateDocument,
} from "./backendUtils/validate";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ErrorMessages } from "@/types/errors";

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    updates: v.object({
      name: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { categoryId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const category = await validateDocument(
      ctx.db,
      "categories",
      categoryId,
      ErrorMessages.CATEGORY_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, category.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(categoryId, updates);

    return true;
  },
});

export const createCategory = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    parentCategory: v.optional(v.id("categories")),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, name, parentCategory } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    if (parentCategory) {
      validateCategory(await ctx.db.get(parentCategory));
    }

    await ctx.db.insert("categories", {
      companyId,
      name,
      parentCategory,
      isActive: true,
      isStarter: false,
    });

    return true;
  },
});
