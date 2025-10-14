import { ConvexError, v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles } from "@/types/enums";
import {
  EnrichedMoveForMover,
  GetCustomerAndMovesData,
} from "@/types/convex-responses";
import { Doc, Id } from "./_generated/dataModel";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
  validateMoveCustomer,
} from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";
import {
  buildMoverWageForMoveDisplay,
  scopeMovesToMover,
  resolveMoverContext,
} from "./backendUtils/queryHelpers";
import { HourStatus } from "@/types/types";

export const createMoveCustomer = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    altPhoneNumber: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"moveCustomers">> => {
    const { name, email, phoneNumber, altPhoneNumber, companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, args.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const byEmail: Doc<"moveCustomers"> | null = await ctx.db
      .query("moveCustomers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (byEmail) {
      return byEmail._id;
    }

    const byPhone: Doc<"moveCustomers"> | null = await ctx.db
      .query("moveCustomers")
      .withIndex("by_phone", (q) => q.eq("phoneNumber", phoneNumber))
      .first();

    if (byPhone) {
      return byPhone._id;
    }

    const moveCustomerId = await ctx.db.insert("moveCustomers", {
      name,
      email,
      phoneNumber,
      altPhoneNumber,
      companyId,
    });

    return moveCustomerId;
  },
});

export const searchMoveCustomersAndJobId = query({
  args: {
    companyId: v.id("companies"),
    searchTerm: v.string(),
  },
  handler: async (
    ctx,
    { companyId, searchTerm }
  ): Promise<{
    moveCustomers: Doc<"moveCustomers">[];
    moves: EnrichedMoveForMover[];
  }> => {
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
      moverId: signedInMoverId,
      hourlyRate: signedInMoverHourlyRate,
    } = await resolveMoverContext(ctx, identity);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const allCustomers = await ctx.db
      .query("moveCustomers")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .collect();

    const allCompanyMoves = await ctx.db
      .query("move")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .collect();

    let assignmentMapByMoveId: Map<string, Doc<"moveAssignments">> | undefined;

    let movesScopedToMover: Doc<"move">[] = allCompanyMoves;

    if (isMover && signedInMoverId) {
      const { moves: scopedMoves, assignmentMap } = await scopeMovesToMover(
        ctx,
        allCompanyMoves,
        signedInMoverId
      );
      movesScopedToMover = scopedMoves;
      assignmentMapByMoveId = assignmentMap;
    }

    const allowedMoveIds: Set<Id<"move">> | null =
      isMover && signedInMoverId
        ? new Set(movesScopedToMover.map((moveRecord) => moveRecord._id))
        : null;

    const matchingMovesBase = allCompanyMoves
      .filter(
        (moveRecord) =>
          (allowedMoveIds ? allowedMoveIds.has(moveRecord._id) : true) &&
          (moveRecord.jobId?.toLowerCase().includes(normalizedSearch) ?? false)
      )
      .slice(0, 10);

    const enrichedMoves: EnrichedMoveForMover[] =
      isMover && signedInMoverId && assignmentMapByMoveId
        ? matchingMovesBase.map((moveRecord) => {
            const assignment = assignmentMapByMoveId!.get(moveRecord._id);
            return {
              ...moveRecord,
              moverWageForMove: assignment
                ? buildMoverWageForMoveDisplay(
                    moveRecord,
                    assignment,
                    signedInMoverHourlyRate
                  )
                : undefined,
              hourStatus: (assignment?.hourStatus as HourStatus) ?? undefined,
            };
          })
        : (matchingMovesBase as EnrichedMoveForMover[]);

    const allowedCustomerIdsForMover = allowedMoveIds
      ? new Set(
          allCompanyMoves
            .filter((moveRecord) => allowedMoveIds!.has(moveRecord._id))
            .map((moveRecord) => moveRecord.moveCustomerId)
        )
      : null;

    const matchingCustomers = allCustomers
      .filter(
        (customerRecord) =>
          (allowedCustomerIdsForMover
            ? allowedCustomerIdsForMover.has(customerRecord._id)
            : true) &&
          ((customerRecord.name?.toLowerCase().includes(normalizedSearch) ??
            false) ||
            (customerRecord.email?.toLowerCase().includes(normalizedSearch) ??
              false) ||
            (customerRecord.phoneNumber
              ?.toLowerCase()
              .includes(normalizedSearch) ??
              false))
      )
      .slice(0, 10);

    return {
      moveCustomers: matchingCustomers,
      moves: enrichedMoves,
    };
  },
});

