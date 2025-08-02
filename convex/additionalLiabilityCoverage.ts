import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateMove,
} from "./backendUtils/validate";
import { handleInternalError } from "./backendUtils/helper";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { Doc, Id } from "./_generated/dataModel";
import { CreateOrUpdateAdditionalLiabilityCoverageResponse } from "@/types/convex-responses";

export const createOrUpdateAdditionalLiabilityCoverage = mutation({
  args: {
    moveId: v.id("move"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      customerSignedAt: v.optional(v.number()),
      repSignature: v.optional(v.string()),
      repSignedAt: v.optional(v.number()),
    }),
  },
  handler: async (
    ctx,
    args
  ): Promise<CreateOrUpdateAdditionalLiabilityCoverageResponse> => {
    const { moveId } = args;
    const updates = { ...args.updates };

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

      const now = Date.now();

      if (updates.customerSignature && !updates.customerSignedAt) {
        updates.customerSignedAt = now;
      }

      if (updates.repSignature && !updates.repSignedAt) {
        updates.repSignedAt = now;
      }

      const existing: Doc<"additionalLiabilityCoverage"> | null = await ctx.db
        .query("additionalLiabilityCoverage")
        .withIndex("by_move", (q) => q.eq("moveId", moveId))
        .unique();

      let additionalLiabilityCoverageId: Id<"additionalLiabilityCoverage">;

      if (existing) {
        await ctx.db.patch(existing._id, updates);
        additionalLiabilityCoverageId = existing._id;
      } else {
        additionalLiabilityCoverageId = await ctx.db.insert(
          "additionalLiabilityCoverage",
          {
            moveId,
            ...updates,
          }
        );
      }

      return {
        status: ResponseStatus.SUCCESS,
        data: { additionalLiabilityCoverageId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
