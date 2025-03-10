import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import {
  isUserInOrg,
  validateCategory,
  validateCompany,
} from "./backendUtils/validate";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { shouldExposeError } from "./backendUtils/helper";
import { CategorySchema } from "@/types/convex-schemas";
import {
  GetCategoriesResponse,
  UpdateCategoryResponse,
} from "@/types/convex-responses";

export const getTopLevelCategories = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetCategoriesResponse> => {
    const { companyId } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const categories: CategorySchema[] = await ctx.db
        .query("categories")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .filter((q) => q.eq(q.field("parentCategory"), undefined)) // No parent category
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          categories,
        },
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

export const getSubcategories = query({
  args: { parentCategory: v.id("categories") },
  handler: async (ctx, args): Promise<GetCategoriesResponse> => {
    const { parentCategory } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const currentCategeory = validateCategory(
        await ctx.db.get(parentCategory)
      );
      const company = validateCompany(
        await ctx.db.get(currentCategeory.companyId)
      );
      isUserInOrg(identity, company.clerkOrganizationId);

      const categories = await ctx.db
        .query("categories")
        .filter((q) =>
          q.and(
            q.eq(q.field("parentCategory"), parentCategory),
            q.eq(q.field("isActive"), true)
          )
        )
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          categories,
        },
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

export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    updates: v.object({
      name: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateCategoryResponse> => {
    const { categoryId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const category = validateCategory(await ctx.db.get(categoryId));
      const company = validateCompany(await ctx.db.get(category.companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(categoryId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { categoryId },
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

export const createCategory = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    parentCategory: v.optional(v.id("categories")),
  },
  handler: async (ctx, args): Promise<UpdateCategoryResponse> => {
    const { companyId, name, parentCategory } = args;

    try {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: { categoryId },
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
