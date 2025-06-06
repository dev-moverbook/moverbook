import { StripeAccountStatusConvex } from "@/types/convex-enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { ConnectedAccountSchema } from "@/types/convex-schemas";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles, ResponseStatus, StripeAccountStatus } from "@/types/enums";
import { validateUser } from "./backendUtils/validate";
import {
  GetStripeConnectionResponse,
  GetStripeDashboardLinkResponse,
  WebhookHandlerResponse,
} from "@/types/convex-responses";
import { internal } from "./_generated/api";
import {
  createStripeConnectedAccount,
  generateStripeAccountLink,
  stripe,
} from "./backendUtils/stripe";
import {
  verifyStripeConnectedWebhook,
  handleAccountUpdated,
} from "./backendUtils/connectedAccountWebhook";
import Stripe from "stripe";

export const saveConnectedAccount = internalMutation({
  args: {
    customerId: v.id("customers"),
    stripeAccountId: v.string(),
    status: StripeAccountStatusConvex,
  },
  handler: async (ctx, args): Promise<Id<"connectedAccounts">> => {
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error(ErrorMessages.STRIPE_CONNECTED_DB_CREATE);
    }
  },
});

export const getStripeConnection = query({
  args: {},
  handler: async (ctx): Promise<GetStripeConnectionResponse> => {
    try {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          stripeConnected: account || null,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error:
          error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR,
      };
    }
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
  handler: async (ctx, { origin }) => {
    try {
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
        internal.connectedAccount.getConnectedAccountInternal,
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

        ctx.runMutation(internal.connectedAccount.saveConnectedAccount, {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          url,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error:
          error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR,
      };
    }
  },
});

export const getStripeDashboardLink = action({
  args: {},
  handler: async (ctx): Promise<GetStripeDashboardLinkResponse> => {
    try {
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

      const existingAccount: ConnectedAccountSchema | null = await ctx.runQuery(
        internal.connectedAccount.getConnectedAccountInternal,
        {
          customerId: user.customerId!,
        }
      );

      if (!existingAccount || !existingAccount.stripeAccountId) {
        return {
          status: ResponseStatus.ERROR,
          data: null,
          error: "No Stripe account found. Please complete onboarding first.",
        };
      }

      // Generate a login link for the Stripe dashboard
      const loginLink = await stripe.accounts.createLoginLink(
        existingAccount.stripeAccountId
      );

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          url: loginLink.url,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error:
          error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR,
      };
    }
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
        // You can handle more event types here if needed
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
