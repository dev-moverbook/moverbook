import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
  validateMoveCustomer,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { Doc, Id } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";

export const createOrUpdateContract = mutation({
  args: {
    moveId: v.id("moves"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      customerSignedAt: v.optional(v.number()),
      repSignature: v.optional(v.string()),
      repSignedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId } = args;
    const updates = { ...args.updates };

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const now = Date.now();

    if (updates.customerSignature && !updates.customerSignedAt) {
      updates.customerSignedAt = now;
    }

    if (updates.repSignature && !updates.repSignedAt) {
      updates.repSignedAt = now;
    }

    const existing: Doc<"contracts"> | null = await ctx.db
      .query("contracts")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    let contractId: Id<"contracts">;

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      contractId = existing._id;
    } else {
      contractId = await ctx.db.insert("contracts", {
        moveId,
        ...updates,
      });
    }

    if (updates.customerSignature) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        type: "CUSTOMER_SIGNED_CONTRACT_DOC",
        companyId: company._id,
        body: `**${moveCustomer.name}** signed contract.`,
        moveId,
        moveCustomerId: move.moveCustomerId,
        context: {
          customerName: moveCustomer.name,
        },
      });
    }

    return true;
  },
});
