import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import {
  isUserInOrg,
  validateCategory,
  validateCompany,
  validateItem,
} from "./backendUtils/validate";
import {
  GetItemsByCategoryResponse,
  UpdateItemResponse,
} from "@/types/convex-responses";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { shouldExposeError } from "./backendUtils/helper";
import { CategorySizeConvex } from "@/types/convex-enums";

export const getItemsByCategory = query({
  args: { companyId: v.id("companies"), categoryId: v.id("categories") },
  handler: async (ctx, args): Promise<GetItemsByCategoryResponse> => {
    const { companyId, categoryId } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const items = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .filter((q) => q.eq(q.field("categoryId"), categoryId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          items,
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

export const updateItem = mutation({
  args: {
    itemId: v.id("items"),
    updates: v.object({
      name: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
      size: v.optional(v.union(v.string(), CategorySizeConvex)),
      isPopular: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateItemResponse> => {
    const { itemId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const item = validateItem(await ctx.db.get(itemId));
      const company = validateCompany(await ctx.db.get(item.companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(itemId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { itemId },
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

export const createItem = mutation({
  args: {
    companyId: v.id("companies"),
    categoryId: v.id("categories"),
    name: v.string(),
    size: v.union(v.string(), CategorySizeConvex),
    isPopular: v.boolean(),
  },
  handler: async (ctx, args): Promise<UpdateItemResponse> => {
    const { companyId, categoryId, name, size, isPopular } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      validateCategory(await ctx.db.get(categoryId));

      const itemId = await ctx.db.insert("items", {
        companyId,
        categoryId,
        name,
        size,
        isActive: true,
        isStarter: false,
        isPopular,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { itemId },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(ErrorMessages.INTERNAL_ERROR, errorMessage, error);

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
