"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import {
  createOffSessionPaymentIntent,
  createStripeCustomer,
  createStripeSetupIntent,
} from "../functions/stripe";
import { internal } from "../_generated/api";
import { throwConvexError } from "../backendUtils/errors";
import { ErrorMessages } from "@/types/errors";
import Stripe from "stripe";
import { Doc } from "../_generated/dataModel";
import { computeFinalMoveCost } from "@/frontendUtils/payout";

export const createPaymentIntent = action({
  args: {
    moveId: v.id("moves"),
    type: v.union(v.literal("deposit"), v.literal("final_payment")),
    manualPaymentMethodId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { moveId, type, manualPaymentMethodId } = args;

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId,
    });
    if (!move)
      throwConvexError(ErrorMessages.MOVE_NOT_FOUND, {
        code: "NOT_FOUND",
        showToUser: true,
      });

    const profile = await ctx.runQuery(
      internal.moveCustomerStripeProfiles.getByMoveCustomerAndCompanyInternal,
      { moveCustomerId: move.moveCustomerId, companyId: move.companyId }
    );

    const effectivePaymentMethodId =
      manualPaymentMethodId || profile?.defaultPaymentMethodId;

    if (!effectivePaymentMethodId || !profile) {
      throwConvexError("No payment method available. Please add a card.", {
        code: "NOT_FOUND",
        showToUser: true,
      });
    }

    const additionalFees = await ctx.runQuery(
      internal.additionalFees.getAdditionalFeesByMoveIdInternal,
      {
        moveId,
      }
    );
    const discounts = await ctx.runQuery(
      internal.discounts.getDiscountsByMoveIdInternal,
      {
        moveId,
      }
    );

    const { total } = computeFinalMoveCost({
      moveFees: move.moveFees ?? [],
      jobType: move.jobType ?? "hourly",
      jobTypeRate: move.jobTypeRate ?? 0,
      liabilityCoverage: move.liabilityCoverage ?? null,
      segmentDistances: move.segmentDistances ?? [],
      travelFeeRate: move.travelFeeRate ?? null,
      travelFeeMethod: move.travelFeeMethod ?? null,
      paymentMethod: move.paymentMethod ?? { kind: "other", label: "Other" },
      creditCardFee: move.creditCardFee ?? 0,
      actualBreakTime: move.actualBreakTime ?? 0,
      actualStartTime: move.actualStartTime ?? 0,
      actualEndTime: move.actualEndTime ?? 0,
      actualArrivalTime: move.actualArrivalTime ?? 0,
      additionalFees: additionalFees,
      discounts: discounts,
      deposit: move.deposit ?? 0,
    });

    const amount = type === "deposit" ? (move?.deposit ?? 0) : total;

    try {
      const paymentIntent = await createOffSessionPaymentIntent({
        amount,
        customerId: profile.stripeCustomerId,
        paymentMethodId: effectivePaymentMethodId,
        connectedAccountId: profile.stripeConnectedAccountId,
        description: `${type} for move ${move.jobId}`,
        metadata: { moveId, companyId: move.companyId, type },
      });

      await ctx.runMutation(internal.payments.createPaymentRecord, {
        amount,
        companyId: move.companyId,
        moveId: move._id,
        stripeConnectedAccountId: profile.stripeConnectedAccountId,
        stripePaymentIntentId: paymentIntent.id,
        status: "processing",
        type,
        moveCustomerId: move.moveCustomerId,
      });

      return {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error: unknown) {
      await ctx.runMutation(internal.payments.createPaymentRecord, {
        amount,
        companyId: move.companyId,
        moveId: move._id,
        stripeConnectedAccountId: profile.stripeConnectedAccountId,
        stripePaymentIntentId: (error as Stripe.PaymentIntent).id ?? "unknown",
        status: "failed",
        type: args.type,
        moveCustomerId: move.moveCustomerId,
        failureReason: (error as Error).message || "stripe_payment_failed",
      });

      throw error;
    }
  },
});

