import {
  AccessTypeConvex,
  CommunicationTypeConvex,
  InvitationStatusConvex,
  JobTypeConvex,
  LocationRoleConvex,
  MessageSentTypeConvex,
  MessageStatusConvex,
  MoveSizeConvex,
  MoveStatusConvex,
  MoveTimesConvex,
  LocationTypeConvex,
  PresSetScriptsConvex,
  ServiceTypesConvex,
  StripeAccountStatusConvex,
  SubscriptionStatusConvex,
  TravelChargingTypesConvex,
  UserRoleConvex,
} from "@/types/convex-enums";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const MoveFeeConvex = v.object({
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
});

export const MoveItemConvex = v.object({
  item: v.string(),
  room: v.string(),
  quantity: v.number(),
  weight: v.number(),
  size: v.number(),
});

export const StopBehaviorConvex = v.union(
  v.literal("drop_off"),
  v.literal("pick_up")
);

export const TimeDistanceRangeConvex = v.union(
  v.literal("0-30 sec (less than 100 ft)"),
  v.literal("30-50 sec (200 ft)"),
  v.literal("50-70 sec (300 ft)"),
  v.literal("70-90 sec (400 ft)")
);

export const LocationConvex = v.object({
  uid: v.string(),
  locationRole: LocationRoleConvex,
  address: v.union(v.string(), v.null()),
  locationType: v.union(LocationTypeConvex, v.null()),
  aptNumber: v.union(v.string(), v.null()),
  aptName: v.union(v.string(), v.null()),
  squareFootage: v.union(v.number(), v.null()),
  accessType: v.union(AccessTypeConvex, v.null()),
  moveSize: v.union(MoveSizeConvex, v.null()),
  stopBehavior: v.optional(v.array(StopBehaviorConvex)),
  timeDistanceRange: v.union(TimeDistanceRangeConvex),
});

export const InsurancePolicyConvex = v.object({
  name: v.string(),
  coverageType: v.number(),
  coverageAmount: v.number(),
  premium: v.number(),
  isDefault: v.boolean(),
  isActive: v.boolean(),
  _id: v.id("insurancePolicies"),
  companyId: v.id("companies"),
  _creationTime: v.number(),
});

export const SegmentDistanceConvex = v.object({
  label: v.string(),
  distance: v.union(v.number(), v.null()),
  duration: v.union(v.number(), v.null()),
});

// schema.ts or similar
export const ArrivalTimesConvex = v.object({
  arrivalWindowStarts: v.union(v.string(), v.null()),
  arrivalWindowEnds: v.union(v.string(), v.null()),
});

export const PaymentMethodConvex = v.union(
  v.literal("credit_card"),
  v.literal("check"),
  v.literal("cash")
);

export const QuoteStatusConvex = v.union(
  v.literal("pending"),
  v.literal("completed"),
  v.literal("customer_change")
);

export const HourStatusConvex = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
);

