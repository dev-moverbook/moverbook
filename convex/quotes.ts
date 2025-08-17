import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { QuoteStatusConvex } from "./schema";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { handleInternalError } from "./backendUtils/helper";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import {
  isUserInOrg,
  validateCompany,
  validateMove,
} from "./backendUtils/validate";
import { Doc, Id } from "./_generated/dataModel";
import { CreateOrUpdateQuoteResponse } from "@/types/convex-responses";
import { ErrorMessages } from "@/types/errors";

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
  handler: async (ctx, args): Promise<CreateOrUpdateQuoteResponse> => {
    const { moveId } = args;
    const updates = { ...args.updates };

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
          throw new Error(ErrorMessages.MISSING_REQUIRED_STATUS);
        }

        quoteId = await ctx.db.insert("quotes", {
          moveId,
          customerSignature: updates.customerSignature,
          customerSignedAt: updates.customerSignedAt,
          repSignature: updates.repSignature,
          repSignedAt: updates.repSignedAt,
          status: updates.status,
        });
      }

      return {
        status: ResponseStatus.SUCCESS,
        data: { quoteId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
