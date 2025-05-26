import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import {
  isUserInOrg,
  validateCategory,
  validateCompany,
  validateItem,
} from "./backendUtils/validate";
import {
  GetItemsAndCategoriesAndRoomsByCompanyResponse,
  GetItemsByCategoryResponse,
  GetItemsByCompanyResponse,
  UpdateItemResponse,
} from "@/types/convex-responses";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { handleInternalError } from "./backendUtils/helper";
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
      return handleInternalError(error);
    }
  },
});

export const updateItem = mutation({
  args: {
    itemId: v.id("items"),
    updates: v.object({
      name: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
      size: v.optional(v.union(v.number(), CategorySizeConvex)),
      isPopular: v.optional(v.boolean()),
      weight: v.optional(v.number()),
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
      return handleInternalError(error);
    }
  },
});

export const createItem = mutation({
  args: {
    companyId: v.id("companies"),
    categoryId: v.optional(v.id("categories")),
    name: v.string(),
    size: v.union(v.number(), CategorySizeConvex),
    isPopular: v.optional(v.boolean()),
    weight: v.number(),
  },
  handler: async (ctx, args): Promise<UpdateItemResponse> => {
    const { companyId, categoryId, name, size, isPopular, weight } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      if (categoryId) {
        validateCategory(await ctx.db.get(categoryId));
      }

      const itemId = await ctx.db.insert("items", {
        companyId,
        categoryId,
        name,
        size,
        isActive: true,
        isStarter: false,
        isPopular: false,
        weight,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { itemId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getItemsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetItemsByCompanyResponse> => {
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

      const items = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: { items },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getItemsAndCategoriesAndRoomsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (
    ctx,
    args
  ): Promise<GetItemsAndCategoriesAndRoomsByCompanyResponse> => {
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

      const items = await ctx.db
        .query("items")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      const categories = await ctx.db
        .query("categories")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      const rooms = await ctx.db
        .query("rooms")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: { items, categories, rooms },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
