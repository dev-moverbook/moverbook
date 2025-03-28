import { StripeAccountStatusConvex } from "@/types/convex-enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { ConnectedAccountSchema } from "@/types/convex-schemas";

export const saveConnectedAccount = internalMutation({
  args: {
    customerId: v.id("customers"),
    stripeAccountId: v.string(),
    status: StripeAccountStatusConvex,
  },
  handler: async (ctx, args): Promise<Id<"connectedAccounts">> => {
    try {
      const existingAccount: ConnectedAccountSchema | null = await ctx.db
        .query("connectedAccounts")
        .withIndex("by_customerId", (q) => q.eq("customerId", args.customerId))
        .first();

      let connectedAccountId: Id<"connectedAccounts">;
      if (existingAccount) {
        await ctx.db.patch(existingAccount._id, {
          stripeAccountId: args.stripeAccountId,
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