export const createSetupIntent = action({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, { moveId }): Promise<{ clientSecret: string }> => {
 

    try {
      const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
        moveId,
      });

      if (!move) {
        throwConvexError(ErrorMessages.MOVE_NOT_FOUND, {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }

      const company = await ctx.runQuery(
        internal.companies.getCompanyByIdInternal,
        {
          companyId: move.companyId,
        }
      );

      if (!company) {
        throwConvexError(ErrorMessages.COMPANY_NOT_FOUND, {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }

      const customer = await ctx.runQuery(
        internal.customers.viewCustomerByIdInternal,
        {
          customerId: company.customerId,
        }
      );

      if (!customer) {
        throwConvexError("Customer not found", {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }

      const connectedAccount = await ctx.runQuery(
        internal.connectedAccounts.getConnectedAccountInternal,
        {
          customerId: customer._id,
        }
      );
      if (!connectedAccount) {
        throwConvexError("Connected account not found", {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }
      const connectedAccountId = connectedAccount.stripeAccountId;

      const profile = await ctx.runQuery(
        internal.moveCustomerStripeProfiles.getByMoveCustomerAndCompanyInternal,
        {
          moveCustomerId: move.moveCustomerId,
          companyId: move.companyId,
        }
      );

      const stripeCustomerId = profile?.stripeCustomerId;

      if (!stripeCustomerId) {
        throwConvexError("Stripe customer ID missing", {
          code: "INTERNAL_ERROR",
          showToUser: false,
        });
      }

      const setupIntent = await createStripeSetupIntent({
        stripeCustomerId,
        stripeConnectedAccountId: connectedAccountId,
      });

      if (!setupIntent.client_secret) {
        throwConvexError("Setup intent client secret missing", {
          code: "INTERNAL_ERROR",
          showToUser: false,
        });
      }

      return {
        clientSecret: setupIntent.client_secret,
      };
    } catch (error) {
      throwConvexError(error, {
        code: "INTERNAL_ERROR",
        showToUser: false,
      });
    }
  },
});

export const ensureMoveCustomerStripeProfile = action({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (
    ctx,
    { moveId }
  ): Promise<Doc<"moveCustomerStripeProfiles">> => {
    try {
  

      const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
        moveId,
      });

      if (!move) {
        throwConvexError(ErrorMessages.MOVE_NOT_FOUND, {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }


      const existingProfile = await ctx.runQuery(
        internal.moveCustomerStripeProfiles.getByMoveCustomerAndCompanyInternal,
        {
          moveCustomerId: move.moveCustomerId,
          companyId: move.companyId,
        }
      );

      if (existingProfile) {
        return existingProfile;
      }

      const company = await ctx.runQuery(
        internal.companies.getCompanyByIdInternal,
        {
          companyId: move.companyId,
        }
      );

      if (!company) {
        throwConvexError(ErrorMessages.COMPANY_NOT_FOUND, {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }

      const customer = await ctx.runQuery(
        internal.customers.viewCustomerByIdInternal,
        {
          customerId: company.customerId,
        }
      );

      if (!customer) {
        throwConvexError("Customer not found", {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }

      const connectedAccount = await ctx.runQuery(
        internal.connectedAccounts.getConnectedAccountInternal,
        {
          customerId: customer._id,
        }
      );

      if (!connectedAccount) {
        throwConvexError("Connected account not found", {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }

      const stripeCustomer = await createStripeCustomer({
        moveCustomerId: move.moveCustomerId,
        companyId: move.companyId,
        connectedAccountId: connectedAccount.stripeAccountId,
      });

      const profileId = await ctx.runMutation(
        internal.moveCustomerStripeProfiles.createMoveCustomerStripeProfile,
        {
          moveCustomerId: move.moveCustomerId,
          companyId: move.companyId,
          stripeCustomerId: stripeCustomer.id,
          stripeConnectedAccountId: connectedAccount.stripeAccountId,
        }
      );

      const profile = await ctx.runQuery(
        internal.moveCustomerStripeProfiles.getByIdInternal,
        {
          id: profileId,
        }
      );

      if (!profile) {
        throwConvexError("Failed to create Stripe profile", {
          code: "INTERNAL_ERROR",
          showToUser: false,
        });
      }

      return profile;
    } catch (error) {
      throwConvexError(error, {
        code: "INTERNAL_ERROR",
        showToUser: false,
      });
    }
  },
});
