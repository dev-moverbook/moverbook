import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { CreateCustomerWithSubscriptionResponse } from "@/types/convex-responses";
import { ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { sendClerkInvitation } from "@/utils/clerk";
import { CustomerSchema } from "@/types/convex-schemas";

export const createCustomerWithSubscription = action({
  args: {
    email: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<CreateCustomerWithSubscriptionResponse> => {
    const { email } = args;
    try {
      const existingCustomer: CustomerSchema | null = await ctx.runQuery(
        internal.customers.viewCustomerByEmail,
        {
          email,
        }
      );
      if (existingCustomer && existingCustomer.isActive) {
        return {
          status: ResponseStatus.ERROR,
          data: null,
          error: ErrorMessages.CUSTOMER_EXISTS,
        };
      }

      const existingUser = await ctx.runQuery(internal.users.viewUserByEmail, {
        email,
      });

      if (existingUser) {
        return {
          status: ResponseStatus.ERROR,
          data: null,
          error: ErrorMessages.USER_EXISTS,
        };
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
          status: ResponseStatus.SUCCESS,
          data: {
            customerId: existingCustomer._id,
            status: "Reactivated",
          },
        };
      } else {
        // create new customer
        await sendClerkInvitation(email);
        const customerId = await ctx.runMutation(
          internal.customers.createCustomer,
          {
            email,
          }
        );
        return {
          status: ResponseStatus.SUCCESS,
          data: {
            customerId,
            status: "Created",
          },
        };
      }
    } catch (error) {
      console.error("Error in createCustomerWithSubscription", error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: ErrorMessages.GENERIC,
      };
    }
  },
});