export const InvoiceStatusConvex = v.union(
  v.literal("pending"),
  v.literal("completed")
);

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
  })
    .index("by_customerId", ["customerId"])
    .index("by_stripeAccountId", ["stripeAccountId"]),
  referrals: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    isActive: v.boolean(),
  }).index("by_companyId", ["companyId"]),

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
    externalReviewUrl: v.string(),
    webform: v.string(),
    webformEmbeddedCode: v.string(),
  }),
  companyContact: defineTable({
    companyId: v.id("companies"),
    email: v.string(),
    phoneNumber: v.string(),
    address: v.string(),
    website: v.string(),
    sendgridSenderId: v.optional(v.string()),
    sendgridVerified: v.optional(v.boolean()),
    sendgridName: v.optional(v.string()),
  }).index("by_companyId", ["companyId"]),
  arrivalWindow: defineTable({
    companyId: v.id("companies"),
    morningArrival: v.string(),
    morningEnd: v.string(),
    afternoonArrival: v.string(),
    afternoonEnd: v.string(),
  }).index("by_company", ["companyId"]),
  policies: defineTable({
    companyId: v.id("companies"),
    weekdayHourMinimum: v.number(),
    weekendHourMinimum: v.number(),
    deposit: v.number(),
    cancellationFee: v.number(),
    cancellationCutoffHour: v.number(),
    additionalTermsAndConditions: v.optional(v.string()),
  }).index("by_companyId", ["companyId"]),
  labor: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    isDefault: v.boolean(),
    startDate: v.union(v.number(), v.null()),
    endDate: v.union(v.number(), v.null()),
    twoMovers: v.number(),
    threeMovers: v.number(),
    fourMovers: v.number(),
    extra: v.number(),
    isActive: v.boolean(),
  }).index("by_companyId", ["companyId"]),
  insurancePolicies: defineTable({
    companyId: v.id("companies"),
    coverageType: v.number(),
    coverageAmount: v.number(),
    isActive: v.boolean(),
    isDefault: v.boolean(),
    name: v.string(),
    premium: v.number(),
  }).index("by_companyId", ["companyId"]),
  creditCardFees: defineTable({
    companyId: v.id("companies"),
    rate: v.number(),
  }),
  fees: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    price: v.number(),
    isActive: v.boolean(),
  }).index("byCompanyId", ["companyId"]),
  travelFee: defineTable({
    companyId: v.id("companies"),
    mileageRate: v.optional(v.number()),
    flatRate: v.optional(v.number()),
    defaultMethod: v.union(v.null(), TravelChargingTypesConvex),
  }),
  rooms: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    isActive: v.boolean(),
    isStarter: v.boolean(),
  }).index("by_companyId", ["companyId"]),
  categories: defineTable({
    companyId: v.id("companies"),
    name: v.string(),
    parentCategory: v.optional(v.id("categories")),
    isActive: v.boolean(),
    isStarter: v.boolean(),
  }).index("by_companyId", ["companyId"]),
  items: defineTable({
    companyId: v.id("companies"),
    categoryId: v.optional(v.id("categories")),
    name: v.string(),
    size: v.number(),
    isActive: v.boolean(),
    isPopular: v.optional(v.boolean()),
    isStarter: v.boolean(),
    weight: v.number(),
  }).index("by_companyId", ["companyId"]),
  moveCustomers: defineTable({
    altPhoneNumber: v.union(v.null(), v.string()),
    email: v.string(),
    name: v.string(),
    phoneNumber: v.string(),
    referral: v.union(v.null(), v.string()),
    companyId: v.id("companies"),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phoneNumber"])
    .index("by_name", ["name"]),
  move: defineTable({
    arrivalTimes: ArrivalTimesConvex,
    companyId: v.id("companies"),
    creditCardFee: v.optional(v.union(v.null(), v.number())),
    deposit: v.number(),
    depositMethod: v.union(v.null(), PaymentMethodConvex),
    destinationToOrigin: v.union(v.null(), v.number()),
    endingMoveTime: v.union(v.null(), v.number()),
    jobId: v.string(),
    jobType: JobTypeConvex,
    jobTypeRate: v.union(v.null(), v.number()),
    liabilityCoverage: v.union(v.null(), InsurancePolicyConvex),
    locations: v.array(LocationConvex),
    moveDate: v.union(v.null(), v.string()),
    moveFees: v.array(MoveFeeConvex),
    moveItems: v.array(MoveItemConvex),
    moveStatus: MoveStatusConvex,
    moveCustomerId: v.id("moveCustomers"),
    moveWindow: MoveTimesConvex,
    movers: v.number(),
    notes: v.union(v.null(), v.string()),
    officeToOrigin: v.union(v.null(), v.number()),
    roundTripDrive: v.union(v.null(), v.number()),
    roundTripMiles: v.union(v.null(), v.number()),
    salesRep: v.id("users"),
    serviceType: v.union(v.null(), ServiceTypesConvex),
    startingMoveTime: v.union(v.null(), v.number()),
    totalMiles: v.union(v.null(), v.number()),
    travelFeeRate: v.optional(v.union(v.null(), v.number())),
    travelFeeMethod: v.optional(v.union(v.null(), TravelChargingTypesConvex)),
    trucks: v.number(),
    segmentDistances: v.array(SegmentDistanceConvex),
  })
    .index("by_moveDate", ["moveDate"])
    .index("by_moveCustomerId", ["moveCustomerId"]),
  quotes: defineTable({
    moveId: v.id("move"),
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
    status: QuoteStatusConvex,
  }).index("by_move", ["moveId"]),
  moveAssignments: defineTable({
    moveId: v.id("move"),
    moverId: v.id("users"),
    isLead: v.boolean(),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    breakAmount: v.optional(v.number()),
    hourStatus: v.optional(HourStatusConvex),
    managerNotes: v.optional(v.string()),
  }).index("by_move", ["moveId"]),
  preMoveDocs: defineTable({
    moveId: v.id("move"),
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
  }).index("by_move", ["moveId"]),
  additionalLiabilityCoverage: defineTable({
    moveId: v.id("move"),
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
  }).index("by_move", ["moveId"]),
  additionalFees: defineTable({
    moveId: v.id("move"),
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
    feeId: v.optional(v.id("fees")),
    isActive: v.boolean(),
  }).index("by_move", ["moveId"]),
  discounts: defineTable({
    moveId: v.id("move"),
    name: v.string(),
    price: v.number(),
    isActive: v.boolean(),
  }).index("by_move", ["moveId"]),
  invoices: defineTable({
    moveId: v.id("move"),
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
    status: InvoiceStatusConvex,
  }).index("by_move", ["moveId"]),
  internalReview: defineTable({
    moveId: v.id("move"),
    rating: v.number(),
  }).index("by_move", ["moveId"]),
  messages: defineTable({
    moveId: v.id("move"),
    companyId: v.id("companies"),
    method: CommunicationTypeConvex,
    status: MessageStatusConvex,
    resolvedMessage: v.string(),
    message: v.string(),
    sid: v.optional(v.string()),
    subject: v.optional(v.union(v.string(), v.null())),
    sentType: MessageSentTypeConvex,
    resolvedSubject: v.optional(v.union(v.string(), v.null())),
  }).index("by_moveId", ["moveId"]),
});
