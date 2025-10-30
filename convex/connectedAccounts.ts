import { StripeAccountStatusConvex } from "@/types/convex-enums";
import { ErrorMessages } from "@/types/errors";
import { ConvexError, v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles, StripeAccountStatus } from "@/types/enums";
import { validateUser } from "./backendUtils/validate";
import { internal } from "./_generated/api";
import {
  createStripeConnectedAccount,
  generateStripeAccountLink,
  generateStripeAccountLoginLink,
  stripe,
} from "./backendUtils/stripe";
import { handleAccountUpdated } from "./backendUtils/connectedAccountWebhook";
import Stripe from "stripe";

export const saveConnectedAccount = internalMutation({
  args: {
    customerId: v.id("customers"),
    stripeAccountId: v.string(),
    status: StripeAccountStatusConvex,
  },
  handler: async (ctx, args): Promise<Id<"connectedAccounts">> => {
    const existingAccount = await ctx.db
      .query("connectedAccounts")
      .withIndex("by_stripeAccountId", (q) =>
        q.eq("stripeAccountId", args.stripeAccountId)
      )
      .first();

    let connectedAccountId: Id<"connectedAccounts">;
    if (existingAccount) {
      await ctx.db.patch(existingAccount._id, {
        customerId: args.customerId,
        status: args.status,
        lastStripeUpdate: Date.now(),
      });
      connectedAccountId = existingAccount._id;
    } else {
      connectedAccountId = await ctx.db.insert("connectedAccounts", {
        customerId: args.customerId,
        stripeAccountId: args.stripeAccountId,
        status: args.status,
        lastStripeUpdate: Date.now(),
      });
    }

    return existingAccount?._id || connectedAccountId;
  },
});

export const getStripeConnection = query({
  args: {},
  handler: async (ctx): Promise<Doc<"connectedAccounts"> | null> => {
    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.ADMIN]);

    const clerkUserId = identity.id as string;

    const user = validateUser(
      await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
        .unique(),
      true,
      true,
      true
    );

    const account = await ctx.db
      .query("connectedAccounts")
      .withIndex("by_customerId", (q) => q.eq("customerId", user.customerId!))
      .unique();

    return account;
  },
});

export const getConnectedAccountInternal = internalQuery({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("connectedAccounts")
      .withIndex("by_customerId", (q) => q.eq("customerId", args.customerId))
      .unique();
  },
});

export const createStripeOnboardingLink = action({
  args: { origin: v.string() },
  handler: async (ctx, { origin }): Promise<string> => {
    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.ADMIN]);
    const email = identity.email as string;

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByEmailInternal, {
        email,
      }),
      true,
      true,
      true
    );

    const existingAccount = await ctx.runQuery(
      internal.connectedAccounts.getConnectedAccountInternal,
      {
        customerId: user.customerId!,
      }
    );

    let stripeAccountId = existingAccount?.stripeAccountId;

    if (!stripeAccountId) {
      const account = await createStripeConnectedAccount({
        email: user.email,
        customerId: user.customerId!,
      });

      stripeAccountId = account.id;

      ctx.runMutation(internal.connectedAccounts.saveConnectedAccount, {
        customerId: user.customerId!,
        stripeAccountId: account.id,
        status: StripeAccountStatus.NOT_ONBOARDED,
      });
    }

    const url = await generateStripeAccountLink({
      accountId: stripeAccountId,
      type: "account_onboarding",
      returnUrl: origin,
      refreshUrl: origin,
    });

    return url;
  },
});

export const getStripeDashboardLink = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.ADMIN]);
    const email = identity.email as string;

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByEmailInternal, {
        email,
      }),
      true,
      true,
      true
    );

    const existingAccount: Doc<"connectedAccounts"> | null = await ctx.runQuery(
      internal.connectedAccounts.getConnectedAccountInternal,
      {
        customerId: user.customerId!,
      }
    );

    if (!existingAccount || !existingAccount.stripeAccountId) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: ErrorMessages.CONNECTED_ACCOUNT_NO_CUSTOMER_ID,
      });
    }

    const loginLink = await generateStripeAccountLoginLink({
      accountId: existingAccount.stripeAccountId,
    });

    return loginLink;
  },
});

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, { signature, payload }) => {
    const webhookSecret = process.env.STRIPE_CONNECTED_WEBHOOK_SECRET as string;

    try {
      const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret
      );

      switch (event.type) {
        case "account.updated": {
          const account = event.data.object as Stripe.Account;
          await handleAccountUpdated(ctx, account);
          break;
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
