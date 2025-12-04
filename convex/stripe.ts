import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { CreateCustomerWithSubscriptionData } from "@/types/convex-responses";
import { ErrorMessages } from "@/types/errors";
import { sendClerkInvitation } from "./functions/clerk";
import { Doc } from "./_generated/dataModel";
import { throwConvexError } from "./backendUtils/errors";

export const createCustomerWithSubscription = action({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<CreateCustomerWithSubscriptionData> => {
    const { email } = args;
    const existingCustomer: Doc<"customers"> | null = await ctx.runQuery(
      internal.customers.viewCustomerByEmail,
      {
        email,
      }
    );
    if (existingCustomer && existingCustomer.isActive) {
      throwConvexError(ErrorMessages.CUSTOMER_EXISTS, {
        code: "BAD REQUEST",
        showToUser: true,
      });
    }

    const existingUser = await ctx.runQuery(
      internal.users.getUserByEmailInternal,
      {
        email,
      }
    );

    if (existingUser) {
      throwConvexError(ErrorMessages.USER_EXISTS, {
        code: "BAD REQUEST",
        showToUser: true,
      });
    }

    // TODO: create stripe

    // reactive exisiting customer
    if (existingCustomer && !existingCustomer.isActive) {
      await ctx.runMutation(internal.customers.updateCustomer, {
        customerId: existingCustomer._id,
        updates: {
          isActive: true,
        },
      });
      return {
        customerId: existingCustomer._id,
        status: "Reactivated",
      };
    } else {
      await sendClerkInvitation(email);
      const customerId = await ctx.runMutation(
        internal.customers.createCustomer,
        {
          email,
        }
      );
      return {
        customerId,
        status: "Created",
      };
    }
  },
});
