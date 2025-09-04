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

export const AddressConvex = v.object({
  formattedAddress: v.string(),
  placeId: v.union(v.string(), v.null()),
  location: v.object({
    lat: v.union(v.number(), v.null()),
    lng: v.union(v.number(), v.null()),
  }),
});

export const LocationConvex = v.object({
  uid: v.string(),
  locationRole: LocationRoleConvex,
  address: v.union(AddressConvex, v.null()),
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

export const ArrivalTimesConvex = v.object({
  arrivalWindowStarts: v.union(v.string(), v.null()),
  arrivalWindowEnds: v.union(v.string(), v.null()),
});

export const PaymentMethodConvex = v.union(
  v.object({ kind: v.literal("credit_card") }),
  v.object({ kind: v.literal("other"), label: v.string() })
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
  additionalFees: defineTable({
    feeId: v.optional(v.id("fees")),
    isActive: v.boolean(),
    moveId: v.id("move"),
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
  }).index("by_move", ["moveId"]),

  additionalLiabilityCoverage: defineTable({
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    moveId: v.id("move"),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
  }).index("by_move", ["moveId"]),

  arrivalWindow: defineTable({
    afternoonArrival: v.string(),
    afternoonEnd: v.string(),
    companyId: v.id("companies"),
    morningArrival: v.string(),
    morningEnd: v.string(),
  }).index("by_company", ["companyId"]),

  categories: defineTable({
    companyId: v.id("companies"),
    isActive: v.boolean(),
    isStarter: v.boolean(),
    name: v.string(),
    parentCategory: v.optional(v.id("categories")),
  }).index("by_companyId", ["companyId"]),

  companies: defineTable({
    clerkOrganizationId: v.string(),
    customerId: v.id("customers"),
    imageUrl: v.union(v.string(), v.null()),
    isActive: v.boolean(),
    name: v.string(),
    slug: v.string(),
    timeZone: v.string(),
  }).index("by_slug", ["slug"]),

  companyContact: defineTable({
    address: v.union(AddressConvex, v.null()),
    companyId: v.id("companies"),
    email: v.string(),
    phoneNumber: v.string(),
    sendgridName: v.optional(v.string()),
    sendgridSenderId: v.optional(v.string()),
    sendgridVerified: v.optional(v.boolean()),
    website: v.string(),
  }).index("by_companyId", ["companyId"]),

  compliance: defineTable({
    companyId: v.id("companies"),
    dmvNumber: v.string(),
    statePucPermitNumber: v.string(),
    usDotNumber: v.string(),
  }),

  connectedAccounts: defineTable({
    chargesEnabled: v.optional(v.boolean()),
    customerId: v.id("customers"),
    lastStripeUpdate: v.optional(v.number()),
    payoutsEnabled: v.optional(v.boolean()),
    status: StripeAccountStatusConvex,
    stripeAccountId: v.string(),
  })
    .index("by_customerId", ["customerId"])
    .index("by_stripeAccountId", ["stripeAccountId"]),

  creditCardFees: defineTable({
    companyId: v.id("companies"),
    rate: v.number(),
  }),

  customers: defineTable({
    email: v.string(),
    isActive: v.boolean(),
    name: v.optional(v.string()),
    paymentMethodId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    subscriptionStatus: v.optional(SubscriptionStatusConvex),
  }).index("by_email", ["email"]),

  discounts: defineTable({
    isActive: v.boolean(),
    moveId: v.id("move"),
    name: v.string(),
    price: v.number(),
  }).index("by_move", ["moveId"]),

  fees: defineTable({
    companyId: v.id("companies"),
    isActive: v.boolean(),
    name: v.string(),
    price: v.number(),
  }).index("byCompanyId", ["companyId"]),

  insurancePolicies: defineTable({
    companyId: v.id("companies"),
    coverageAmount: v.number(),
    coverageType: v.number(),
    isActive: v.boolean(),
    isDefault: v.boolean(),
    name: v.string(),
    premium: v.number(),
  }).index("by_companyId", ["companyId"]),

  invitations: defineTable({
    clerkInvitationId: v.string(),
    clerkOrganizationId: v.string(),
    email: v.string(),
    hourlyRate: v.union(v.number(), v.null()),
    role: UserRoleConvex,
    status: InvitationStatusConvex,
  })
    .index("by_email", ["email"])
    .index("status", ["status"])
    .index("by_clerkInvitationId", ["clerkInvitationId"])
    .index("by_clerkOrganizationId", ["clerkOrganizationId"]),

  invoices: defineTable({
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    moveId: v.id("move"),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
    status: InvoiceStatusConvex,
  }).index("by_move", ["moveId"]),

  internalReview: defineTable({
    moveId: v.id("move"),
    rating: v.number(),
  }).index("by_move", ["moveId"]),

  items: defineTable({
    categoryId: v.optional(v.id("categories")),
    companyId: v.id("companies"),
    isActive: v.boolean(),
    isPopular: v.optional(v.boolean()),
    isStarter: v.boolean(),
    name: v.string(),
    size: v.number(),
    weight: v.number(),
  }).index("by_companyId", ["companyId"]),

  labor: defineTable({
    companyId: v.id("companies"),
    endDate: v.union(v.number(), v.null()),
    extra: v.number(),
    fourMovers: v.number(),
    isActive: v.boolean(),
    isDefault: v.boolean(),
    name: v.string(),
    startDate: v.union(v.number(), v.null()),
    threeMovers: v.number(),
    twoMovers: v.number(),
  }).index("by_companyId", ["companyId"]),

  messages: defineTable({
    companyId: v.id("companies"),
    message: v.string(),
    method: CommunicationTypeConvex,
    moveId: v.id("move"),
    resolvedMessage: v.string(),
    resolvedSubject: v.optional(v.union(v.string(), v.null())),
    sentType: MessageSentTypeConvex,
    sid: v.optional(v.string()),
    status: MessageStatusConvex,
    subject: v.optional(v.union(v.string(), v.null())),
  }).index("by_moveId", ["moveId"]),

  move: defineTable({
    actualArrivalTime: v.optional(v.number()),
    actualBreakTime: v.optional(v.number()),
    actualStartTime: v.optional(v.number()),
    actualEndTime: v.optional(v.number()),
    arrivalTimes: ArrivalTimesConvex,
    companyId: v.id("companies"),
    creditCardFee: v.number(),
    deposit: v.number(),
    destinationToOrigin: v.union(v.null(), v.number()),
    endingMoveTime: v.union(v.null(), v.number()),
    invoiceAmountPaid: v.optional(v.number()),
    jobId: v.string(),
    jobType: JobTypeConvex,
    jobTypeRate: v.union(v.null(), v.number()),
    liabilityCoverage: v.union(v.null(), InsurancePolicyConvex),
    locations: v.array(LocationConvex),
    moveCustomerId: v.id("moveCustomers"),
    moveDate: v.union(v.null(), v.string()),
    moveFees: v.array(MoveFeeConvex),
    moveItems: v.array(MoveItemConvex),
    moveStatus: MoveStatusConvex,
    moveWindow: MoveTimesConvex,
    movers: v.number(),
    notes: v.union(v.null(), v.string()),
    officeToOrigin: v.union(v.null(), v.number()),
    paymentMethod: PaymentMethodConvex,
    roundTripDrive: v.union(v.null(), v.number()),
    roundTripMiles: v.union(v.null(), v.number()),
    salesRep: v.id("users"),
    segmentDistances: v.array(SegmentDistanceConvex),
    serviceType: v.union(v.null(), ServiceTypesConvex),
    startingMoveTime: v.union(v.null(), v.number()),
    totalMiles: v.union(v.null(), v.number()),
    travelFeeMethod: v.optional(v.union(v.null(), TravelChargingTypesConvex)),
    travelFeeRate: v.optional(v.union(v.null(), v.number())),
    trucks: v.number(),
  })
    .index("by_moveDate", ["moveDate"])
    .index("by_companyId", ["companyId"])
    .index("by_moveCustomerId", ["moveCustomerId"]),

  moveAssignments: defineTable({
    approvedHours: v.optional(v.number()),
    approvedPay: v.optional(v.number()),
    breakAmount: v.optional(v.number()),
    endTime: v.optional(v.number()),
    hourStatus: v.optional(HourStatusConvex),
    isLead: v.boolean(),
    managerNotes: v.optional(v.string()),
    moveId: v.id("move"),
    moverId: v.id("users"),
    startTime: v.optional(v.number()),
  })
    .index("by_move", ["moveId"])
    .index("by_move_mover", ["moveId", "moverId"])
    .index("by_mover", ["moverId"]),

  moveCustomers: defineTable({
    altPhoneNumber: v.union(v.null(), v.string()),
    companyId: v.id("companies"),
    email: v.string(),
    name: v.string(),
    phoneNumber: v.string(),
    referral: v.union(v.null(), v.string()),
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phoneNumber"])
    .index("by_name", ["name"]),

  policies: defineTable({
    additionalTermsAndConditions: v.optional(v.string()),
    cancellationCutoffHour: v.number(),
    cancellationFee: v.number(),
    companyId: v.id("companies"),
    deposit: v.number(),
    weekdayHourMinimum: v.number(),
    weekendHourMinimum: v.number(),
  }).index("by_companyId", ["companyId"]),

  preMoveDocs: defineTable({
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    moveId: v.id("move"),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
  }).index("by_move", ["moveId"]),

  quotes: defineTable({
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    moveId: v.id("move"),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
    status: QuoteStatusConvex,
  }).index("by_move", ["moveId"]),

  referrals: defineTable({
    companyId: v.id("companies"),
    isActive: v.boolean(),
    name: v.string(),
  }).index("by_companyId", ["companyId"]),

  rooms: defineTable({
    companyId: v.id("companies"),
    isActive: v.boolean(),
    isStarter: v.boolean(),
    name: v.string(),
  }).index("by_companyId", ["companyId"]),

  scripts: defineTable({
    companyId: v.id("companies"),
    emailTitle: v.optional(v.string()),
    isActive: v.boolean(),
    message: v.string(),
    preSetTypes: v.optional(PresSetScriptsConvex),
    title: v.string(),
    type: CommunicationTypeConvex,
  }),

  travelFee: defineTable({
    companyId: v.id("companies"),
    defaultMethod: v.union(v.null(), TravelChargingTypesConvex),
    flatRate: v.optional(v.number()),
    mileageRate: v.optional(v.number()),
  }),

  users: defineTable({
    clerkUserId: v.string(),
    companyId: v.optional(v.id("companies")),
    customerId: v.optional(v.id("customers")),
    email: v.string(),
    hourlyRate: v.optional(v.union(v.number(), v.null())),
    imageUrl: v.string(),
    isActive: v.boolean(),
    name: v.string(),
    role: v.optional(UserRoleConvex),
  })
    .index("by_email", ["email"])
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_companyId", ["companyId"]),

  variables: defineTable({
    companyId: v.id("companies"),
    defaultValue: v.string(),
    name: v.string(),
  }),

  webIntegrations: defineTable({
    companyId: v.id("companies"),
    externalReviewUrl: v.string(),
    webform: v.string(),
    webformEmbeddedCode: v.string(),
  }),
});
