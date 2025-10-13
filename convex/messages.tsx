// "use node";
import { action, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateMove,
  validateMoveCustomer,
} from "./backendUtils/validate";
import { handleInternalError } from "./backendUtils/helper";
import { CreateMessageResponse } from "@/types/convex-responses";
import { RecentMoveMessageSummary } from "@/types/types";
import {
  CommunicationTypeConvex,
  MessageSentTypeConvex,
  MessageStatusConvex,
} from "@/types/convex-enums";
import { Doc, Id } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";
import {
  buildTemplateValues,
  injectTemplateValues,
} from "./backendUtils/template";

export const getMessagesByMoveId = query({
  args: {
    moveId: v.id("move"),
  },
  handler: async (ctx, args): Promise<Doc<"messages">[]> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const move = validateMove(await ctx.db.get(moveId));

    const company = validateCompany(await ctx.db.get(move.companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const rawMessages = ctx.db
      .query("messages")
      .withIndex("by_moveId")
      .filter((q) => q.eq(q.field("moveId"), moveId));

    const messages = await rawMessages.collect();

    messages.sort((a, b) => a._creationTime - b._creationTime);

    return messages;
  },
});

export const getRecentMessagesByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<RecentMoveMessageSummary[]> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const moves = await ctx.db
      .query("move")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .collect();

    const summaries = await Promise.all(
      moves.map(async (move) => {
        const latest = await ctx.db
          .query("messages")
          .withIndex("by_moveId", (q) => q.eq("moveId", move._id))
          .order("desc")
          .take(1);

        const latestMessage = latest[0];
        if (!latestMessage) {
          return null;
        }

        const moveCustomer = await ctx.db.get(move.moveCustomerId);

        return {
          moveId: move._id,
          customerName: moveCustomer?.name ?? "(No name)",
          lastMessage: latestMessage.resolvedMessage || latestMessage.message,
          timestamp: latestMessage._creationTime,
          status: move.moveStatus,
        } satisfies RecentMoveMessageSummary;
      })
    );

    const messages = (
      summaries.filter(Boolean) as RecentMoveMessageSummary[]
    ).sort((a, b) => b.timestamp - a.timestamp);

    return messages;
  },
});

export const createMessage = action({
  args: {
    moveId: v.id("move"),
    method: CommunicationTypeConvex,
    message: v.string(),
    subject: v.optional(v.union(v.string(), v.null())),
    sentType: MessageSentTypeConvex,
  },
  handler: async (ctx, args): Promise<CreateMessageResponse> => {
    const { moveId, method, message, subject, sentType } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const move = validateMove(
        await ctx.runQuery(internal.move.getMoveByIdInternal, { id: moveId })
      );

      const company = validateCompany(
        await ctx.runQuery(internal.companies.getCompanyByIdInternal, {
          companyId: move.companyId,
        })
      );

      const moveCustomer = validateMoveCustomer(
        await ctx.runQuery(internal.moveCustomers.getMoveCustomerByIdInternal, {
          moveCustomerId: move.moveCustomerId,
        })
      );

      isUserInOrg(identity, company.clerkOrganizationId);

      const templateValues = buildTemplateValues(move, moveCustomer.name);

      const resolvedMessage = injectTemplateValues(message, templateValues);
      const resolvedSubject = subject
        ? injectTemplateValues(subject, templateValues)
        : null;

      let deliveryStatus: "sent" | "failed" = "sent";
      let sid: string | undefined;

      //   if (method === "sms") {
      //     if (!move.phoneNumber) {
      //       throw new Error(ErrorMessages.MOVE_PHONE_NUMBER_NOT_FOUND);
      //     }
      //     const result = await sendTwilioSms(move.phoneNumber, resolvedMessage);
      //     if (!result.success) deliveryStatus = "failed";
      //     sid = result.sid;
      //   } else if (method === "email") {
      //     if (!move.email) {
      //       throw new Error(ErrorMessages.MOVE_EMAIL_NOT_FOUND);
      //     }
      //     sid = await sendSendGridEmail(move.email, resolvedMessage, subject);
      //   }

      const messageId = await ctx.runMutation(
        internal.messages.internalCreateMessage,
        {
          moveId,
          companyId: move.companyId,
          method,
          status: deliveryStatus,
          message,
          resolvedMessage,
          sid, // pass to mutation
          sentType,
          resolvedSubject,
          subject,
        }
      );

      return {
        status: ResponseStatus.SUCCESS,
        data: { messageId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const internalCreateMessage = internalMutation({
  args: {
    moveId: v.id("move"),
    companyId: v.id("companies"),
    method: CommunicationTypeConvex,
    status: MessageStatusConvex,
    message: v.string(),
    resolvedMessage: v.string(),
    sid: v.optional(v.string()),
    sentType: MessageSentTypeConvex,
    resolvedSubject: v.optional(v.union(v.string(), v.null())),
    subject: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args): Promise<Id<"messages">> => {
    const {
      moveId,
      companyId,
      method,
      status,
      message,
      resolvedMessage,
      sid,
      sentType,
      resolvedSubject,
      subject,
    } = args;

    const messageId = await ctx.db.insert("messages", {
      moveId,
      companyId,
      method,
      status,
      message,
      resolvedMessage,
      sid,
      sentType,
      resolvedSubject,
      subject,
    });

    return messageId;
  },
});
