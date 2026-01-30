import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { PaymentStatusConvex, PaymentTypeConvex } from "./schema";
import { Doc } from "./_generated/dataModel";

export const createPaymentRecord = internalMutation({
  args: {
    amount: v.number(),
    companyId: v.id("companies"),
    moveId: v.id("moves"),
    stripeConnectedAccountId: v.string(),
    stripePaymentIntentId: v.string(),
    status: PaymentStatusConvex,
    type: PaymentTypeConvex,
    moveCustomerId: v.id("moveCustomers"),
    failureReason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("payments", {
      amount: args.amount,
      companyId: args.companyId,
      moveId: args.moveId,
      stripeConnectedAccountId: args.stripeConnectedAccountId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      status: args.status,
      type: args.type,
      moveCustomerId: args.moveCustomerId,
      failureReason: args.failureReason,
      updatedAt: Date.now(),
    });
  },
});

export const updatePaymentByPaymentIntentId = internalMutation({
  args: {
    id: v.id("payments"),
    updates: v.object({
      status: v.optional(PaymentStatusConvex),
      failureReason: v.optional(v.string()),
    }),
  },

  handler: async (ctx, args) => {
    const { id, updates } = args;

    await ctx.db.patch(id, updates);
  },
});

export const getPaymentByPaymentIntentId = internalQuery({
  args: {
    stripePaymentIntentId: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"payments"> | null> => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_paymentIntent", (q) =>
        q.eq("stripePaymentIntentId", args.stripePaymentIntentId)
      )
      .first();

    return payment;
  },
});
