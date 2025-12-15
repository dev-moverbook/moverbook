import { QueryCtx } from "@/convex/_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { EnrichedNewsFeed } from "@/types/types";
import { PresSetScripts } from "@/types/enums";

export async function getUserImageMap(
  ctx: QueryCtx,
  userIds: Id<"users">[]
): Promise<Map<string, string | null>> {
  const users = await ctx.db.query("users").collect();
  const map = new Map<string, string | null>();
  for (const user of users) {
    if (userIds.includes(user._id)) {
      map.set(user._id, user.imageUrl ?? null);
    }
  }
  return map;
}

export function mergeNewsFeedAndImages(
  newsFeedItems: Doc<"newsFeeds">[],
  userImageMap: Map<string, string | null>
): EnrichedNewsFeed[] {
  return newsFeedItems.map((item) => ({
    newsFeedItem: item,
    userImageUrl: item.userId ? (userImageMap.get(item.userId) ?? null) : null,
  }));
}

interface Options {
  moveId: Id<"moves">;
  companyId: Id<"companies">;
  userId: Id<"users">;
  customerName: string;
  moveDate?: string;
  salesRepName?: string;
  deliveryType: "email" | "sms";
}

export function createPresetNewsFeedEntry(
  preset: (typeof PresSetScripts)[keyof typeof PresSetScripts],
  opts: Options
) {
  const {
    moveId,
    companyId,
    userId,
    customerName,
    moveDate = "TBD",
    salesRepName = "Team",
    deliveryType,
  } = opts;

  switch (preset) {
    case PresSetScripts.EMAIL_QUOTE:
    case PresSetScripts.SMS_QUOTE:
      return {
        type: "QUOTE_SENT" as const,
        body: `${salesRepName} sent a quote via ${deliveryType}`,
        companyId,
        moveId,
        userId,
      };

    case PresSetScripts.EMAIL_INVOICE:
    case PresSetScripts.SMS_INVOICE:
      return {
        type: "INVOICE_SENT" as const,
        body: `${salesRepName} sent an invoice via ${deliveryType}`,
        companyId,
        moveId,
        userId,
      };

    case PresSetScripts.EMAIL_CONTRACT:
    case PresSetScripts.SMS_CONTRACT:
      return {
        type: "CONTRACT_SENT" as const,
        body: `${salesRepName} sent contract via ${deliveryType}`,
        companyId,
        moveId,
        userId,
      };

    case PresSetScripts.EMAIL_WAIVER:
    case PresSetScripts.SMS_WAIVER:
      return {
        type: "WAIVER_SENT" as const,
        body: `${salesRepName} sent waiver via ${deliveryType}`,
        companyId,
        moveId,
        userId,
      };

    case PresSetScripts.EMAIL_EXTERNAL_REVIEW:
    case PresSetScripts.SMS_EXTERNAL_REVIEW:
      return {
        type: "EXTERNAL_REVIEW_SENT" as const,
        body: `${salesRepName} sent external review to **${customerName}** **${moveDate}** via ${deliveryType}`,
        companyId,
        moveId,
        userId,
      };

    case PresSetScripts.EMAIL_FOLLOW_UP:
    case PresSetScripts.SMS_FOLLOW_UP:
      return {
        type: "FOLLOW_UP" as const,
        body: `${salesRepName} sent a follow-up ${deliveryType}`,
        companyId,
        moveId,
        userId,
      };

    case PresSetScripts.EMAIL_INTERNAL_REVIEW:
    case PresSetScripts.SMS_INTERNAL_REVIEW:
      return {
        type: "INTERNAL_REVIEW_SENT" as const,
        body: `${salesRepName} sent internal review via ${deliveryType}`,
        companyId,
        moveId,
        userId,
      };

    default:
      throw new Error(`No news feed entry for preset: ${preset}`);
  }
}
