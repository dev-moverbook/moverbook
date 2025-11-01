import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import {
  buildHistoricalSeries,
  getApprovedPayTotalsForMoves,
  toIsoDateInTimeZone,
} from "./backendUtils/helper";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles } from "@/types/enums";
import {
  validateCompany,
  validateDocument,
  validateMoveCustomer,
  validatePolicy,
  validateTravelFee,
  validateUser,
  validateCompanyContact,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import {
  EnrichedMove,
  GetMoveOptionsData,
  GetMoveData,
} from "@/types/convex-responses";
import {
  JobTypeConvex,
  LocationTypeConvex,
  MoveSizeConvex,
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
import {
  ForecastPoint,
  FunnelPoint,
  HistoricalPoint,
  IdAndName,
  MoveAnalyticsPoint,
  MoverWageForMove,
  StackedDay,
} from "@/types/types";
import {
  buildMoverWageForMoveDisplay,
  countByTimestamp,
  enrichMoves,
  filterByMoveWindow,
  getCompanyMoves,
  matchesFilters,
  resolveMoverContext,
  scopeMovesToMover,
  sortByPriceOrder,
  buildStatusTimestampPatch,
} from "./backendUtils/queryHelpers";
import {
  buildDailyAveragesSeries,
  buildForecastedSeries,
  buildStackedForecastedRevenueSeriesByName,
  buildStackedHistoricalRevenueSeriesByName,
} from "./backendUtils/analyticsHelper";
import {
  formatTimeLower,
  toEpochRangeForDates,
} from "./backendUtils/luxonHelper";
import { UNKNOWN_NAME } from "@/types/const";
import {
  scopeToMoverIfNeeded,
  buildReferenceMaps,
} from "./backendUtils/moveHelper";
import { getFirstByCompanyId } from "./backendUtils/queries";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { internal } from "./_generated/api";

export const getMoveOptions = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetMoveOptionsData> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const [
      arrivalWindow,
      laborList,
      feeList,
      insurancePolicyList,
      travelFee,
      activeUsers,
      activeReferrals,
      creditCardFee,
      roomList,
      categoryList,
      itemList,
      policy,
      companyContact,
    ] = await Promise.all([
      getFirstByCompanyId(
        ctx.db,
        "arrivalWindows",
        companyId,
        ErrorMessages.ARRIVAL_WINDOW_NOT_FOUND
      ),
      ctx.db
        .query("labors")
        .withIndex("by_companyId", (index) => index.eq("companyId", companyId))
        .filter((qb) => qb.eq(qb.field("isActive"), true))
        .collect(),
      ctx.db
        .query("fees")
        .withIndex("byCompanyId", (index) => index.eq("companyId", companyId))
        .filter((qb) => qb.eq(qb.field("isActive"), true))
        .collect(),
      ctx.db
        .query("insurancePolicies")
        .withIndex("by_companyId", (index) => index.eq("companyId", companyId))
        .filter((qb) => qb.eq(qb.field("isActive"), true))
        .collect(),
      getFirstByCompanyId(
        ctx.db,
        "travelFees",
        companyId,
        ErrorMessages.TRAVEL_FEE_NOT_FOUND
      ),
      ctx.db
        .query("users")
        .withIndex("by_companyId", (index) => index.eq("companyId", companyId))
        .filter((qb) => qb.eq(qb.field("isActive"), true))
        .collect(),
      ctx.db
        .query("referrals")
        .withIndex("by_companyId", (index) => index.eq("companyId", companyId))
        .filter((qb) => qb.eq(qb.field("isActive"), true))
        .collect(),
      getFirstByCompanyId(
        ctx.db,
        "creditCardFees",
        companyId,
        ErrorMessages.CREDIT_CARD_FEE_NOT_FOUND
      ),
      ctx.db
        .query("rooms")
        .withIndex("by_companyId", (index) => index.eq("companyId", companyId))
        .filter((qb) => qb.eq(qb.field("isActive"), true))
        .collect(),
      ctx.db
        .query("categories")
        .withIndex("by_companyId", (index) => index.eq("companyId", companyId))
        .filter((qb) => qb.eq(qb.field("isActive"), true))
        .collect(),
      ctx.db
        .query("items")
        .withIndex("by_companyId", (index) => index.eq("companyId", companyId))
        .filter((qb) => qb.eq(qb.field("isActive"), true))
        .collect(),
      getFirstByCompanyId(
        ctx.db,
        "policies",
        companyId,
        ErrorMessages.POLICY_NOT_FOUND
      ),
      getFirstByCompanyId(
        ctx.db,
        "companyContacts",
        companyId,
        ErrorMessages.COMPANY_CONTACT_NOT_FOUND
      ),
    ]);

    const salesReps = activeUsers
      .filter((user) =>
        [ClerkRoles.ADMIN, ClerkRoles.MANAGER, ClerkRoles.SALES_REP].includes(
          user.role as ClerkRoles
        )
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    const referrals = activeReferrals.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return {
      arrivalWindow,
      labor: laborList,
      fees: feeList,
      insurancePolicies: insurancePolicyList,
      travelFee,
      salesReps,
      referrals,
      laborRates: laborList,
      creditCardFee,
      rooms: roomList,
      categories: categoryList,
      items: itemList,
      policy,
      companyContact,
    };
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
    referralId: v.id("referrals"),
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
  handler: async (ctx, args): Promise<Id<"moves">> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, args.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const jobId = generateJobId(args.companyId);

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(args.moveCustomerId)
    );

    const moveId = await ctx.db.insert("moves", {
      ...args,
      jobId,
    });

    const userId = identity.convexId as Id<"users">;
    const user = validateUser(await ctx.db.get(userId));

    const moveDate = args.moveDate
      ? formatMonthDayLabelStrict(args.moveDate)
      : "TBD";

    // ToDo calculate amount

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        amount: 0,
        type: "MOVE_CREATED",
        body: `**${user.name}** booked a move **${moveCustomer.name}** **${moveDate}**`,
        companyId: args.companyId,
        userId: user._id,
        moveId,
        context: {
          customerName: moveCustomer.name,
          moveDate,
          salesRepName: user.name,
        },
      },
    });

    return moveId;
  },
});

