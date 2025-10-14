import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { QuoteStatusConvex } from "./schema";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles } from "@/types/enums";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
} from "./backendUtils/validate";
import { Doc, Id } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { ConvexError } from "convex/values";

export const createOrUpdateQuote = mutation({
  args: {
    moveId: v.id("move"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      customerSignedAt: v.optional(v.number()),
      repSignature: v.optional(v.string()),
      repSignedAt: v.optional(v.number()),
      status: v.optional(QuoteStatusConvex),
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
    ]);

    const move = await validateDocument(
      ctx.db,
      "move",
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

    const existing: Doc<"quotes"> | null = await ctx.db
      .query("quotes")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    let quoteId: Id<"quotes">;

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      quoteId = existing._id;
    } else {
      if (!updates.status) {
        throw new ConvexError({
          code: "BAD_REQUEST",
          message: ErrorMessages.MISSING_REQUIRED_STATUS,
        });
      }

      await ctx.db.insert("quotes", {
        moveId,
        customerSignature: updates.customerSignature,
        customerSignedAt: updates.customerSignedAt,
        repSignature: updates.repSignature,
        repSignedAt: updates.repSignedAt,
        status: updates.status,
      });
    }

    return true;
  },
});
