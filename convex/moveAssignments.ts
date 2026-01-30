import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
  validateMoveAssignment,
  validateMoveCustomer,
  validateUser,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { HourStatusConvex } from "./schema";
import {
  EnrichedMoveAssignment,
  GetMoveAssignmentsPageData,
  GetMovePageForMoverLeadData,
  GetMovePageForMoverMemberData,
} from "@/types/convex-responses";
import { Doc, Id } from "./_generated/dataModel";
import { computeApprovedPayout } from "./backendUtils/calculations";
import { buildMoverWageForMoveDisplay } from "./backendUtils/queryHelpers";
import { ErrorMessages } from "@/types/errors";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { formatTimeLower } from "./backendUtils/luxonHelper";
import { internal } from "./_generated/api";

export const updateMoveAssignment = mutation({
  args: {
    assignmentId: v.id("moveAssignments"),
    updates: v.object({
      isLead: v.optional(v.boolean()),
      startTime: v.optional(v.number()),
      endTime: v.optional(v.number()),
      breakAmount: v.optional(v.number()),
      hourStatus: v.optional(HourStatusConvex),
      managerNotes: v.optional(v.string()),
      moverId: v.optional(v.id("users")),
    }),
  },
  handler: async (ctx, { assignmentId, updates }): Promise<boolean> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const assignment = await validateDocument(
      ctx.db,
      "moveAssignments",
      assignmentId,
      ErrorMessages.MOVE_ASSIGNMENT_NOT_FOUND
    );
    const move = await validateDocument(
      ctx.db,
      "moves",
      assignment.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    if (updates.endTime !== undefined) {
      updates.hourStatus = "pending";
    }

    const previousMover = validateUser(await ctx.db.get(assignment.moverId));

    await ctx.db.patch(assignmentId, updates);

    if (updates.moverId) {
      const newMover = validateUser(await ctx.db.get(updates.moverId!));
      const moveCustomer = validateMoveCustomer(
        await ctx.db.get(move.moveCustomerId)
      );
      const moveDate = move.moveDate
        ? formatMonthDayLabelStrict(move.moveDate)
        : "TBD";
      await Promise.all([
        ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "ASSIGN_MOVER",
            companyId: company._id,
            body: `**${newMover.name}** was assigned to move **${moveCustomer.name}** **${moveDate}**`,
            userId: updates.moverId,
            amount: 0,
            moveId: move._id,
          },
        }),

        ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "REMOVE_MOVER",
            companyId: company._id,
            body: `**${previousMover.name}** was removed from move **${moveCustomer.name}** **${moveDate}**`,
            userId: previousMover._id,
            moveId: move._id,
          },
        }),
      ]);
    }

    return true;
  },
});

export const updateMoveAssignmentHours = mutation({
  args: {
    assignmentId: v.id("moveAssignments"),
    updates: v.object({
      startTime: v.optional(v.number()),
      endTime: v.optional(v.number()),
      breakAmount: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { assignmentId, updates }): Promise<boolean> => {
    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.MOVER]);

    const assignment = await validateDocument(
      ctx.db,
      "moveAssignments",
      assignmentId,
      ErrorMessages.MOVE_ASSIGNMENT_NOT_FOUND
    );

    const move = await validateDocument(
      ctx.db,
      "moves",
      assignment.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    type AssignmentPatch = Partial<
      Pick<
        Doc<"moveAssignments">,
        "startTime" | "endTime" | "breakAmount" | "hourStatus"
      >
    >;

    const hasStartTime =
      typeof updates.startTime === "number" && updates.startTime;
    const hasEndTime = typeof updates.endTime === "number";

    const nextStart =
      typeof updates.startTime === "number"
        ? updates.startTime
        : assignment.startTime;
    const nextEnd =
      typeof updates.endTime === "number"
        ? updates.endTime
        : assignment.endTime;

    const hasAnyTime =
      typeof nextStart === "number" && typeof nextEnd === "number";

    const patch: AssignmentPatch = { ...updates };
    if (hasAnyTime) {
      patch.hourStatus = "pending";
    }

    await ctx.db.patch(assignmentId, patch);
    const mover = validateUser(await ctx.db.get(assignment.moverId));
    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    const moveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";

    if (hasStartTime && updates.startTime) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "CLOCK_IN",
          companyId: company._id,
          body: `**${mover.name}** clocked in at ${formatTimeLower(updates.startTime, company.timeZone)} for **${moveCustomer.name}**`,
          userId: mover._id,
          moveId: move._id,
        },
      });
    }

    if (hasEndTime && updates.endTime) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "CLOCK_OUT",
          companyId: company._id,
          body: `**${mover.name}** clocked out at ${formatTimeLower(updates.endTime, company.timeZone)} for **${moveCustomer.name}**`,
          userId: mover._id,
          moveId: move._id,
        },
      });
    }
    if (updates.breakAmount !== undefined) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "WORK_BREAK_UPDATE",
          companyId: company._id,
          body: `**${mover.name}** updated ${updates.breakAmount} hours work break for **${moveCustomer.name}** **${moveDate}**`,
          userId: mover._id,
          moveId: move._id,
        },
      });
    }
    return true;
  },
});