export const getMoveContext = query({
  args: { moveId: v.string() },
  handler: async (ctx, args): Promise<GetMoveData> => {
    const { moveId } = args;

    const normalizedMoveId = ctx.db.normalizeId("moves", moveId);
    if (!normalizedMoveId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: ErrorMessages.INVALID_MOVE_ID,
      });
    }

    const [identity, move] = await Promise.all([
      requireAuthenticatedUser(ctx),
      validateDocument(
        ctx.db,
        "moves",
        normalizedMoveId,
        ErrorMessages.MOVE_NOT_FOUND
      ),
    ]);

    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const moverContextPromise = resolveMoverContext(ctx, identity);

    const [
      quote,
      salesRepUserDoc,
      companyContactDoc,
      moveCustomerDoc,
      travelFeeDoc,
      policyDoc,
      additionalFees,
      discounts,
      moverContext,
    ] = await Promise.all([
      ctx.db
        .query("quotes")
        .withIndex("by_move", (q) => q.eq("moveId", normalizedMoveId))
        .first(),
      ctx.db.get(move.salesRep),
      ctx.db
        .query("companyContacts")
        .filter((q) => q.eq(q.field("companyId"), move.companyId))
        .first(),
      ctx.db.get(move.moveCustomerId),
      ctx.db
        .query("travelFees")
        .filter((q) => q.eq(q.field("companyId"), move.companyId))
        .first(),
      ctx.db
        .query("policies")
        .withIndex("by_companyId", (q) => q.eq("companyId", move.companyId))
        .first(),
      ctx.db
        .query("additionalFees")
        .withIndex("by_move", (q) => q.eq("moveId", normalizedMoveId))
        .collect(),
      ctx.db
        .query("discounts")
        .withIndex("by_move", (q) => q.eq("moveId", normalizedMoveId))
        .collect(),
      moverContextPromise,
    ]);

    const salesRepUser = validateUser(salesRepUserDoc);
    const companyContact = validateCompanyContact(companyContactDoc);
    const moveCustomer = validateMoveCustomer(moveCustomerDoc);
    const travelFee = validateTravelFee(travelFeeDoc);
    const policy = validatePolicy(policyDoc);

    let myAssignment: Doc<"moveAssignments"> | null = null;
    let wageDisplay: MoverWageForMove | null = null;

    const {
      isMover,
      moverId: selfMoverId,
      hourlyRate: selfHourlyRate,
    } = moverContext;

    if (isMover && selfMoverId) {
      myAssignment = await ctx.db
        .query("moveAssignments")
        .withIndex("by_move_mover", (q) =>
          q.eq("moveId", normalizedMoveId).eq("moverId", selfMoverId)
        )
        .first();

      if (!myAssignment) {
        throw new ConvexError({
          code: "NOT_FOUND",
          message: ErrorMessages.MOVE_ASSIGNMENT_NOT_FOUND,
        });
      }

      wageDisplay = buildMoverWageForMoveDisplay(
        move,
        myAssignment,
        selfHourlyRate
      );
    }

    return {
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
    };
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
  referralId: v.optional(v.id("referrals")),
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
    moveId: v.id("moves"),
    updates: UpdateMoveFields,
    effectiveAt: v.optional(v.number()),
  },
  handler: async (ctx, { moveId, updates, effectiveAt }): Promise<boolean> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const moveRecord = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, moveRecord.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    let statusPatch: Partial<Doc<"moves">> = {};
    if (updates.moveStatus) {
      const desiredStatus = updates.moveStatus;
      const whenMs = typeof effectiveAt === "number" ? effectiveAt : Date.now();
      statusPatch = buildStatusTimestampPatch(
        moveRecord,
        desiredStatus,
        whenMs
      );
    }

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(moveRecord.moveCustomerId)
    );
    const userId = identity.convexId as Id<"users">;
    const user = validateUser(await ctx.db.get(userId));

    await ctx.db.patch(moveId, { ...updates, ...statusPatch });

    let moveDate: string;
    if (updates.moveDate) {
      moveDate = formatMonthDayLabelStrict(updates.moveDate);
    } else if (moveRecord.moveDate) {
      moveDate = formatMonthDayLabelStrict(new Date(moveRecord.moveDate));
    } else {
      moveDate = "TBD";
    }

    switch (true) {
      case !!updates.actualArrivalTime:
        await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "MOVE_ARRIVAL",
            body: `**${user.name}** arrived at **${formatTimeLower(
              updates.actualArrivalTime,
              company.timeZone
            )}** for **${moveCustomer.name}**`,
            companyId: moveRecord.companyId,
            userId: user._id,
            moveId,
            context: {
              customerName: moveCustomer.name,
              moverName: user.name,
              time: updates.actualArrivalTime,
            },
          },
        });
        return true;

      case !!updates.actualStartTime:
        await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "MOVE_STARTED",
            body: `**${user.name}** started **${moveCustomer.name}** move at ${formatTimeLower(
              updates.actualStartTime,
              company.timeZone
            )}`,
            companyId: moveRecord.companyId,
            userId: user._id,
            moveId,
            context: {
              customerName: moveCustomer.name,
              moverName: user.name,
              time: updates.actualStartTime,
            },
          },
        });
        return true;

      case !!updates.actualEndTime:
        await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "MOVE_COMPLETED",
            body: `**${user.name}** completed move for **${moveCustomer.name}** at ${formatTimeLower(
              updates.actualEndTime,
              company.timeZone
            )}`,
            companyId: moveRecord.companyId,
            userId: user._id,
            moveId,
            context: {
              customerName: moveCustomer.name,
              moverName: user.name,
              time: updates.actualEndTime,
            },
          },
        });
        return true;
      case !!updates.actualBreakTime:
        await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "MOVE_BREAK_UPDATED",
            body: `**${user.name}** updated break for **${moveCustomer.name}** at ${formatTimeLower(
              updates.actualBreakTime,
              company.timeZone
            )}`,
            companyId: moveRecord.companyId,
            userId: user._id,
            moveId,
            context: {
              customerName: moveCustomer.name,
              moverName: user.name,
              time: updates.actualBreakTime,
              moveDate,
            },
          },
        });
        return true;

      case !!updates.moveStatus:
        await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "MOVE_STATUS_UPDATED",
            companyId: moveRecord.companyId,
            body: `**${moveCustomer.name}** **${moveDate}** is now marked as **${updates.moveStatus}**`,
            moveCustomerId: moveCustomer._id,
            moveId,
            context: {
              customerName: moveCustomer.name,
              moveDate,
              moveStatus: updates.moveStatus,
            },
          },
        });
        return true;

      default:
        await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "MOVE_UPDATED",
            body: `**${user.name}** updated move for **${moveCustomer.name}**  **${moveDate}**`,
            companyId: moveRecord.companyId,
            moveId,
            context: {
              customerName: moveCustomer.name,
              moveDate,
              salesRepName: user.name,
            },
            userId: user._id,
          },
        });
        return true;
    }
  },
});

