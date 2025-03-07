import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { CustomerSchema } from "@/types/convex-schemas";
import { ErrorMessages } from "@/types/errors";
import { Id } from "./_generated/dataModel";

export const viewCustomerByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<CustomerSchema | null> => {
    try {
      const customer: CustomerSchema | null = await ctx.db
        .query("customers")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      return customer;
    } catch (error) {
      console.error(ErrorMessages.CUSTOMER_DB_QUERY_BY_EMAIL_ERROR);
      throw new Error(ErrorMessages.CUSTOMER_DB_QUERY_BY_EMAIL_ERROR);
    }
  },
});

export const createCustomer = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"customers">> => {
    const { email } = args;
    try {
      const customerId = await ctx.db.insert("customers", {
        email,
        isActive: true,
      });

      return customerId;
    } catch (error) {
      console.error(ErrorMessages.CUSTOMER_DB_CREATE_ERROR, error);
      throw new Error(ErrorMessages.CUSTOMER_DB_CREATE_ERROR);
    }
  },
});

export const updateCustomer = internalMutation({
  args: {
    customerId: v.id("customers"),
    updates: v.object({
      isActive: v.optional(v.boolean()),
      stripeCustomerId: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"customers">> => {
    const { customerId, updates } = args;
    try {
      await ctx.db.patch(customerId, updates);
      return customerId;
    } catch (error) {
      console.error(ErrorMessages.CUSTOMER_DB_UPDATE_ERROR, error);
      throw new Error(ErrorMessages.CUSTOMER_DB_UPDATE_ERROR);
    }
  },
});
