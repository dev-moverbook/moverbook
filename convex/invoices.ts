import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { Doc, Id } from "./_generated/dataModel";
import { InvoiceStatusConvex } from "./schema";
import { ErrorMessages } from "@/types/errors";

export const createOrUpdateInvoice = mutation({
  args: {
    moveId: v.id("move"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      customerSignedAt: v.optional(v.number()),
      repSignature: v.optional(v.string()),
      repSignedAt: v.optional(v.number()),
      status: v.optional(InvoiceStatusConvex),
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

    const existing: Doc<"invoices"> | null = await ctx.db
      .query("invoices")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    let invoiceId: Id<"invoices">;

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      invoiceId = existing._id;
    } else {
      invoiceId = await ctx.db.insert("invoices", {
        moveId,
        status: updates.status || "pending",
        ...updates,
      });
    }

    return true;
  },
});
