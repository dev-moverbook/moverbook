import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import {
  isUserInOrg,
  validateCategory,
  validateCompany,
  validateDocument,
} from "./backendUtils/validate";
import {
  GetItemsAndCategoriesAndRoomsByCompanyData,
  GetItemsByCategoryResponse,
} from "@/types/convex-responses";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { handleInternalError } from "./backendUtils/helper";
import { Id } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";

// To be deleted
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

      const company = await validateCompany(ctx.db, companyId);
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
      size: v.optional(v.union(v.number())),
      isPopular: v.optional(v.boolean()),
      weight: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"items">> => {
    const { itemId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const item = await validateDocument(
      ctx.db,
      "items",
      itemId,
      ErrorMessages.ITEM_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, item.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(itemId, updates);

    return itemId;
  },
});

export const createItem = mutation({
  args: {
    companyId: v.id("companies"),
    categoryId: v.optional(v.id("categories")),
    name: v.string(),
    size: v.number(),
    isPopular: v.optional(v.boolean()),
    weight: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, categoryId, name, size, weight } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    if (categoryId) {
      validateCategory(await ctx.db.get(categoryId));
    }

    await ctx.db.insert("items", {
      companyId,
      categoryId,
      name,
      size,
      isActive: true,
      isStarter: false,
      isPopular: false,
      weight,
    });

    return true;
  },
});

// To be deleted
export const getItemsAndCategoriesAndRoomsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (
    ctx,
    args
  ): Promise<GetItemsAndCategoriesAndRoomsByCompanyData> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.CUSTOMER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
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
      items,
      categories,
      rooms,
    };
  },
});