export const getMovesForCalendar = query({
  args: {
    start: v.string(),
    end: v.string(),
    companyId: v.id("companies"),
    moveTimeFilter: v.array(MoveTimesConvex),
    statuses: v.optional(v.array(MoveStatusConvex)),
    salesRepId: v.optional(v.union(v.id("users"), v.null())),
    priceOrder: v.optional(
      v.union(v.literal("asc"), v.literal("desc"), v.null())
    ),
  },
  handler: async (ctx, args): Promise<EnrichedMove[]> => {
    const {
      start,
      end,
      companyId,
      statuses,
      salesRepId,
      priceOrder,
      moveTimeFilter,
    } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const {
      isMover,
      moverId: currentUserMoverId,
      hourlyRate: currentUserHourlyRate,
    } = await resolveMoverContext(ctx, identity);

    const companyMoves = await getCompanyMoves(ctx, {
      companyId,
      start,
      end,
      statuses,
      salesRepId,
    });

    const {
      scopedMoves,
      moverWageByMoveId,
      hourStatusByMoveId,
      isScopedToMover,
    } = await scopeToMoverIfNeeded(
      ctx,
      companyMoves,
      currentUserMoverId ?? undefined,
      isMover,
      currentUserHourlyRate ?? undefined
    );

    const filteredMoves = filterByMoveWindow(scopedMoves, moveTimeFilter);
    const sortedMoves = sortByPriceOrder(filteredMoves, priceOrder);

    const { moveCustomerMap, salesRepMap } = await buildReferenceMaps(
      ctx,
      sortedMoves
    );
    const enrichedMoves = enrichMoves(sortedMoves, {
      moveCustomerMap: Object.fromEntries(moveCustomerMap),
      salesRepMap: Object.fromEntries(salesRepMap),
      moverWageForMove: isScopedToMover ? moverWageByMoveId : undefined,
      hourStatusMap: isScopedToMover ? hourStatusByMoveId : undefined,
    });

    return enrichedMoves;
  },
});

