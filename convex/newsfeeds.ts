import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
  validateUser,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { EnrichedNewsFeed } from "@/types/types";
import { ErrorMessages } from "@/types/errors";
import { Doc, Id } from "./_generated/dataModel";
import {
  getUserImageMap,
  mergeNewsFeedAndImages,
} from "./backendUtils/newsFeedHelper";
import {
  CommunicationTypeConvex,
  FollowUpCommunicationTypeConvex,
  MoveStatusConvex,
} from "@/types/convex-enums";
import { HourStatusConvex, PaymentMethodConvex } from "./schema";

export const getActivitiesForUser = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<EnrichedNewsFeed[]> => {
    const { companyId } = args;
    const authenticatedUser = await requireAuthenticatedUser(ctx);
    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(authenticatedUser, company.clerkOrganizationId);

    const clerkUserId = authenticatedUser.id as string;
    const userRecord = validateUser(
      await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
        .unique()
    );

    let newsFeedItems: Doc<"newsFeeds">[];
    if (userRecord.role === ClerkRoles.MOVER) {
      newsFeedItems = await ctx.db
        .query("newsFeeds")
        .withIndex("by_userId", (q) => q.eq("userId", userRecord._id))
        .order("desc")
        .collect();
    } else {
      newsFeedItems = await ctx.db
        .query("newsFeeds")
        .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
        .order("desc")
        .collect();
    }

    const uniqueUserIds = Array.from(
      new Set(
        newsFeedItems
          .map((event) => event.userId)
          .filter((userId): userId is Id<"users"> => userId !== undefined)
      )
    );

    const userImageMap = await getUserImageMap(ctx, uniqueUserIds);

    return mergeNewsFeedAndImages(newsFeedItems, userImageMap);
  },
});

export const getActivitiesByMoveId = query({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<EnrichedNewsFeed[]> => {
    const { moveId } = args;
    const identity = await requireAuthenticatedUser(ctx);
    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    let newsFeedItems: Doc<"newsFeeds">[];
    if (identity.role === ClerkRoles.MOVER) {
      const user = validateUser(
        await ctx.db
          .query("users")
          .withIndex("by_clerkUserId", (q) =>
            q.eq("clerkUserId", identity.id as string)
          )
          .unique()
      );
      newsFeedItems = await ctx.db
        .query("newsFeeds")
        .withIndex("by_moveId_userId", (q) =>
          q.eq("moveId", moveId).eq("userId", user._id)
        )
        .order("desc")
        .collect();
    } else {
      newsFeedItems = await ctx.db
        .query("newsFeeds")
        .withIndex("by_moveId", (q) => q.eq("moveId", moveId))
        .order("desc")
        .collect();
    }

    const uniqueUserIds = Array.from(
      new Set(
        newsFeedItems
          .map((event) => event.userId)
          .filter((userId): userId is Id<"users"> => userId !== undefined)
      )
    );

    const userImageMap = await getUserImageMap(ctx, uniqueUserIds);

    return mergeNewsFeedAndImages(newsFeedItems, userImageMap);
  },
});

