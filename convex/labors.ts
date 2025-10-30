import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateDocument,
  validateLaborDateOverlap,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { GetCompanyRatesData } from "@/types/convex-responses";
import { Doc } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { getFirstByCompanyId } from "./backendUtils/queries";

export const createLabor = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    isDefault: v.optional(v.boolean()),
    startDate: v.union(v.number(), v.null()),
    endDate: v.union(v.number(), v.null()),
    twoMovers: v.number(),
    threeMovers: v.number(),
    fourMovers: v.number(),
    extra: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const {
      companyId,
      name,
      isDefault,
      startDate,
      endDate,
      twoMovers,
      threeMovers,
      fourMovers,
      extra,
    } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    validateLaborDateOverlap(ctx, companyId, startDate, endDate);

    await ctx.db.insert("labors", {
      companyId,
      name,
      isDefault: isDefault ?? false,
      startDate,
      endDate,
      twoMovers,
      threeMovers,
      fourMovers,
      extra,
      isActive: true,
    });

    return true;
  },
});

export const updateLabor = mutation({
  args: {
    laborId: v.id("labors"),
    updates: v.object({
      name: v.optional(v.string()),
      isDefault: v.optional(v.boolean()),
      startDate: v.optional(v.union(v.number(), v.null())),
      endDate: v.optional(v.union(v.number(), v.null())),
      twoMovers: v.optional(v.number()),
      threeMovers: v.optional(v.number()),
      fourMovers: v.optional(v.number()),
      extra: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { laborId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const labor = await validateDocument(
      ctx.db,
      "labors",
      laborId,
      ErrorMessages.LABOR_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, labor.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await validateLaborDateOverlap(
      ctx,
      labor.companyId,
      updates.startDate ?? labor.startDate,
      updates.endDate ?? labor.endDate
    );

    await ctx.db.patch(laborId, updates);

    return true;
  },
});

export const getCompanyRates = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetCompanyRatesData> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const labor: Doc<"labors">[] = await ctx.db
      .query("labors")
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), companyId),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    const insurancePolicies: Doc<"insurancePolicies">[] = await ctx.db
      .query("insurancePolicies")
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), companyId),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    const travelFee = await getFirstByCompanyId(
      ctx.db,
      "travelFees",
      companyId,
      ErrorMessages.TRAVEL_FEE_NOT_FOUND
    );

    const creditCardFee = await getFirstByCompanyId(
      ctx.db,
      "creditCardFees",
      companyId,
      ErrorMessages.CREDIT_CARD_FEE_NOT_FOUND
    );

    const fees: Doc<"fees">[] = await ctx.db
      .query("fees")
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), companyId),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    return {
      labor,
      insurancePolicies,
      travelFee,
      creditCardFee,
      fees,
    };
  },
});