export const updateMoveCustomer = mutation({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      altPhoneNumber: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveCustomerId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);
    const existing = await validateDocument(
      ctx.db,
      "moveCustomers",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    const company = await validateCompany(ctx.db, existing.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    if (updates.email && updates.email !== existing.email) {
      const emailTaken = await ctx.db
        .query("moveCustomers")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .filter((q) => q.neq(q.field("_id"), moveCustomerId))
        .first();

      if (emailTaken) {
        throw new ConvexError({
          code: "CONFLICT",
          message: ErrorMessages.CUSTOMER_EMAIL_TAKEN,
        });
      }
    }

    if (updates.phoneNumber && updates.phoneNumber !== existing.phoneNumber) {
      const phoneTaken = await ctx.db
        .query("moveCustomers")
        .withIndex("by_phone", (q) => q.eq("phoneNumber", updates.phoneNumber!))
        .filter((q) => q.neq(q.field("_id"), moveCustomerId))
        .first();

      if (phoneTaken) {
        throw new ConvexError({
          code: "CONFLICT",
          message: ErrorMessages.CUSTOMER_PHONE_TAKEN,
        });
      }
    }

    await ctx.db.patch(moveCustomerId, {
      ...updates,
    });

    return true;
  },
});

export const getCustomerAndMoves = query({
  args: {
    moveCustomerId: v.id("moveCustomers"),
  },
  handler: async (
    ctx,
    { moveCustomerId }
  ): Promise<GetCustomerAndMovesData> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const moveCustomer = await validateDocument(
      ctx.db,
      "moveCustomers",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, moveCustomer.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const {
      isMover,
      moverId: selfMoverId,
      hourlyRate: selfHourlyRate,
    } = await resolveMoverContext(ctx, identity);

    const baseMoves: Doc<"move">[] = await ctx.db
      .query("move")
      .withIndex("by_moveCustomerId", (index) =>
        index.eq("moveCustomerId", moveCustomerId)
      )
      .collect();

    if (!isMover || !selfMoverId) {
      return {
        moveCustomer,
        moves: baseMoves,
      };
    }

    const { moves: scopedMoves, assignmentMap } = await scopeMovesToMover(
      ctx,
      baseMoves,
      selfMoverId
    );

    const moves: EnrichedMoveForMover[] = scopedMoves.map((moveRecord) => {
      const assignment = assignmentMap.get(moveRecord._id);
      return {
        ...moveRecord,
        moverWageForMove: assignment
          ? buildMoverWageForMoveDisplay(moveRecord, assignment, selfHourlyRate)
          : undefined,
        hourStatus: (assignment?.hourStatus as HourStatus) ?? undefined,
      };
    });

    return {
      moveCustomer,
      moves,
    };
  },
});
export const getMoveCustomer = query({
  args: {
    moveCustomerId: v.id("moveCustomers"),
  },
  handler: async (ctx, { moveCustomerId }): Promise<Doc<"moveCustomers">> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const moveCustomer = await validateDocument(
      ctx.db,
      "moveCustomers",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, moveCustomer.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    return moveCustomer;
  },
});

export const getMoveCustomerByIdInternal = internalQuery({
  args: { moveCustomerId: v.id("moveCustomers") },
  handler: async (ctx, args): Promise<Doc<"moveCustomers"> | null> => {
    const { moveCustomerId } = args;
    return await ctx.db.get(moveCustomerId);
  },
});