export const insertMoveAssignment = mutation({
  args: {
    moveId: v.id("moves"),
    moverId: v.id("users"),
    isLead: v.boolean(),
  },
  handler: async (ctx, { moveId, moverId, isLead }): Promise<boolean> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const mover = validateUser(await ctx.db.get(moverId));
    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    await ctx.db.insert("moveAssignments", {
      moveId,
      moverId,
      isLead,
      hourStatus: "incomplete",
      breakAmount: 0,
    });

    const moveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";

    let amount: number | null = null;

    const hourlyRate = mover.hourlyRate;
    const endingMoveTime = move.endingMoveTime;
    const startingMoveTime = move.startingMoveTime;

    if (hourlyRate && endingMoveTime && startingMoveTime) {
      amount = (endingMoveTime - startingMoveTime) * hourlyRate;
    }

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "ASSIGN_MOVER",
        companyId: company._id,
        body: `**${mover.name}** was assigned to move **${moveCustomer.name}** **${moveDate}**`,
        userId: moverId,
        moveId,
        amount,
      },
    });

    return true;
  },
});

export const getMoveAssignmentsPage = query({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, { moveId }): Promise<GetMoveAssignmentsPageData> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const assignments: Doc<"moveAssignments">[] = await ctx.db
      .query("moveAssignments")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .collect();

    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("companyId"), company._id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
    const allMovers = sortedUsers.filter(
      (user) => user.role === ClerkRoles.MOVER
    );

    const contract: Doc<"contracts"> | null = await ctx.db
      .query("contracts")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    const waiver: Doc<"waivers"> | null = await ctx.db
      .query("waivers")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    return {
      assignments,
      allMovers,
      contract,
      waiver,
    };
  },
});

export const getMovePageForMover = query({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (
    ctx,
    { moveId }
  ): Promise<GetMovePageForMoverMemberData | GetMovePageForMoverLeadData> => {
    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.MOVER]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const userId = identity.convexId as Id<"users">;
    const user = validateUser(await ctx.db.get(userId));

    const assignment: Doc<"moveAssignments"> = validateMoveAssignment(
      await ctx.db
        .query("moveAssignments")
        .withIndex("by_move", (q) => q.eq("moveId", moveId))
        .filter((q) => q.eq(q.field("moverId"), user._id))
        .first()
    );

    if (!assignment.isLead) {
      return {
        isLead: false,
        assignment,
      };
    }

    const contract: Doc<"contracts"> | null = await ctx.db
      .query("contracts")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    const discounts: Doc<"discounts">[] = await ctx.db
      .query("discounts")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .collect();

    const additionalFees: Doc<"additionalFees">[] = await ctx.db
      .query("additionalFees")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .collect();

    const invoice: Doc<"invoices"> | null = await ctx.db
      .query("invoices")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .first();

    const waiver: Doc<"waivers"> | null = await ctx.db
      .query("waivers")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    const fees: Doc<"fees">[] = await ctx.db
      .query("fees")
      .withIndex("byCompanyId", (q) => q.eq("companyId", company._id))
      .collect();

    return {
      isLead: true,
      assignment,
      contract,
      discounts,
      additionalFees,
      invoice,
      waiver,
      fees,
    };
  },
});

export const getMoveAssignments = query({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, { moveId }): Promise<EnrichedMoveAssignment[]> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const assignments = await ctx.db
      .query("moveAssignments")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .collect();

    const enrichedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const mover = validateUser(await ctx.db.get(assignment.moverId));
        const hourlyRate = mover?.hourlyRate ?? null;
        const wage = buildMoverWageForMoveDisplay(move, assignment, hourlyRate);
        return {
          ...assignment,
          moverName: mover.name,
          hourlyRate,
          pendingHours: wage.pendingHours,
          pendingPayout: wage.pendingPayout,
        };
      })
    );

    return enrichedAssignments;
  },
});

export const approveMoveAssignmentHours = mutation({
  args: {
    assignmentId: v.id("moveAssignments"),
    updates: v.object({
      hourStatus: HourStatusConvex,
      managerNotes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { assignmentId, updates }): Promise<boolean> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const assignment = await validateDocument(
      ctx.db,
      "moveAssignments",
      assignmentId,
      ErrorMessages.MOVE_ASSIGNMENT_NOT_FOUND
    );
    const move = await validateDocument(
      ctx.db,
      "moves",
      assignment.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const userId = identity.convexId as Id<"users">;
    const user = validateUser(await ctx.db.get(userId));

    const mover = validateUser(await ctx.db.get(assignment.moverId));
    if (updates.hourStatus === "approved") {
      if (
        typeof assignment.startTime !== "number" ||
        typeof assignment.endTime !== "number"
      ) {
        throw new ConvexError({
          code: "BAD_REQUEST",
          message: "Start and end times are required to approve hours.",
        });
      }

      const mover = validateUser(await ctx.db.get(assignment.moverId));
      const { hours, pay } = computeApprovedPayout({
        startTime: assignment.startTime,
        endTime: assignment.endTime,
        breakAmount: assignment.breakAmount ?? 0,
        hourlyRate: mover?.hourlyRate ?? 0,
      });

      await Promise.all([
        ctx.db.patch(assignmentId, {
          ...updates,
          approvedHours: hours,
          approvedPay: pay,
        }),
        ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "HOURS_STATUS_UPDATED",
            companyId: company._id,
            userId: mover._id,
            body: `**${user.name}** **${updates.hourStatus}** ${hours} hours for **${mover.name}**`,
            moveId: move._id,
            amount: pay,
          },
        }),
      ]);
    } else {
      const { hours } = computeApprovedPayout({
        startTime: assignment.startTime ?? 0,
        endTime: assignment.endTime ?? 0,
        breakAmount: assignment.breakAmount ?? 0,
        hourlyRate: mover?.hourlyRate ?? 0,
      });
      await Promise.all([
        ctx.db.patch(assignmentId, updates),
        ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
          entry: {
            type: "HOURS_STATUS_UPDATED",
            companyId: company._id,
            userId: mover._id,
            body: `**${user.name}** **${updates.hourStatus}** ${hours} hours for **${mover.name}**`,
            moveId: move._id,
          },
        }),
      ]);
    }

    return true;
  },
});
