import {
  action,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { QuoteStatusConvex } from "./schema";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles } from "@/types/enums";
import {
  isCorrectMoveCustomer,
  isUserInOrg,
  validateCompany,
  validateDocExists,
  validateDocument,
  validateMoveCustomer,
} from "./backendUtils/validate";
import { Doc, Id } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { formatCurrency } from "@/frontendUtils/helper";

export const createOrUpdateQuote = mutation({
  args: {
    moveId: v.id("moves"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      repSignature: v.optional(v.string()),
      status: v.optional(QuoteStatusConvex),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId } = args;
    const updates: Partial<Doc<"quotes">> = { ...args.updates };

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

    const now = Date.now();

    if (updates.customerSignature) {
      updates.customerSignedAt = now;
    }

    if (updates.repSignature && !updates.repSignedAt) {
      updates.repSignedAt = now;
    }

    const existing: Doc<"quotes"> | null = await ctx.db
      .query("quotes")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    if (existing) {
      await ctx.db.patch(existing._id, updates);
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

    if (updates.customerSignature) {
      const moveDate = move.moveDate
        ? formatMonthDayLabelStrict(move.moveDate)
        : "TBD";

      const depositAmount = formatCurrency(move.deposit ?? 0);

      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "QUOTE_SIGNED",
          companyId: company._id,
          body: `**${moveCustomer.name}** signed proposal for  **${moveDate}** (deposit paid ${depositAmount}).`,
          moveId,
          moveCustomerId: move.moveCustomerId,
        },
      });
    }

    return true;
  },
});

export const getQuoteByMoveId = internalQuery({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"quotes"> | null> => {
    const { moveId } = args;
    return await ctx.db
      .query("quotes")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .first();
  },
});

export const updateQuote = internalMutation({
  args: {
    quoteId: v.id("quotes"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      customerSignedAt: v.optional(v.number()),
      repSignature: v.optional(v.string()),
      repSignedAt: v.optional(v.number()),
      status: v.optional(QuoteStatusConvex),
    }),
  },
  handler: async (ctx, args): Promise<void> => {
    const { quoteId, updates } = args;

    await ctx.db.patch(quoteId, updates);
  },
});

export const signQuote = action({
  args: {
    moveId: v.id("moves"),
    signature: v.string(),
    paymentMethodId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { moveId, signature } = args;

    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId,
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

    const companyContact = await ctx.runQuery(
      internal.companyContacts.getCompanyContactByCompanyIdInternal,
      {
        companyId: validatedCompany._id,
      }
    );
    const validatedCompanyContact = validateDocExists(
      "companyContacts",
      companyContact,
      ErrorMessages.USER_NOT_FOUND
    );

    const moveCustomer = validateMoveCustomer(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: validatedMove.moveCustomerId,
      })
    );

    isCorrectMoveCustomer(
      identity.convexId as Id<"users">,
      validatedMove.moveCustomerId
    );

    const quote = await ctx.runQuery(internal.quotes.getQuoteByMoveId, {
      moveId,
    });

    const validatedQuote = validateDocExists(
      "quotes",
      quote,
      ErrorMessages.QUOTE_NOT_FOUND
    );

    await ctx.runMutation(internal.quotes.updateQuote, {
      quoteId: validatedQuote._id,
      updates: {
        customerSignature: signature,
        customerSignedAt: Date.now(),
        status: "completed",
      },
    });

    const moveDate = validatedMove.moveDate
      ? formatMonthDayLabelStrict(validatedMove.moveDate)
      : "TBD";

    const depositAmount = formatCurrency(validatedMove.deposit ?? 0);

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "QUOTE_SIGNED",
        companyId: validatedMove.companyId,
        body: `**${moveCustomer.name}** signed proposal for  **${moveDate}** (deposit paid ${depositAmount}).`,
        moveId,
        moveCustomerId: moveCustomer._id,
      },
    });

    await ctx.runAction(internal.actions.pdf.generatePdf, {
      documentType: "quote",
      toEmail: moveCustomer.email,
      ccEmails: [validatedCompanyContact.email],
      replyToEmail: validatedCompanyContact.email,
      replyToName: validatedCompany.name,
      subject: `Quote for ${moveCustomer.name} on ${moveDate}`,
      bodyText: `Attached is the quote for ${moveCustomer.name} on ${moveDate}.`,
      bodyHtml: `<p>Attached is the quote for ${moveCustomer.name} on ${moveDate}.</p>`,
    });

    // if (validatedMove.deposit && validatedMove.deposit > 0 && paymentMethodId) {
    //   await ctx.runAction(stripe.createDepositPaymentIntent, {
    //     moveId: args.moveId,
    //     amount: move.deposit,
    //     paymentMethodId: args.paymentMethodId,
    //   });

    //   // Return immediately — payment is "processing"
    //   return { success: true, status: "awaiting_payment" };
    // }

    // await ctx.runMutation(internal.moves.markAsBooked, { moveId: args.moveId });
    return { success: true, status: "booked" };
  },
});