export const getMoveByIdInternal = internalQuery({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"moves"> | null> => {
    const { moveId } = args;
    return await ctx.db.get(moveId);
  },
});

export const getMove = query({
  args: { moveId: v.string() },
  handler: async (ctx, args): Promise<Doc<"moves">> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const normalizedId = ctx.db.normalizeId("moves", moveId);
    if (!normalizedId) {
      throw new Error(ErrorMessages.INVALID_MOVE_ID);
    }

    const move = await validateDocument(
      ctx.db,
      "moves",
      normalizedId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    return move;
  },
});

export const getMovesForMoverCalendar = query({
  args: {
    start: v.string(),
    end: v.string(),
    moverId: v.union(v.id("users"), v.null()),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Doc<"moves">[]> => {
    const { start, end, moverId, companyId } = args;
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    if (!moverId) {
      const moves = await getCompanyMoves(ctx, {
        companyId,
        start,
        end,
        statuses: ["Booked"],
      });
      return moves;
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

    return scopedMoves;
  },
});

export const getHistoricalAnalytics = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.string(),
    endDate: v.string(),
    salesRepId: v.union(v.id("users"), v.null()),
    referralId: v.union(v.id("referrals"), v.null()),
  },
  handler: async (ctx, args): Promise<HistoricalPoint[]> => {
    const { companyId, startDate, endDate, salesRepId, referralId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);
    const timeZone = company.timeZone;

    const startDay = toIsoDateInTimeZone(startDate, timeZone);
    const endDay = toIsoDateInTimeZone(endDate, timeZone);

    const moves = await getCompanyMoves(ctx, {
      companyId,
      start: startDay,
      end: endDay,
      statuses: ["Completed"],
      salesRepId,
      referralId,
    });

    const expenseByMoveId = await getApprovedPayTotalsForMoves(
      ctx,
      moves.map((move) => move._id)
    );

    const series = buildHistoricalSeries(
      startDay,
      endDay,
      moves,
      timeZone,
      expenseByMoveId
    );
    return series;
  },
});

