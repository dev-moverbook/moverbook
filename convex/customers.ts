import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const viewCustomerByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"customers"> | null> => {
    const customer: Doc<"customers"> | null = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return customer;
  },
});

export const viewCustomerByIdInternal = internalQuery({
  args: {
    customerId: v.id("customers"),
  },
  handler: async (ctx, args): Promise<Doc<"customers"> | null> => {
    return await ctx.db.get(args.customerId);
  },
});

export const createCustomer = internalMutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"customers">> => {
    const { email } = args;
    const customerId = await ctx.db.insert("customers", {
      email,
      isActive: true,
    });

    return customerId;
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
    await ctx.db.patch(customerId, updates);
    return customerId;
  },
});
