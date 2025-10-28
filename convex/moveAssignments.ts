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
import { formatTime } from "@/frontendUtils/helper";
import { formatTimeLower } from "./backendUtils/luxonHelper";

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
      "move",
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
      await ctx.db.insert("newsFeed", {
        body: `**${newMover.name}** was assigned to move **${moveCustomer.name}** (**${moveDate}**).`,
        companyId: company._id,
        type: "ASSIGN_MOVER",
        userId: updates.moverId,
        context: {
          moverName: previousMover.name,
          customerName: moveCustomer.name,
          moveDate: moveDate,
        },
      });

      await ctx.db.insert("newsFeed", {
        body: `**${previousMover.name}** was removed from move **${moveCustomer.name}** (**${moveDate}**).`,
        companyId: company._id,
        type: "REMOVE_MOVER",
        userId: previousMover._id,
        context: {
          moverName: previousMover.name,
          customerName: moveCustomer.name,
          moveDate: moveDate,
        },
      });
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
      "move",
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

    if (hasStartTime && updates.startTime) {
      await ctx.db.insert("newsFeed", {
        body: `**${mover.name}** clocked in at ${formatTimeLower(updates.startTime, company.timeZone)} for **${moveCustomer.name}**.`,
        companyId: company._id,
        type: "CLOCK_IN",
        userId: mover._id,
        context: {
          customerName: moveCustomer.name,
          workStartTime: updates.startTime,
          moverName: mover.name,
        },
      });
    }

    if (hasEndTime && updates.endTime) {
      await ctx.db.insert("newsFeed", {
        body: `**${mover.name}** clocked out at ${formatTimeLower(updates.endTime, company.timeZone)} for **${moveCustomer.name}**.`,
        companyId: company._id,
        type: "CLOCK_OUT",
        userId: mover._id,
        context: {
          customerName: moveCustomer.name,
          workEndTime: updates.endTime,
          moverName: mover.name,
        },
      });
    }
    if (updates.breakAmount !== undefined) {
      await ctx.db.insert("newsFeed", {
        body: `**${mover.name}** updated ${updates.breakAmount} hour work break for **${moveCustomer.name}**.`,
        companyId: company._id,
        type: "WORK_BREAK_UPDATE",
        userId: mover._id,
        context: {
          customerName: moveCustomer.name,
          breakAmount: updates.breakAmount,
          moverName: mover.name,
        },
      });
    }
    return true;
  },
});

export const insertMoveAssignment = mutation({
  args: {
    moveId: v.id("move"),
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
      "move",
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

    await ctx.db.insert("newsFeed", {
      body: `**${mover.name}** was assigned to move **${moveCustomer.name}** (**${moveDate}**).`,
      companyId: company._id,
      type: "ASSIGN_MOVER",
      userId: moverId,
      moveId,
      moveCustomerId: move.moveCustomerId,
      context: {
        moverName: mover.name,
        customerName: moveCustomer.name,
        moveDate: moveDate,
      },
    });

    return true;
  },
});

export const getMoveAssignmentsPage = query({
  args: {
    moveId: v.id("move"),
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
      "move",
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

    const preMoveDoc: Doc<"preMoveDocs"> | null = await ctx.db
      .query("preMoveDocs")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    const additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null =
      await ctx.db
        .query("additionalLiabilityCoverage")
        .withIndex("by_move", (q) => q.eq("moveId", moveId))
        .unique();

    return {
      assignments,
      allMovers,
      preMoveDoc,
      additionalLiabilityCoverage,
    };
  },
});

export const getMovePageForMover = query({
  args: {
    moveId: v.id("move"),
  },
  handler: async (
    ctx,
    { moveId }
  ): Promise<GetMovePageForMoverMemberData | GetMovePageForMoverLeadData> => {
    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.MOVER]);

    const move = await validateDocument(
      ctx.db,
      "move",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const user = validateUser(
      await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkUserId"), identity.id))
        .first()
    );

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

    const preMoveDoc: Doc<"preMoveDocs"> | null = await ctx.db
      .query("preMoveDocs")
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

    const additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null =
      await ctx.db
        .query("additionalLiabilityCoverage")
        .withIndex("by_move", (q) => q.eq("moveId", moveId))
        .unique();

    const fees: Doc<"fees">[] = await ctx.db
      .query("fees")
      .withIndex("byCompanyId", (q) => q.eq("companyId", company._id))
      .collect();

    return {
      isLead: true,
      assignment,
      preMoveDoc,
      discounts,
      additionalFees,
      invoice,
      additionalLiabilityCoverage,
      fees,
    };
  },
});

export const getMoveAssignments = query({
  args: {
    moveId: v.id("move"),
  },
  handler: async (ctx, { moveId }): Promise<EnrichedMoveAssignment[]> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const move = await validateDocument(
      ctx.db,
      "move",
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
      "move",
      assignment.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

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

      const mover = await ctx.db.get(assignment.moverId);
      const { hours, pay } = computeApprovedPayout({
        startTime: assignment.startTime,
        endTime: assignment.endTime,
        breakAmount: assignment.breakAmount ?? 0,
        hourlyRate: mover?.hourlyRate ?? 0,
      });

      await ctx.db.patch(assignmentId, {
        ...updates,
        approvedHours: hours,
        approvedPay: pay,
      });
    } else {
      await ctx.db.patch(assignmentId, updates);
    }
    return true;
  },
});
