import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { handleInternalError } from "./backendUtils/helper";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import {
  validateArrivalWindow,
  validateCompany,
  validateCompanyContact,
  validateCreditCardFee,
  validateMove,
  validateMoveCustomer,
  validatePolicy,
  validateTravelFee,
  validateUser,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import {
  CreateMoveResponse,
  EnrichedMove,
  GetMoveContextResponse,
  GetMoveOptionsResponse,
  GetMoveResponse,
  GetMovesForCalendarResponse,
  GetMovesForMoverCalendarResponse,
  UpdateMoveResponse,
} from "@/types/convex-responses";
import {
  JobTypeConvex,
  MoveStatusConvex,
  MoveTimesConvex,
  ServiceTypesConvex,
  TravelChargingTypesConvex,
} from "@/types/convex-enums";
import {
  ArrivalTimesConvex,
  InsurancePolicyConvex,
  LocationConvex,
  MoveFeeConvex,
  MoveItemConvex,
  PaymentMethodConvex,
  SegmentDistanceConvex,
} from "./schema";
import { ErrorMessages } from "@/types/errors";
import { Doc, Id } from "./_generated/dataModel";
import { generateJobId } from "./backendUtils/nano";
import { HourStatus, MoverWageForMove } from "@/types/types";
import {
  buildMoverWageForMoveDisplay,
  enrichMoves,
  filterByMoveWindow,
  getCompanyMoves,
  getMoveCustomersMap,
  getUsersMapByIds,
  HourStatusMap,
  resolveMoverContext,
  scopeMovesToMover,
  sortByPriceOrder,
} from "./backendUtils/queryHelpers";

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
    arrivalTimes: ArrivalTimesConvex,
    companyId: v.id("companies"),
    creditCardFee: v.number(),
    deposit: v.number(),
    paymentMethod: PaymentMethodConvex,
    destinationToOrigin: v.union(v.null(), v.number()),
    endingMoveTime: v.union(v.null(), v.number()),
    jobType: JobTypeConvex,
    jobTypeRate: v.union(v.null(), v.number()),
    liabilityCoverage: v.union(v.null(), InsurancePolicyConvex),
    locations: v.array(LocationConvex),
    moveCustomerId: v.id("moveCustomers"),
    moveDate: v.union(v.null(), v.string()),
    moveFees: v.array(MoveFeeConvex),
    moveItems: v.array(MoveItemConvex),
    moveStatus: MoveStatusConvex,
    moveWindow: MoveTimesConvex,
    movers: v.number(),
    notes: v.union(v.null(), v.string()),
    officeToOrigin: v.union(v.null(), v.number()),
    roundTripDrive: v.union(v.null(), v.number()),
    roundTripMiles: v.union(v.null(), v.number()),
    salesRep: v.id("users"),
    segmentDistances: v.array(SegmentDistanceConvex),
    serviceType: v.union(v.null(), ServiceTypesConvex),
    startingMoveTime: v.union(v.null(), v.number()),
    totalMiles: v.union(v.null(), v.number()),
    travelFeeRate: v.optional(v.union(v.null(), v.number())),
    travelFeeMethod: v.optional(v.union(v.null(), TravelChargingTypesConvex)),
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

      const jobId = generateJobId(args.companyId);

      const moveId = await ctx.db.insert("move", {
        ...args,
        jobId,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { moveId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getMoveContext = query({
  args: { moveId: v.string() },
  handler: async (ctx, args): Promise<GetMoveContextResponse> => {
    const { moveId } = args;

    try {
      const normalizedId = ctx.db.normalizeId("move", moveId);
      if (!normalizedId) throw new Error(ErrorMessages.INVALID_MOVE_ID);

      const identity = await requireAuthenticatedUser(ctx);

      const move = validateMove(await ctx.db.get(normalizedId));
      const company = validateCompany(await ctx.db.get(move.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const quote = await ctx.db
        .query("quotes")
        .withIndex("by_move", (q) => q.eq("moveId", normalizedId))
        .first();

      const salesRepUser = validateUser(await ctx.db.get(move.salesRep));

      const companyContact = validateCompanyContact(
        await ctx.db
          .query("companyContact")
          .withIndex("by_companyId", (q) => q.eq("companyId", move.companyId))
          .first()
      );

      const moveCustomer = validateMoveCustomer(
        await ctx.db.get(move.moveCustomerId)
      );

      let wageDisplay: MoverWageForMove | null = null;

      const {
        isMover,
        moverId: selfMoverId,
        hourlyRate: selfHourlyRate,
      } = await resolveMoverContext(ctx, identity);

      console.log("isMover", isMover);
      console.log("selfMoverId", selfMoverId);
      console.log("selfHourlyRate", selfHourlyRate);

      let myAssignment: Doc<"moveAssignments"> | null = null;

      if (isMover && selfMoverId) {
        myAssignment = await ctx.db
          .query("moveAssignments")
          .withIndex("by_move_mover", (q) =>
            q.eq("moveId", normalizedId).eq("moverId", selfMoverId)
          )
          .first();

        if (!myAssignment) {
          throw new Error(ErrorMessages.MOVE_ASSIGNMENT_NOT_FOUND);
        }

        wageDisplay = buildMoverWageForMoveDisplay(
          move,
          myAssignment,
          selfHourlyRate
        );
      }

      const travelFee = validateTravelFee(
        await ctx.db
          .query("travelFee")
          .filter((q) => q.eq(q.field("companyId"), move.companyId))
          .first()
      );

      const policy = validatePolicy(
        await ctx.db
          .query("policies")
          .withIndex("by_companyId", (q) => q.eq("companyId", move.companyId))
          .first()
      );

      const additionalFees = await ctx.db
        .query("additionalFees")
        .withIndex("by_move", (q) => q.eq("moveId", normalizedId))
        .collect();

      const discounts = await ctx.db
        .query("discounts")
        .withIndex("by_move", (q) => q.eq("moveId", normalizedId))
        .collect();

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          additionalFees,
          discounts,
          move,
          quote,
          company,
          salesRepUser,
          companyContact,
          moveCustomer,
          myAssignment,
          wageDisplay,
          travelFee,
          policy,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const UpdateMoveFields = v.object({
  actualArrivalTime: v.optional(v.number()),
  actualBreakTime: v.optional(v.number()),
  actualStartTime: v.optional(v.number()),
  actualEndTime: v.optional(v.number()),
  arrivalTimes: v.optional(ArrivalTimesConvex),
  creditCardFee: v.optional(v.number()),
  deposit: v.optional(v.number()),
  paymentMethod: v.optional(PaymentMethodConvex),
  destinationToOrigin: v.optional(v.union(v.number(), v.null())),
  endingMoveTime: v.optional(v.union(v.number(), v.null())),
  invoiceAmountPaid: v.optional(v.number()),
  jobType: v.optional(JobTypeConvex),
  jobTypeRate: v.optional(v.union(v.number(), v.null())),
  liabilityCoverage: v.optional(v.union(InsurancePolicyConvex, v.null())),
  locations: v.optional(v.array(LocationConvex)),
  moveDate: v.optional(v.union(v.string(), v.null())),
  moveFees: v.optional(v.array(MoveFeeConvex)),
  moveItems: v.optional(v.array(MoveItemConvex)),
  moveStatus: v.optional(MoveStatusConvex),
  moveWindow: v.optional(MoveTimesConvex),
  movers: v.optional(v.number()),
  notes: v.optional(v.union(v.string(), v.null())),
  officeToOrigin: v.optional(v.union(v.number(), v.null())),
  referral: v.optional(v.union(v.string(), v.null())),
  roundTripDrive: v.optional(v.union(v.number(), v.null())),
  roundTripMiles: v.optional(v.union(v.number(), v.null())),
  salesRep: v.optional(v.id("users")),
  segmentDistances: v.optional(v.array(SegmentDistanceConvex)),
  serviceType: v.optional(v.union(ServiceTypesConvex, v.null())),
  startingMoveTime: v.optional(v.union(v.number(), v.null())),
  totalMiles: v.optional(v.union(v.number(), v.null())),
  trucks: v.optional(v.number()),
  travelFeeRate: v.optional(v.union(v.null(), v.number())),
  travelFeeMethod: v.optional(v.union(v.null(), TravelChargingTypesConvex)),
});

export const updateMove = mutation({
  args: {
    moveId: v.id("move"),
    updates: UpdateMoveFields,
  },
  handler: async (ctx, { moveId, updates }): Promise<UpdateMoveResponse> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.MOVER,
      ]);
      const move = validateMove(await ctx.db.get(moveId));
      const company = validateCompany(await ctx.db.get(move.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      console.log("updates", updates);

      await ctx.db.patch(moveId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { moveId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getMovesForCalendar = query({
  args: {
    start: v.string(),
    end: v.string(),
    companyId: v.id("companies"),
    moveTimeFilter: v.array(MoveTimesConvex),
    statuses: v.optional(v.array(v.string())),
    salesRepId: v.optional(v.union(v.id("users"), v.null())),
    priceOrder: v.optional(
      v.union(v.literal("asc"), v.literal("desc"), v.null())
    ),
    moverId: v.optional(v.union(v.id("users"), v.null())),
  },
  handler: async (ctx, args): Promise<GetMovesForCalendarResponse> => {
    const {
      start,
      end,
      companyId,
      statuses,
      salesRepId,
      priceOrder,
      moveTimeFilter,
      moverId,
    } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.MOVER,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      let {
        isMover,
        moverId: selfMoverId,
        hourlyRate: selfHourlyRate,
      } = await resolveMoverContext(ctx, identity);

      let moves = await getCompanyMoves(ctx, {
        companyId,
        start,
        end,
        statuses,
        salesRepId,
      });

      let moverWageByMoveId: Map<string, MoverWageForMove> = new Map();
      let hourStatusMap: HourStatusMap = new Map();

      if (isMover && selfMoverId) {
        const { moves: scopedMoves, assignmentMap } = await scopeMovesToMover(
          ctx,
          moves,
          selfMoverId
        );
        moves = scopedMoves;
        for (const m of moves) {
          const a = assignmentMap.get(m._id);
          if (a) {
            moverWageByMoveId.set(
              m._id,
              buildMoverWageForMoveDisplay(m, a, selfHourlyRate)
            );
          }
        }
        hourStatusMap = new Map(
          moves.map((m) => [
            m._id,
            assignmentMap.get(m._id)?.hourStatus as HourStatus | undefined,
          ])
        );
      }

      moves = filterByMoveWindow(moves, moveTimeFilter);
      moves = sortByPriceOrder(moves, priceOrder);

      const moveCustomerIds = moves.map((m) => m.moveCustomerId);
      const moveCustomerMap = await getMoveCustomersMap(ctx, moveCustomerIds);

      const salesRepIds = Array.from(
        new Set(moves.map((m) => m.salesRep).filter(Boolean))
      ) as Id<"users">[];
      const salesRepMap = await getUsersMapByIds(ctx, salesRepIds);

      const enrichedMoves: EnrichedMove[] = enrichMoves(moves, {
        moveCustomerMap,
        salesRepMap,
        moverWageForMove: isMover ? moverWageByMoveId : undefined,
        hourStatusMap: isMover ? hourStatusMap : undefined,
      });

      return { status: ResponseStatus.SUCCESS, data: { moves: enrichedMoves } };
    } catch (error) {
      console.error("Error in getMovesForCalendar:", error);
      return handleInternalError(error);
    }
  },
});

export const getMoveByIdInternal = internalQuery({
  args: {
    id: v.id("move"),
  },
  handler: async (ctx, args): Promise<Doc<"move"> | null> => {
    const { id } = args;
    try {
      return await ctx.db.get(id);
    } catch (error) {
      console.error("Error in getMoveByIdInternal:", error);
      throw new Error(ErrorMessages.MOVE_DB_QUERY_BY_ID);
    }
  },
});

export const getMove = query({
  args: { moveId: v.string() },
  handler: async (ctx, args): Promise<GetMoveResponse> => {
    const { moveId } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const normalizedId = ctx.db.normalizeId("move", moveId);
      if (!normalizedId) {
        throw new Error(ErrorMessages.INVALID_MOVE_ID);
      }

      const move = validateMove(await ctx.db.get(normalizedId));
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

export const getMovesForMoverCalendar = query({
  args: {
    start: v.string(),
    end: v.string(),
    moverId: v.union(v.id("users"), v.null()),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<GetMovesForMoverCalendarResponse> => {
    const { start, end, moverId, companyId } = args;
    console.log("querying getMovesForMoverCalendar");
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.MOVER,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      if (moverId === null) {
        console.log("getting all moves for company");
        const moves = await getCompanyMoves(ctx, {
          companyId,
          start,
          end,
          statuses: ["Booked"],
        });
        console.log("moves", moves);
        return { status: ResponseStatus.SUCCESS, data: { moves } };
      }

      validateUser(await ctx.db.get(moverId));

      const allMoves = await getCompanyMoves(ctx, {
        companyId,
        start,
        end,
      });

      const { moves: scopedMoves } = await scopeMovesToMover(
        ctx,
        allMoves,
        moverId
      );

      return {
        status: ResponseStatus.SUCCESS,
        data: { moves: scopedMoves },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
