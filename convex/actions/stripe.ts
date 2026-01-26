"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import {
  createOffSessionPaymentIntent,
  createStripeCustomer,
  createStripeSetupIntent,
} from "../functions/stripe";
import { ClerkRoles } from "@/types/enums";
import { requireAuthenticatedUser } from "../backendUtils/auth";
import { internal } from "../_generated/api";
import { throwConvexError } from "../backendUtils/errors";
import { isIdentityInMove } from "../backendUtils/validate";
import { ErrorMessages } from "@/types/errors";
import Stripe from "stripe";
import { Doc } from "../_generated/dataModel";

export const createPaymentIntent = action({
  args: {
    moveId: v.id("moves"),
    type: v.union(v.literal("deposit"), v.literal("final_payment")),
    manualPaymentMethodId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { moveId, type, manualPaymentMethodId } = args;

    await requireAuthenticatedUser(ctx, [
      ClerkRoles.CUSTOMER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MANAGER,
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
    ]);
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

    const amount = type === "deposit" ? (move?.deposit ?? 0) : 220; // Add final pay logic

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
        userId: move.moveCustomerId,
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
        userId: move.moveCustomerId,
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
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.CUSTOMER,
    ]);

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

      isIdentityInMove(identity, move);

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
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.CUSTOMER,
      ]);

      const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
        moveId,
      });

      if (!move) {
        throwConvexError(ErrorMessages.MOVE_NOT_FOUND, {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }

      isIdentityInMove(identity, move);

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
