import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateFee } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { handleInternalError } from "./backendUtils/helper";
import {
  CreateFeeResponse,
  GetFeesResponse,
  UpdateFeeResponse,
} from "@/types/convex-responses";
import { FeeSchema } from "@/types/convex-schemas";

export const createFee = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args): Promise<CreateFeeResponse> => {
    const { companyId, name, price } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const feeId = await ctx.db.insert("fees", {
        companyId,
        name,
        price,
        isActive: true,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { feeId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const updateFee = mutation({
  args: {
    feeId: v.id("fees"),
    updates: v.object({
      name: v.optional(v.string()),
      price: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateFeeResponse> => {
    const { feeId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const fee = validateFee(await ctx.db.get(feeId));
      const company = validateCompany(await ctx.db.get(fee.companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(feeId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { feeId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getFees = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<GetFeesResponse> => {
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

      const fees: FeeSchema[] = await ctx.db
        .query("fees")
        .withIndex("byCompanyId", (q) => q.eq("companyId", companyId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      const sortedFees = fees.sort((a, b) => a.name.localeCompare(b.name));

      return {
        status: ResponseStatus.SUCCESS,
        data: { fees: sortedFees },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
