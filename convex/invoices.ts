import { action, internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateDocExists,
  validateDocument,
  validateUser,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { Doc, Id } from "./_generated/dataModel";
import { InvoiceStatusConvex } from "./schema";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";

export const createOrUpdateInvoice = mutation({
  args: {
    moveId: v.id("moves"),
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

export const sendInvoice = action({
  args: {
    moveId: v.id("moves"),
    channel: v.union(v.literal("email"), v.literal("sms")),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId: args.moveId,
    });
    const validatedMove = validateDocExists(
      "moves",
      move,
      ErrorMessages.MOVE_NOT_FOUND
    );

    const company = await ctx.runQuery(
      internal.companies.getCompanyByIdInternal,
      {
        companyId: validatedMove.companyId,
      }
    );
    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );

    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: identity.convexId as Id<"users">,
      })
    );

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: validatedMove.moveCustomerId,
      }
    );

    const validatedMoveCustomer = validateDocExists(
      "moveCustomers",
      moveCustomer,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    const invoice = await ctx.runQuery(
      internal.invoices.getInvoiceByMoveIdInternal,
      {
        moveId: validatedMove._id,
      }
    );
    const validatedInvoice = validateDocExists(
      "invoices",
      invoice,
      ErrorMessages.INVOICE_NOT_FOUND
    );

    if (args.channel === "email") {
      // TODO: Send waiver email
    } else if (args.channel === "sms") {
      // TODO: Send waiver SMS
    }
    const moveDate = validatedMove.moveDate
      ? formatMonthDayLabelStrict(validatedMove.moveDate)
      : "TBD";
    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "INVOICE_SENT",
        companyId: validatedCompany._id,
        body: `**${user.name}** sent invoice to **${validatedMoveCustomer.name}** **${moveDate}** via ${args.channel}`,
        moveId: validatedMove._id,
        context: {
          customerName: validatedMoveCustomer.name,
          deliveryType: args.channel,
          moveDate,
          invoiceId: validatedInvoice._id,
          moverName: user.name,
          salesRepName: user.name,
        },
        userId: user._id,
      },
    });

    return true;
  },
});

export const getInvoiceByMoveIdInternal = internalQuery({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"invoices"> | null> => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_move", (q) => q.eq("moveId", args.moveId))
      .unique();
  },
});
