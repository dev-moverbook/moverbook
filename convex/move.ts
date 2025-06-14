import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { handleInternalError } from "./backendUtils/helper";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import {
  validateArrivalWindow,
  validateCompany,
  validateCompanyContact,
  validateCreditCardFee,
  validateMove,
  validatePolicy,
  validateTravelFee,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import {
  CreateMoveResponse,
  GetMoveOptionsResponse,
  GetMoveResponse,
} from "@/types/convex-responses";
import {
  JobTypeConvex,
  MoveStatusConvex,
  MoveTimesConvex,
  ServiceTypesConvex,
} from "@/types/convex-enums";
import {
  ArrivalTimesConvex,
  InsurancePolicyConvex,
  LocationConvex,
  MoveFeeConvex,
  MoveItemConvex,
} from "./schema";

export const getMoveOptions = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetMoveOptionsResponse> => {
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

      const [
        rawArrivalWindow,
        labor,
        fees,
        insurancePolicies,
        rawTravelFee,
        rawUsers,
        rawReferrals,
        laborRates,
        rawCreditCardFees,
        rooms,
        categories,
        items,
        rawPolicy,
        rawCompanyContact,
      ] = await Promise.all([
        ctx.db
          .query("arrivalWindow")
          .withIndex("by_company", (q) => q.eq("companyId", companyId))
          .first(),
        ctx.db
          .query("labor")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("fees")
          .withIndex("byCompanyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("insurancePolicies")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("travelFee")
          .filter((q) => q.eq(q.field("companyId"), companyId))
          .first(),
        ctx.db
          .query("users")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("referrals")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("labor")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("creditCardFees")
          .filter((q) => q.eq(q.field("companyId"), companyId))
          .first(),
        ctx.db
          .query("rooms")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("categories")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("items")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect(),
        ctx.db
          .query("policies")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .first(),
        ctx.db
          .query("companyContact")
          .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
          .first(),
      ]);

      const salesReps = rawUsers
        .filter((user) =>
          [ClerkRoles.ADMIN, ClerkRoles.MANAGER, ClerkRoles.SALES_REP].includes(
            user.role as ClerkRoles
          )
        )
        .sort((a, b) => a.name.localeCompare(b.name));

      const referrals = rawReferrals.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      const arrivalWindow = validateArrivalWindow(rawArrivalWindow);
      const travelFee = validateTravelFee(rawTravelFee);
      const creditCardFee = validateCreditCardFee(rawCreditCardFees);
      const policy = validatePolicy(rawPolicy);
      const companyContact = validateCompanyContact(rawCompanyContact);
      return {
        status: ResponseStatus.SUCCESS,
        data: {
          arrivalWindow,
          labor,
          fees,
          insurancePolicies,
          travelFee,
          salesReps,
          referrals,
          laborRates,
          creditCardFee,
          rooms,
          categories,
          items,
          policy,
          companyContact,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const createMove = mutation({
  args: {
    altPhoneNumber: v.union(v.null(), v.string()),
    arrivalTimes: ArrivalTimesConvex,
    companyId: v.id("companies"),
    deposit: v.union(v.null(), v.number()),
    destinationToOrigin: v.union(v.null(), v.number()),
    email: v.union(v.null(), v.string()),
    endingMoveTime: v.union(v.null(), v.number()),
    jobType: JobTypeConvex,
    jobTypeRate: v.union(v.null(), v.number()),
    liabilityCoverage: v.union(v.null(), InsurancePolicyConvex),
    locations: v.array(LocationConvex),
    moveDate: v.union(v.null(), v.string()),
    moveFees: v.array(MoveFeeConvex),
    moveItems: v.array(MoveItemConvex),
    salesRep: v.id("users"),
    moveWindow: MoveTimesConvex,
    movers: v.number(),
    name: v.string(),
    notes: v.union(v.null(), v.string()),
    officeToOrigin: v.union(v.null(), v.number()),
    phoneNumber: v.union(v.null(), v.string()),
    referral: v.union(v.null(), v.string()),
    roundTripDrive: v.union(v.null(), v.number()),
    roundTripMiles: v.union(v.null(), v.number()),
    serviceType: v.union(v.null(), ServiceTypesConvex),
    startingMoveTime: v.union(v.null(), v.number()),
    status: MoveStatusConvex,
    totalMiles: v.union(v.null(), v.number()),
    trucks: v.number(),
  },
  handler: async (ctx, args): Promise<CreateMoveResponse> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const company = validateCompany(await ctx.db.get(args.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const moveId = await ctx.db.insert("move", args);

      return {
        status: ResponseStatus.SUCCESS,
        data: { moveId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getMove = query({
  args: { moveId: v.id("move") },
  handler: async (ctx, args): Promise<GetMoveResponse> => {
    const { moveId } = args;
    try {
      const identity = await requireAuthenticatedUser(ctx);

      const move = validateMove(await ctx.db.get(moveId));

      const company = validateCompany(await ctx.db.get(move.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      return {
        status: ResponseStatus.SUCCESS,
        data: { move },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