export const getForecastedAnalytics = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.string(),
    endDate: v.string(),
    salesRepId: v.union(v.id("users"), v.null()),
    referralId: v.union(v.id("referrals"), v.null()),
  },
  handler: async (ctx, args): Promise<ForecastPoint[]> => {
    const { companyId, startDate, endDate, salesRepId, referralId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);
    const timeZone = company.timeZone;

    const startDay = toIsoDateInTimeZone(startDate, timeZone);
    const endDay = toIsoDateInTimeZone(endDate, timeZone);

    const moves = await getCompanyMoves(ctx, {
      companyId,
      start: startDay,
      end: endDay,
      statuses: ["New Lead", "Quoted", "Booked"],
      salesRepId,
      referralId,
    });

    const series = buildForecastedSeries(endDay, moves, startDay, timeZone);

    return series;
  },
});

export const getMoveAnalytics = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.string(),
    endDate: v.string(),
    serviceType: v.union(v.null(), ServiceTypesConvex),
    moveSize: v.union(v.null(), MoveSizeConvex),
    numberOfMovers: v.union(v.null(), v.number()),
    locationType: v.union(v.null(), LocationTypeConvex),
  },
  handler: async (ctx, args): Promise<MoveAnalyticsPoint[]> => {
    const {
      companyId,
      startDate,
      endDate,
      serviceType,
      moveSize,
      numberOfMovers,
      locationType,
    } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const timeZone = company.timeZone;

    const startDay = toIsoDateInTimeZone(startDate, timeZone);
    const endDay = toIsoDateInTimeZone(endDate, timeZone);

    const moves = await getCompanyMoves(ctx, {
      companyId,
      start: startDay,
      end: endDay,
      statuses: ["Completed"],
      serviceType,
      moveSize,
      numberOfMovers,
      locationType,
    });

    const series = buildDailyAveragesSeries(endDay, moves, startDay, timeZone);

    return series;
  },
});

export const getFunnel = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.string(),
    endDate: v.string(),
    salesRepId: v.union(v.id("users"), v.null()),
    referralId: v.union(v.id("referrals"), v.null()),
  },
  handler: async (ctx, args): Promise<FunnelPoint[]> => {
    const { companyId, startDate, endDate, salesRepId, referralId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const { startMs, endMs } = toEpochRangeForDates(
      startDate,
      endDate,
      company.timeZone
    );

    const moves = await ctx.db
      .query("moves")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .collect();

    const candidateMoves = moves.filter((moveRecord) =>
      matchesFilters(moveRecord, salesRepId, referralId)
    );

    const leadCount = countByTimestamp(
      candidateMoves,
      (move) => move._creationTime,
      startMs,
      endMs
    );
    const quotedCount = countByTimestamp(
      candidateMoves,
      (move) => move.quotedAt ?? null,
      startMs,
      endMs
    );
    const bookedCount = countByTimestamp(
      candidateMoves,
      (move) => move.bookedAt ?? null,
      startMs,
      endMs
    );
    const completedCount = countByTimestamp(
      candidateMoves,
      (move) => move.completedAt ?? null,
      startMs,
      endMs
    );

    const funnel: FunnelPoint[] = [
      { status: "Leads", value: leadCount },
      { status: "Quoted", value: quotedCount },
      { status: "Booked", value: bookedCount },
      { status: "Completed", value: completedCount },
    ];

    return funnel;
  },
});

