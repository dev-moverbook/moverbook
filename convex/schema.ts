import {
  CommunicationTypeConvex,
  InvitationStatusConvex,
  PresSetScriptsConvex,
  StripeAccountStatusConvex,
  SubscriptionStatusConvex,
  UserRoleConvex,
} from "@/types/convex-enums";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  companies: defineTable({
    clerkOrganizationId: v.string(),
    customerId: v.id("customers"),
    imageUrl: v.union(v.string(), v.null()),
    isActive: v.boolean(),
    name: v.string(),
    slug: v.string(),
    timeZone: v.string(),
  }).index("by_slug", ["slug"]),
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
    hourlyRate: v.optional(v.union(v.number(), v.null())),
    imageUrl: v.string(),
    name: v.string(),
    role: v.optional(UserRoleConvex),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_companyId", ["companyId"]),
  invitations: defineTable({
    clerkInvitationId: v.string(),
    status: InvitationStatusConvex,
    clerkOrganizationId: v.string(),
    role: UserRoleConvex,
    email: v.string(),
    hourlyRate: v.union(v.number(), v.null()),
  })
    .index("by_email", ["email"])
    .index("status", ["status"])
    .index("by_clerkInvitationId", ["clerkInvitationId"])
    .index("by_clerkOrganizationId", ["clerkOrganizationId"]),
  connectedAccounts: defineTable({
    customerId: v.id("customers"),
    status: StripeAccountStatusConvex,
    chargesEnabled: v.optional(v.boolean()),
    payoutsEnabled: v.optional(v.boolean()),
    lastStripeUpdate: v.optional(v.number()),
    stripeAccountId: v.string(),
  }).index("by_customerId", ["customerId"]),
  referrals: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    isActive: v.boolean(),
  }),
  variables: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    defaultValue: v.string(),
  }),
  scripts: defineTable({
    companyId: v.id("companies"),
    title: v.string(),
    type: CommunicationTypeConvex,
    message: v.string(),
    preSetTypes: v.optional(PresSetScriptsConvex),
    isActive: v.boolean(),
    emailTitle: v.optional(v.string()),
  }),
  compliance: defineTable({
    companyId: v.id("companies"),
    statePucPermitNumber: v.string(),
    dmvNumber: v.string(),
    usDotNumber: v.string(),
  }),
  webIntegrations: defineTable({
    companyId: v.id("companies"),
    webform: v.string(),
    webformEmbeddedCode: v.string(),
  }),
  companyContact: defineTable({
    companyId: v.id("companies"),
    email: v.string(),
    phoneNumber: v.string(),
    address: v.string(),
    website: v.string(),
  }),
});