const newsFeedEntryUnion = v.union(
  v.object({
    type: v.literal("ASSIGN_MOVER"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveAssignmentId: v.id("moveAssignments"),
      moveDate: v.string(),
      moverName: v.string(),
    }),
    moveId: v.id("moves"),
    amount: v.number(),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("CLOCK_IN"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveAssignmentId: v.id("moveAssignments"),
      moverName: v.string(),
      workStartTime: v.number(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("CLOCK_OUT"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moverName: v.string(),
      moveAssignmentId: v.id("moveAssignments"),
      workEndTime: v.number(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("CONTRACT_SENT"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      deliveryType: CommunicationTypeConvex,
      salesRepName: v.optional(v.string()),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  // To do
  v.object({
    type: v.literal("CUSTOMER_CREATED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
    }),
    moveCustomerId: v.id("moveCustomers"),
  }),
  v.object({
    type: v.literal("CUSTOMER_CREATED_BY_REP"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      salesRepName: v.string(),
    }),
    moveCustomerId: v.id("moveCustomers"),
    userId: v.id("users"),
  }),
  // To do
  v.object({
    type: v.literal("CUSTOMER_MOVE_UPDATED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveId: v.id("moves"),
      moveDate: v.string(),
    }),
    moveCustomerId: v.id("moveCustomers"),
  }),
  v.object({
    type: v.literal("CUSTOMER_SIGNED_CONTRACT_DOC"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
    }),
    moveId: v.id("moves"),
    moveCustomerId: v.id("moveCustomers"),
  }),
  v.object({
    type: v.literal("CUSTOMER_UPDATED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
    }),
    moveCustomerId: v.id("moveCustomers"),
  }),
  v.object({
    type: v.literal("CUSTOMER_UPDATED_BY_REP"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveCustomerId: v.id("moveCustomers"),
      salesRepName: v.string(),
    }),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("DISCOUNT_ADDED"),
    body: v.string(),
    companyId: v.id("companies"),
    amount: v.number(),
    moveId: v.id("moves"),
    context: v.object({
      customerName: v.string(),
      moveDate: v.string(),
      discountId: v.id("discounts"),
      discountName: v.string(),
      moverName: v.string(),
    }),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("DISCOUNT_REMOVED"),
    amount: v.number(),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      discountId: v.id("discounts"),
      discountName: v.string(),
      moveDate: v.string(),
      moverName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("DISCOUNT_UPDATED"),
    amount: v.number(),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      discountId: v.id("discounts"),
      discountName: v.string(),
      moveDate: v.string(),
      moverName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("EXTERNAL_REVIEW_SENT"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      deliveryType: CommunicationTypeConvex,
      moveDate: v.string(),
      salesRepName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("FEE_ADDED"),
    amount: v.number(),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      feeAmount: v.number(),
      feeId: v.id("additionalFees"),
      feeName: v.string(),
      moveDate: v.string(),
      moverName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("FEE_REMOVED"),
    amount: v.number(),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      feeAmount: v.number(),
      feeId: v.id("additionalFees"),
      feeName: v.string(),
      moverName: v.string(),
      moveDate: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("FEE_UPDATED"),
    amount: v.number(),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      feeAmount: v.number(),
      feeId: v.id("additionalFees"),
      feeName: v.string(),
      moverName: v.string(),
      moveDate: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  // To do
  v.object({
    type: v.literal("FOLLOW_UP"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveDate: v.string(),
      followUpType: FollowUpCommunicationTypeConvex,
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("HOURS_STATUS_UPDATED"),
    amount: v.optional(v.number()),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      hourStatus: HourStatusConvex,
      moveAssignmentId: v.id("moveAssignments"),
      moverName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("INTERNAL_REVIEW_COMPLETED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveDate: v.string(),
      rating: v.number(),
    }),
    moveCustomerId: v.id("moveCustomers"),
    moveId: v.id("moves"),
  }),
  v.object({
    type: v.literal("INTERNAL_REVIEW_SENT"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      deliveryType: CommunicationTypeConvex,
      internalReviewId: v.id("internalReviews"),
      moveDate: v.string(),
      salesRepName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("INVOICE_MARKED_COMPLETE"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      moverName: v.string(),
      invoiceId: v.id("invoices"),
      customerName: v.string(),
      moveDate: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  // To do
  v.object({
    type: v.literal("INVOICE_PAYMENT"),
    amount: v.number(),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      invoiceId: v.id("invoices"),
      moveDate: v.string(),
      paymentType: PaymentMethodConvex,
    }),
    moveCustomerId: v.id("moveCustomers"),
    moveId: v.id("moves"),
  }),
  v.object({
    type: v.literal("INVOICE_SENT"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      deliveryType: CommunicationTypeConvex,
      moveDate: v.string(),
      moverName: v.string(),
      invoiceId: v.id("invoices"),
      salesRepName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  // To do
  v.object({
    type: v.literal("MESSAGE_INCOMING"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      deliveryType: CommunicationTypeConvex,
      messageId: v.id("messages"),
    }),
    moveCustomerId: v.id("moveCustomers"),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("MESSAGE_OUTGOING"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      deliveryType: CommunicationTypeConvex,
      messageId: v.id("messages"),
      moveDate: v.string(),
    }),
    moveCustomerId: v.id("moveCustomers"),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("MOVE_ARRIVAL"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      time: v.number(),
      customerName: v.string(),
      moverName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("MOVE_COMPLETED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moverName: v.string(),
      time: v.number(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("MOVE_CREATED"),
    amount: v.number(),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveDate: v.string(),
      salesRepName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("MOVE_STARTED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moverName: v.string(),
      time: v.number(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("MOVE_STATUS_UPDATED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveDate: v.string(),
      moveStatus: MoveStatusConvex,
    }),
    moveId: v.id("moves"),
    moveCustomerId: v.id("moveCustomers"),
  }),
  v.object({
    type: v.literal("MOVE_UPDATED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveDate: v.string(),
      salesRepName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  // To do
  v.object({
    type: v.literal("NEW_LEAD"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      moveDate: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("REMOVE_MOVER"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveDate: v.string(),
      moverName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  // To do, might not need
  v.object({
    type: v.literal("SALES_REP_MARKED_BOOKED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      moveDate: v.string(),
      salesRepName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("QUOTE_SENT"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      deliveryType: CommunicationTypeConvex,
      moveDate: v.string(),
      salesRepName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("QUOTE_SIGNED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      moveDate: v.string(),
      depositAmount: v.string(),
    }),
    moveId: v.id("moves"),
    moveCustomerId: v.id("moveCustomers"),
  }),
  v.object({
    type: v.literal("WAIVER_SENT"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
      deliveryType: CommunicationTypeConvex,
      salesRepName: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  }),
  v.object({
    type: v.literal("WAIVER_SIGNED"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      customerName: v.string(),
    }),
    moveCustomerId: v.id("moveCustomers"),
    moveId: v.id("moves"),
  }),
  v.object({
    type: v.literal("WORK_BREAK_UPDATE"),
    body: v.string(),
    companyId: v.id("companies"),
    context: v.object({
      breakAmount: v.number(),
      customerName: v.string(),
      moveAssignmentId: v.id("moveAssignments"),
      moverName: v.string(),
      moveDate: v.string(),
    }),
    moveId: v.id("moves"),
    userId: v.id("users"),
  })
);

const newsFeedEntryValidator = v.object({
  entry: newsFeedEntryUnion,
});

export const createNewsFeedEntry = internalMutation({
  args: newsFeedEntryValidator,
  handler: async (ctx, args): Promise<Id<"newsFeeds">> => {
    return await ctx.db.insert("newsFeeds", args.entry);
  },
});
