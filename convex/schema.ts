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

export const HourStatusConvex = v.union(
  v.literal("approved"),
  v.literal("incomplete"),
  v.literal("pending"),
  v.literal("rejected")
);

export const ActivityEventTypeConvex = v.union(
  v.literal("ASSIGN_MOVER"),
  v.literal("CLOCK_IN"),
  v.literal("CLOCK_OUT"),
  v.literal("CONTRACT_SENT"),
  v.literal("CUSTOMER_CREATED"),
  v.literal("CUSTOMER_CREATED_BY_REP"),
  v.literal("CUSTOMER_MOVE_UPDATED"),
  v.literal("CUSTOMER_SIGNED_CONTRACT_DOC"),
  v.literal("CUSTOMER_UPDATED"),
  v.literal("CUSTOMER_UPDATED_BY_REP"),
  v.literal("DISCOUNT_ADDED"),
  v.literal("DISCOUNT_REMOVED"),
  v.literal("DISCOUNT_UPDATED"),
  v.literal("EXTERNAL_REVIEW_SENT"),
  v.literal("FEE_ADDED"),
  v.literal("FEE_REMOVED"),
  v.literal("FEE_UPDATED"),
  v.literal("FOLLOW_UP"),
  v.literal("HOURS_STATUS_UPDATED"),
  v.literal("INTERNAL_REVIEW_COMPLETED"),
  v.literal("INTERNAL_REVIEW_SENT"),
  v.literal("INVOICE_MARKED_COMPLETE"),
  v.literal("INVOICE_PAYMENT"),
  v.literal("INVOICE_SENT"),
  v.literal("LOCATION_SHARING_STARTED"),
  v.literal("LOCATION_SHARING_STOPPED"),
  v.literal("MESSAGE_INCOMING"),
  v.literal("MESSAGE_OUTGOING"),
  v.literal("MOVE_ARRIVAL"),
  v.literal("MOVE_BREAK_UPDATED"),
  v.literal("MOVE_COMPLETED"),
  v.literal("MOVE_CREATED"),
  v.literal("MOVE_STARTED"),
  v.literal("MOVE_STATUS_UPDATED"),
  v.literal("MOVE_UPDATED"),
  v.literal("NEW_LEAD"),
  v.literal("QUOTE_SENT"),
  v.literal("QUOTE_SIGNED"),
  v.literal("REMOVE_MOVER"),
  v.literal("SALES_REP_MARKED_BOOKED"),
  v.literal("WAIVER_SENT"),
  v.literal("WAIVER_SIGNED"),
  v.literal("WORK_BREAK_UPDATE")
);

export const ChangeRequestStatusConvex = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("rejected")
);

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

