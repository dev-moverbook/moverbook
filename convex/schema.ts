import {
  SubscriptionStatusConvex,
  UserRoleConvex,
  UserStatusConvex,
} from "@/types/convex-enums";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  companies: defineTable({
    calendarEmail: v.union(v.string(), v.null()),
    clerkOrganizationId: v.string(),
    companyEmail: v.union(v.string(), v.null()),
    companyPhone: v.union(v.string(), v.null()),
    customerId: v.optional(v.id("customers")),
    imageUrl: v.union(v.string(), v.null()),
    isActive: v.boolean(),
    name: v.string(),
  }),
  customers: defineTable({
    email: v.string(),
    isActive: v.boolean(),
    name: v.optional(v.string()),
    paymentMethodId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    subscriptionStatus: v.optional(SubscriptionStatusConvex),
  }).index("by_email", ["email"]),
  users: defineTable({
    clerkUserId: v.string(),
    companyId: v.optional(v.id("companies")),
    customerId: v.optional(v.id("customers")),
    email: v.string(),
    hourlyRate: v.optional(v.number()),
    imageUrl: v.union(v.string(), v.null()),
    name: v.string(),
    role: UserRoleConvex,
    isActive: v.boolean(),
  }).index("by_email", ["email"]),
});