export const getStackedForecastedRevenueByRep = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args): Promise<StackedDay[]> => {
    const { companyId, startDate, endDate } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const timeZone = company.timeZone;

    const startDay = toIsoDateInTimeZone(startDate, timeZone);
    const endDay = toIsoDateInTimeZone(endDate, timeZone);

    const moves = await getCompanyMoves(ctx, {
      companyId,
      start: startDay,
      end: endDay,
      statuses: ["New Lead", "Quoted", "Booked"],
    });

    const reps = await ctx.db
      .query("users")
      .withIndex("by_companyId", (query) => query.eq("companyId", companyId))
      .filter((query) =>
        query.or(
          query.eq(query.field("role"), ClerkRoles.SALES_REP),
          query.eq(query.field("role"), ClerkRoles.ADMIN),
          query.eq(query.field("role"), ClerkRoles.MANAGER)
        )
      )
      .filter((query) => query.eq(query.field("isActive"), true))
      .collect();

    const repNames: IdAndName[] = reps.map((rep) => ({
      id: rep._id as string,
      name: rep.name ?? UNKNOWN_NAME,
    }));

    const series = buildStackedForecastedRevenueSeriesByName(
      endDay,
      moves,
      repNames,
      startDay,
      timeZone,
      (m) => m.salesRep
    );

    return series;
  },
});

export const getStackedForecastedRevenueBySource = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args): Promise<StackedDay[]> => {
    const { companyId, startDate, endDate } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const timeZone = company.timeZone;

    const startDay = toIsoDateInTimeZone(startDate, timeZone);
    const endDay = toIsoDateInTimeZone(endDate, timeZone);

    const moves = await getCompanyMoves(ctx, {
      companyId,
      start: startDay,
      end: endDay,
      statuses: ["New Lead", "Quoted", "Booked"],
    });

    const sources = await ctx.db
      .query("referrals")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const sourceNames: IdAndName[] = sources.map((source) => ({
      id: source._id as string,
      name: source.name ?? UNKNOWN_NAME,
    }));

    const series = buildStackedForecastedRevenueSeriesByName(
      endDay,
      moves,
      sourceNames,
      startDay,
      timeZone,
      (m) => m.referralId
    );

    return series;
  },
});

export const getStackedHistoricalRevenueByRep = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args): Promise<StackedDay[]> => {
    const { companyId, startDate, endDate } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const timeZone = company.timeZone;

    const startDay = toIsoDateInTimeZone(startDate, timeZone);
    const endDay = toIsoDateInTimeZone(endDate, timeZone);

    const moves = await getCompanyMoves(ctx, {
      companyId,
      start: startDay,
      end: endDay,
      statuses: ["Completed"],
    });

    const reps = await ctx.db
      .query("users")
      .withIndex("by_companyId", (query) => query.eq("companyId", companyId))
      .filter((query) =>
        query.or(
          query.eq(query.field("role"), ClerkRoles.SALES_REP),
          query.eq(query.field("role"), ClerkRoles.ADMIN),
          query.eq(query.field("role"), ClerkRoles.MANAGER)
        )
      )
      .filter((query) => query.eq(query.field("isActive"), true))
      .collect();

    const repNames: IdAndName[] = reps.map((rep) => ({
      id: rep._id as string,
      name: rep.name ?? UNKNOWN_NAME,
    }));

    const series = buildStackedHistoricalRevenueSeriesByName(
      endDay,
      moves,
      repNames,
      startDay,
      timeZone,
      (m) => m.salesRep
    );

    return series;
  },
});

export const getStackedHistoricalRevenueBySource = query({
  args: {
    companyId: v.id("companies"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args): Promise<StackedDay[]> => {
    const { companyId, startDate, endDate } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const timeZone = company.timeZone;

    const startDay = toIsoDateInTimeZone(startDate, timeZone);
    const endDay = toIsoDateInTimeZone(endDate, timeZone);

    const moves = await getCompanyMoves(ctx, {
      companyId,
      start: startDay,
      end: endDay,
      statuses: ["Completed"],
    });

    const sources = await ctx.db
      .query("referrals")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const sourceNames: IdAndName[] = sources.map((source) => ({
      id: source._id as string,
      name: source.name,
    }));

    const series = buildStackedHistoricalRevenueSeriesByName(
      endDay,
      moves,
      sourceNames,
      startDay,
      timeZone,
      (m) => m.referralId
    );

    return series;
  },
});
