import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateMove,
  validateMoveAssignment,
} from "./backendUtils/validate";
import { handleInternalError } from "./backendUtils/helper";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { HourStatusConvex } from "./schema"; // adjust if needed
import {
  CreateMoveAssignmentResponse,
  GetMoveAssignmentsPageResponse,
  UpdateMoveAssignmentResponse,
} from "@/types/convex-responses";
import { Doc } from "./_generated/dataModel";

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
  handler: async (
    ctx,
    { assignmentId, updates }
  ): Promise<UpdateMoveAssignmentResponse> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.MOVER,
      ]);

      const assignment = validateMoveAssignment(await ctx.db.get(assignmentId));

      const move = validateMove(await ctx.db.get(assignment.moveId));
      const company = validateCompany(await ctx.db.get(move.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(assignmentId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { assignmentId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const insertMoveAssignment = mutation({
  args: {
    moveId: v.id("move"),
    moverId: v.id("users"),
    isLead: v.boolean(),
  },
  handler: async (
    ctx,
    { moveId, moverId, isLead }
  ): Promise<CreateMoveAssignmentResponse> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const move = validateMove(await ctx.db.get(moveId));
      const company = validateCompany(await ctx.db.get(move.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const assignmentId = await ctx.db.insert("moveAssignments", {
        moveId,
        moverId,
        isLead,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { assignmentId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getMoveAssignmentsPage = query({
  args: {
    moveId: v.id("move"),
  },
  handler: async (ctx, { moveId }): Promise<GetMoveAssignmentsPageResponse> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const move = validateMove(await ctx.db.get(moveId));
      const company = validateCompany(await ctx.db.get(move.companyId));
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
        status: ResponseStatus.SUCCESS,
        data: {
          assignments,
          allMovers,
          preMoveDoc,
          additionalLiabilityCoverage,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
