import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { throwConvexError } from "./backendUtils/errors";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles } from "@/types/enums";

export const getByMoveCustomerAndCompanyInternal = internalQuery({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    companyId: v.id("companies"),
  },
  handler: async (ctx, { moveCustomerId, companyId }) => {
    return ctx.db
      .query("moveCustomerStripeProfiles")
      .withIndex("by_moveCustomer_company", (q) =>
        q.eq("moveCustomerId", moveCustomerId).eq("companyId", companyId)
      )
      .first();
  },
});

export const getByIdInternal = internalQuery({
  args: {
    id: v.id("moveCustomerStripeProfiles"),
  },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const getByMoveCustomerAndCompany = query({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    companyId: v.id("companies"),
  },
  handler: async (ctx, { moveCustomerId, companyId }) => {
    await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    return ctx.db
      .query("moveCustomerStripeProfiles")
      .withIndex("by_moveCustomer_company", (q) =>
        q.eq("moveCustomerId", moveCustomerId).eq("companyId", companyId)
      )
      .unique();
  },
});

export const createMoveCustomerStripeProfile = internalMutation({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    companyId: v.id("companies"),
    stripeCustomerId: v.string(),
    stripeConnectedAccountId: v.string(),
    defaultPaymentMethodId: v.optional(v.string()),
    cardBrand: v.optional(v.string()),
    cardLast4: v.optional(v.string()),
    cardExpMonth: v.optional(v.number()),
    cardExpYear: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return ctx.db.insert("moveCustomerStripeProfiles", {
      moveCustomerId: args.moveCustomerId,
      companyId: args.companyId,
      stripeCustomerId: args.stripeCustomerId,
      stripeConnectedAccountId: args.stripeConnectedAccountId,
      defaultPaymentMethodId: args.defaultPaymentMethodId,
      cardBrand: args.cardBrand,
      cardLast4: args.cardLast4,
      cardExpMonth: args.cardExpMonth,
      cardExpYear: args.cardExpYear,
      updatedAt: now,
    });
  },
});

export const updatePaymentMethodFromSetupIntent = internalMutation({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    companyId: v.id("companies"),
    paymentMethodId: v.string(),
    cardBrand: v.string(),
    cardLast4: v.string(),
    cardExpMonth: v.number(),
    cardExpYear: v.number(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("moveCustomerStripeProfiles")
      .withIndex("by_moveCustomer_company", (q) =>
        q
          .eq("moveCustomerId", args.moveCustomerId)
          .eq("companyId", args.companyId)
      )
      .unique();

    if (!profile) {
      throwConvexError("Stripe profile not found", {
        code: "NOT_FOUND",
        showToUser: true,
      });
    }

    await ctx.db.patch(profile._id, {
      defaultPaymentMethodId: args.paymentMethodId,
      cardBrand: args.cardBrand,
      cardLast4: args.cardLast4,
      cardExpMonth: args.cardExpMonth,
      cardExpYear: args.cardExpYear,
      updatedAt: Date.now(),
    });
  },
});