export const TollfreeVerificationStatusConvex = v.union(
  v.literal("Pending Review"),
  v.literal("In Review"),
  v.literal("Approved"),
  v.literal("Rejected"),
  v.literal("Expired"),
  v.literal("Verification Required")
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

export const ActivityEventVisibilityConvex = v.object({
  audienceRoles: v.array(UserRoleConvex),
  moversAssignedOnly: v.optional(v.boolean()),
});

export const QuoteStatusConvex = v.union(
  v.literal("pending"),
  v.literal("completed"),
  v.literal("customer_change")
);

export const ContractStatusConvex = v.union(
  v.literal("pending"),
  v.literal("completed")
);

export const InvoiceStatusConvex = v.union(
  v.literal("pending"),
  v.literal("completed")
);

export const WaiverStatusConvex = v.union(
  v.literal("pending"),
  v.literal("completed")
);

export const PaymentStatusConvex = v.union(
  v.literal("requires_payment_method"),
  v.literal("requires_confirmation"),
  v.literal("processing"),
  v.literal("succeeded"),
  v.literal("failed"),
  v.literal("canceled"),
  v.literal("refunded")
);
export const PaymentTypeConvex = v.union(
  v.literal("deposit"),
  v.literal("final_payment")
);

export default defineSchema({
  additionalFees: defineTable({
    feeId: v.optional(v.id("fees")),
    isActive: v.boolean(),
    moveId: v.id("moves"),
    name: v.string(),
    price: v.number(),
    quantity: v.number(),
  }).index("by_move", ["moveId"]),
  arrivalWindows: defineTable({
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
  companyContacts: defineTable({
    address: v.union(AddressConvex, v.null()),
    companyId: v.id("companies"),
    email: v.string(),
    phoneNumber: v.string(),
    sendgridName: v.optional(v.string()),
    sendgridSenderId: v.optional(v.string()),
    sendgridVerified: v.optional(v.boolean()),
    website: v.string(),
  }).index("by_companyId", ["companyId"]),
  compliances: defineTable({
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
    moveId: v.id("moves"),
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
    clerkOrganizationId: v.optional(v.string()),
    email: v.string(),
    hourlyRate: v.union(v.number(), v.null()),
    moveId: v.optional(v.id("moves")),
    role: UserRoleConvex,
    status: InvitationStatusConvex,
    userId: v.optional(v.id("users")),
    updatedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("status", ["status"])
    .index("by_clerkInvitationId", ["clerkInvitationId"])
    .index("by_userId", ["userId"])
    .index("by_clerkOrganizationId", ["clerkOrganizationId"]),
  invoices: defineTable({
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    moveId: v.id("moves"),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
    status: InvoiceStatusConvex,
  }).index("by_move", ["moveId"]),
  internalReviews: defineTable({
    moveId: v.id("moves"),
    rating: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
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
  labors: defineTable({
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
    moveId: v.id("moves"),
    resolvedMessage: v.string(),
    resolvedSubject: v.optional(v.union(v.string(), v.null())),
    sentType: MessageSentTypeConvex,
    sid: v.optional(v.string()),
    status: MessageStatusConvex,
    subject: v.optional(v.union(v.string(), v.null())),
  }).index("by_moveId", ["moveId"]),
  moveCustomers: defineTable({
    altPhoneNumber: v.optional(v.string()),
    companyId: v.id("companies"),
    email: v.string(),
    isActive: v.boolean(),
    name: v.string(),
    phoneNumber: v.string(),
    updatedAt: v.number(),
  })
    .index("by_companyId", ["companyId"])
    .index("by_email", ["email"])
    .index("by_phoneNumber", ["phoneNumber"]),
  moves: defineTable({
    actualArrivalTime: v.optional(v.number()),
    actualBreakTime: v.optional(v.number()),
    actualStartTime: v.optional(v.number()),
    actualEndTime: v.optional(v.number()),
    arrivalTimes: v.optional(ArrivalTimesConvex),
    companyId: v.id("companies"),
    creditCardFee: v.optional(v.number()),
    deposit: v.optional(v.number()),
    depositPaid: v.optional(v.boolean()),
    depositPaymentId: v.optional(v.id("payments")),
    depositPaidAt: v.optional(v.number()),
    destinationToOrigin: v.optional(v.union(v.null(), v.number())),
    endingMoveTime: v.optional(v.union(v.null(), v.number())),
    invoiceAmountPaid: v.optional(v.number()),
    invoicePaid: v.optional(v.boolean()),
    invoicePaymentId: v.optional(v.id("payments")),
    invoicePaidAt: v.optional(v.number()),
    invoicePaymentError: v.optional(v.union(v.null(), v.string())),
    jobId: v.string(),
    jobType: v.optional(JobTypeConvex),
    jobTypeRate: v.optional(v.union(v.null(), v.number())),
    liabilityCoverage: v.optional(v.union(v.null(), InsurancePolicyConvex)),
    locations: v.optional(v.array(LocationConvex)),
    moveCustomerId: v.id("moveCustomers"),
    moveDate: v.optional(v.union(v.null(), v.string())),
    moveFees: v.optional(v.array(MoveFeeConvex)),
    moveItems: v.optional(v.array(MoveItemConvex)),
    moveStatus: MoveStatusConvex,
    moveWindow: v.optional(MoveTimesConvex),
    movers: v.optional(v.number()),
    notes: v.optional(v.union(v.null(), v.string())),
    officeToOrigin: v.optional(v.union(v.null(), v.number())),
    paymentMethod: v.optional(PaymentMethodConvex),
    referralId: v.optional(v.id("referrals")),
    roundTripDrive: v.optional(v.union(v.null(), v.number())),
    roundTripMiles: v.optional(v.union(v.null(), v.number())),
    salesRep: v.optional(v.id("users")),
    segmentDistances: v.optional(v.array(SegmentDistanceConvex)),
    serviceType: v.union(v.null(), ServiceTypesConvex),
    startingMoveTime: v.optional(v.union(v.null(), v.number())),
    totalMiles: v.optional(v.union(v.null(), v.number())),
    travelFeeMethod: v.optional(v.union(v.null(), TravelChargingTypesConvex)),
    travelFeeRate: v.optional(v.union(v.null(), v.number())),
    trucks: v.optional(v.number()),
    quotedAt: v.optional(v.number()),
    bookedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
    lostAt: v.optional(v.number()),
    depositPaymentError: v.optional(v.union(v.null(), v.string())),
    updatedAt: v.optional(v.number()),
  })
    .index("by_moveDate", ["moveDate"])
    .index("by_companyId", ["companyId"])
    .index("by_moveCustomerIdAndCompanyId", ["moveCustomerId", "companyId"]),
  moveAssignments: defineTable({
    approvedHours: v.optional(v.number()),
    approvedPay: v.optional(v.number()),
    breakAmount: v.optional(v.number()),
    endTime: v.optional(v.number()),
    hourStatus: v.optional(HourStatusConvex),
    isLead: v.boolean(),
    managerNotes: v.optional(v.string()),
    moveId: v.id("moves"),
    moverId: v.id("users"),
    startTime: v.optional(v.number()),
  })
    .index("by_move", ["moveId"])
    .index("by_move_mover", ["moveId", "moverId"])
    .index("by_mover", ["moverId"]),
  moveChangeRequests: defineTable({
    customerAcknowledgedAt: v.optional(v.number()),
    moveId: v.id("moves"),
    status: ChangeRequestStatusConvex,
    requestedLocations: v.optional(v.array(LocationConvex)),
    requestedMoveItems: v.optional(v.array(MoveItemConvex)),
    rejectionNotes: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_move", ["moveId"]),
  moveCustomerStripeProfiles: defineTable({
    cardBrand: v.optional(v.string()),
    cardLast4: v.optional(v.string()),
    cardExpMonth: v.optional(v.number()),
    cardExpYear: v.optional(v.number()),
    companyId: v.id("companies"),
    defaultPaymentMethodId: v.optional(v.string()),
    moveCustomerId: v.id("moveCustomers"),
    stripeConnectedAccountId: v.string(),
    stripeCustomerId: v.string(),
    updatedAt: v.number(),
  })
    .index("by_moveCustomer", ["moveCustomerId"])
    .index("by_moveCustomer_company", ["moveCustomerId", "companyId"])
    .index("by_stripeCustomer", ["stripeCustomerId"]),
  moverLocations: defineTable({
    moveId: v.id("moves"),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    isOn: v.boolean(),
    timestamp: v.optional(v.number()),
  }).index("by_moveId", ["moveId"]),
  newsFeeds: defineTable({
    amount: v.optional(v.union(v.number(), v.null())),
    body: v.string(),
    companyId: v.id("companies"),
    moveCustomerId: v.optional(v.id("moveCustomers")),
    moveId: v.optional(v.id("moves")),
    type: ActivityEventTypeConvex,
    userId: v.optional(v.id("users")),
  })
    .index("by_moveId", ["moveId"])
    .index("by_moveCustomerId", ["moveCustomerId"])
    .index("by_userId", ["userId"])
    .index("by_companyId", ["companyId"])
    .index("by_moveId_userId", ["moveId", "userId"]),
  payments: defineTable({
    amount: v.number(), // in cents
    companyId: v.id("companies"),
    description: v.optional(v.string()),
    failureReason: v.optional(v.string()),
    moveId: v.id("moves"),
    stripeConnectedAccountId: v.string(),
    stripePaymentIntentId: v.string(),
    status: PaymentStatusConvex,
    type: PaymentTypeConvex,
    updatedAt: v.optional(v.number()),
    moveCustomerId: v.id("moveCustomers"),
  })
    .index("by_move", ["moveId"])
    .index("by_paymentIntent", ["stripePaymentIntentId"]),

  policies: defineTable({
    additionalTermsAndConditions: v.optional(v.string()),
    cancellationCutoffHour: v.number(),
    cancellationFee: v.number(),
    companyId: v.id("companies"),
    deposit: v.number(),
    weekdayHourMinimum: v.number(),
    weekendHourMinimum: v.number(),
  }).index("by_companyId", ["companyId"]),
  twilioNumbers: defineTable({
    companyId: v.id("companies"),
    twilioSid: v.string(),
    phoneNumber: v.string(),
    isActive: v.boolean(),
  }).index("by_companyId", ["companyId"]),
  contracts: defineTable({
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    moveId: v.id("moves"),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
    status: ContractStatusConvex,
  }).index("by_move", ["moveId"]),
  quotes: defineTable({
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    moveId: v.id("moves"),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
    status: QuoteStatusConvex,
  }).index("by_move", ["moveId"]),
  referrals: defineTable({
    companyId: v.id("companies"),
    isActive: v.boolean(),
    name: v.string(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_companyId", ["companyId"])
    .index("by_name", ["name"]),
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
    updatedAt: v.number(),
  }).index("by_companyId", ["companyId"]),
  travelFees: defineTable({
    companyId: v.id("companies"),
    defaultMethod: v.union(v.null(), TravelChargingTypesConvex),
    flatRate: v.optional(v.number()),
    mileageRate: v.optional(v.number()),
  }),
  twilioPhoneNumbers: defineTable({
    companyId: v.id("companies"),
    phoneNumberE164: v.string(),
    sid: v.string(),
    isActive: v.boolean(),
    tollfreeVerificationStatus: v.optional(TollfreeVerificationStatusConvex),
    tollfreeInquiryId: v.optional(v.string()),
    tollfreeVerificationSid: v.optional(v.string()),
    tollfreeRegistrationSid: v.optional(v.string()),
    tollfreeVerifiedAt: v.optional(v.number()),
    tollfreeRejectionReasons: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_companyId", ["companyId"])
    .index("by_phoneNumber", ["phoneNumberE164"])
    .index("by_sid", ["sid"])
    .index("by_updatedAt", ["updatedAt"]),
  users: defineTable({
    clerkUserId: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    customerId: v.optional(v.id("customers")),
    email: v.string(),
    hourlyRate: v.optional(v.union(v.number(), v.null())),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
    name: v.string(),
    role: v.optional(UserRoleConvex),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_companyId", ["companyId"]),
  waivers: defineTable({
    customerSignature: v.optional(v.string()),
    customerSignedAt: v.optional(v.number()),
    moveId: v.id("moves"),
    repSignature: v.optional(v.string()),
    repSignedAt: v.optional(v.number()),
    status: WaiverStatusConvex,
  }).index("by_move", ["moveId"]),
  webIntegrations: defineTable({
    companyId: v.id("companies"),
    externalReviewUrl: v.string(),
    webform: v.string(),
    webformEmbeddedCode: v.string(),
  }),
});
