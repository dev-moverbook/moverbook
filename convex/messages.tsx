import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ClerkRoles } from "@/types/enums";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateDocument,
} from "./backendUtils/validate";
import { RecentMoveMessageSummary } from "@/types/types";
import {
  CommunicationTypeConvex,
  MessageSentTypeConvex,
  MessageStatusConvex,
} from "@/types/convex-enums";
import { Doc, Id } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";

export const getMessagesByMoveId = query({
  args: {
    moveId: v.id("moves"),
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

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

    const company = await validateCompany(ctx.db, move.companyId);
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

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const moves = await ctx.db
      .query("moves")
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

export const internalCreateMessage = internalMutation({
  args: {
    moveId: v.id("moves"),
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

export const internalCreateInboundMessage = internalMutation({
  args: {
    moveId: v.id("moves"),
    companyId: v.id("companies"),
    method: CommunicationTypeConvex,
    status: MessageStatusConvex,
    message: v.string(),
    sid: v.string(),
    sentType: MessageSentTypeConvex,
  },
  handler: async (ctx, args): Promise<Id<"messages">> => {
    const { moveId, companyId, method, status, message, sid, sentType } = args;

    const messageId = await ctx.db.insert("messages", {
      moveId,
      companyId,
      method,
      status,
      message,
      sid,
      sentType,
      resolvedMessage: message,
    });
    return messageId;
  },
});
