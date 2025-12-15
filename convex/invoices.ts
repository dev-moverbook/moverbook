import {
  action,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isIdentityInMove,
  isUserInOrg,
  validateCompany,
  validateDocExists,
  validateDocument,
  validateUser,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { Doc, Id } from "./_generated/dataModel";
import { InvoiceStatusConvex, PaymentMethodConvex } from "./schema";
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

    // maybe news feed entry for invoice created

    if (existing) {
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("invoices", {
        moveId,
        status: updates.status || "pending",
        ...updates,
      });
    }
    return true;
  },
});

// To Be Deleted
// export const sendInvoice = action({
//   args: {
//     moveId: v.id("moves"),
//     channel: v.union(v.literal("email"), v.literal("sms")),
//   },
//   handler: async (ctx, args): Promise<boolean> => {
//     const identity = await requireAuthenticatedUser(ctx, [
//       ClerkRoles.ADMIN,
//       ClerkRoles.APP_MODERATOR,
//       ClerkRoles.MANAGER,
//       ClerkRoles.SALES_REP,
//       ClerkRoles.MOVER,
//     ]);

//     const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
//       moveId: args.moveId,
//     });
//     const validatedMove = validateDocExists(
//       "moves",
//       move,
//       ErrorMessages.MOVE_NOT_FOUND
//     );

//     const company = await ctx.runQuery(
//       internal.companies.getCompanyByIdInternal,
//       {
//         companyId: validatedMove.companyId,
//       }
//     );
//     const validatedCompany = validateDocExists(
//       "companies",
//       company,
//       ErrorMessages.COMPANY_NOT_FOUND
//     );

//     isUserInOrg(identity, validatedCompany.clerkOrganizationId);

//     const user = validateUser(
//       await ctx.runQuery(internal.users.getUserByIdInternal, {
//         userId: identity.convexId as Id<"users">,
//       })
//     );

//     const validatedMoveCustomer = await ctx.runQuery(
//       internal.moveCustomers.getMoveCustomerByIdInternal,
//       {
//         moveCustomerId: validatedMove.moveCustomerId,
//       }
//     );

//     const invoice = await ctx.runQuery(
//       internal.invoices.getInvoiceByMoveIdInternal,
//       {
//         moveId: validatedMove._id,
//       }
//     );
//     const validatedInvoice = validateDocExists(
//       "invoices",
//       invoice,
//       ErrorMessages.INVOICE_NOT_FOUND
//     );

//     if (args.channel === "email") {
//       // TODO: Send waiver email
//     } else if (args.channel === "sms") {
//       // TODO: Send waiver SMS
//     }
//     const moveDate = validatedMove.moveDate
//       ? formatMonthDayLabelStrict(validatedMove.moveDate)
//       : "TBD";
//     await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
//       entry: {
//         type: "INVOICE_SENT",
//         companyId: validatedCompany._id,
//         body: `**${user.name}** sent invoice to **${validatedMoveCustomer.name}** **${moveDate}** via ${args.channel}`,
//         moveId: validatedMove._id,
//         context: {
//           customerName: validatedMoveCustomer.name,
//           deliveryType: args.channel,
//           moveDate,
//           invoiceId: validatedInvoice._id,
//           moverName: user.name,
//           salesRepName: user.name,
//         },
//         userId: user._id,
//       },
//     });

//     return true;
//   },
// });

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

export const getInvoiceByIdInternal = internalQuery({
  args: {
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args): Promise<Doc<"invoices"> | null> => {
    return await ctx.db.get(args.invoiceId);
  },
});

export const updateInvoice = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      customerSignedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<void> => {
    const { invoiceId, updates } = args;
    await ctx.db.patch(invoiceId, updates);
  },
});

export const customerSignInvoice = action({
  args: {
    invoiceId: v.id("invoices"),
    signature: v.string(),
    paymentMethod: PaymentMethodConvex,
    amount: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { invoiceId, signature, amount } = args;

    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);
    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: identity.convexId as Id<"users">,
      })
    );

    const invoice = await ctx.runQuery(
      internal.invoices.getInvoiceByIdInternal,
      {
        invoiceId,
      }
    );
    const validatedInvoice = validateDocExists(
      "invoices",
      invoice,
      ErrorMessages.INVOICE_NOT_FOUND
    );

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId: validatedInvoice.moveId,
    });
    const validatedMove = validateDocExists(
      "moves",
      move,
      ErrorMessages.MOVE_NOT_FOUND
    );
    isIdentityInMove(identity, validatedMove);

    await ctx.runMutation(internal.invoices.updateInvoice, {
      invoiceId: validatedInvoice._id,
      updates: {
        customerSignature: signature,
        customerSignedAt: Date.now(),
      },
    });

    const moveDate = validatedMove.moveDate
      ? formatMonthDayLabelStrict(validatedMove.moveDate)
      : "TBD";

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "INVOICE_PAYMENT",
        companyId: validatedMove.companyId,
        body: `**${user.name}** paid invoice for move on **${moveDate}**`,
        moveId: validatedMove._id,
        moveCustomerId: validatedMove.moveCustomerId,
        amount,
      },
    });

    await ctx.runMutation(internal.moves.updateMoveInternal, {
      moveId: validatedMove._id,
      updates: {
        moveStatus: "Completed",
        completedAt: Date.now(),
        invoiceAmountPaid: amount,
      },
    });

    return true;
  },
});
