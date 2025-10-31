import openmojiSmile from "openmoji/color/svg/1F600.svg";
import openmojiBustSilhouette from "openmoji/color/svg/1F464.svg";
import openmojiPlus from "openmoji/color/svg/2795.svg";
import openmojiPencil from "openmoji/color/svg/270F.svg";
import openmojiPackage from "openmoji/color/svg/1F4E6.svg";
import openmojiClock from "openmoji/color/svg/23F3.svg";
import openmojiLorry from "openmoji/color/svg/1F69B.svg";
import openmojiGear from "openmoji/color/svg/2699.svg";
import openmojiCheck from "openmoji/color/svg/2705.svg";
import openmojiBankNote from "openmoji/color/svg/1F4B5.svg";
import openmojiEnvelope from "openmoji/color/svg/2709.svg";
import openmojiPage from "openmoji/color/svg/1F4C4.svg";
import openmojiNib from "openmoji/color/svg/2712.svg";
import openmojiCalendar from "openmoji/color/svg/1F4C5.svg";
import openmojiManConstruction from "openmoji/color/svg/1F477.svg";
import openmojiCrossMark from "openmoji/color/svg/274C.svg";
import openmojiCart from "openmoji/color/svg/1F6D2.svg";
import openmojiStar from "openmoji/color/svg/2B50.svg";
import openmojiFire from "openmoji/color/svg/1F525.svg";
import openmojiMoneyWings from "openmoji/color/svg/1F4B8.svg";
import openmojiExchange from "openmoji/color/svg/1F501.svg";
import openmojiSpeechBubble from "openmoji/color/svg/1F5E8.svg";
import openmojiGreenCircle from "openmoji/color/svg/1F7E2.svg";
import openmojiRedCircle from "openmoji/color/svg/1F534.svg";
import openmojiClipboard from "openmoji/color/svg/1F4CB.svg";
import openmojiBriefcase from "openmoji/color/svg/1F4BC.svg";
import openmojiSkull from "openmoji/color/svg/1F480.svg";
import openmojiCoffee from "openmoji/color/svg/2615.svg";
import openmojiTruck from "openmoji/color/svg/1F69A.svg";
import { EnrichedNewsFeed, MoveStatus } from "@/types/types";

export function getEventEmojis(
  eventType: string,
  moveStatus?: MoveStatus
): string[] {
  switch (eventType) {
    case "ASSIGN_MOVER":
      return [openmojiCheck, openmojiManConstruction];
    case "CLOCK_IN":
      return [openmojiGreenCircle, openmojiManConstruction];
    case "CLOCK_OUT":
      return [openmojiRedCircle, openmojiManConstruction];
    case "CONTRACT_SENT":
      return [openmojiEnvelope, openmojiPage];
    case "CUSTOMER_CREATED":
      return [openmojiPlus, openmojiBustSilhouette];
    case "CUSTOMER_CREATED_BY_REP":
      return [openmojiPlus, openmojiBustSilhouette];
    case "CUSTOMER_SIGNED_CONTRACT_DOC":
      return [openmojiNib, openmojiPage];
    case "CUSTOMER_UPDATED":
      return [openmojiPencil, openmojiBustSilhouette];
    case "CUSTOMER_UPDATED_BY_REP":
      return [openmojiPencil, openmojiBustSilhouette];
    case "DISCOUNT_ADDED":
      return [openmojiPlus, openmojiMoneyWings];
    case "DISCOUNT_REMOVED":
      return [openmojiCrossMark, openmojiMoneyWings];
    case "DISCOUNT_UPDATED":
      return [openmojiExchange, openmojiMoneyWings];
    case "EXTERNAL_REVIEW_SENT":
      return [openmojiEnvelope, openmojiStar];
    case "FEE_ADDED":
      return [openmojiPlus, openmojiBankNote];
    case "FEE_REMOVED":
      return [openmojiCrossMark, openmojiBankNote];
    case "FEE_UPDATED":
      return [openmojiPencil, openmojiBankNote];
    case "FOLLOW_UP":
      return [openmojiEnvelope];
    case "HOURS_STATUS_UPDATED":
      return [openmojiPencil, openmojiClock];
    case "INTERNAL_REVIEW_COMPLETED":
      return [openmojiCheck, openmojiStar];
    case "INTERNAL_REVIEW_SENT":
      return [openmojiEnvelope, openmojiStar];
    case "INVOICE_MARKED_COMPLETE":
      return [openmojiCheck, openmojiCart];
    case "INVOICE_PAYMENT":
      return [openmojiCheck, openmojiBankNote];
    case "INVOICE_SENT":
      return [openmojiEnvelope, openmojiCart];
    case "MESSAGE_INCOMING":
      return [openmojiSpeechBubble, openmojiRedCircle];
    case "MESSAGE_OUTGOING":
      return [openmojiSpeechBubble, openmojiGreenCircle];
    case "MOVE_ARRIVAL":
      return [openmojiLorry];
    case "MOVE_BREAK_UPDATED":
      return [openmojiCoffee, openmojiTruck];
    case "MOVE_COMPLETED":
      return [openmojiCheck, openmojiLorry];
    case "MOVE_CREATED":
      return [openmojiPlus, openmojiPackage];
    case "MOVE_STARTED":
      return [openmojiGear, openmojiLorry];
    case "MOVE_STATUS_UPDATED":
      switch (moveStatus) {
        case "New Lead":
          return [openmojiFire];
        case "Quoted":
          return [openmojiBriefcase];
        case "Lost":
          return [openmojiSkull];
        case "Cancelled":
          return [openmojiCrossMark];
        case "Booked":
          return [openmojiCalendar];
        case "Completed":
          return [openmojiCheck, openmojiLorry];
        default:
          return [openmojiFire];
      }
    case "MOVE_UPDATED":
      return [openmojiPencil, openmojiPackage];
    case "NEW_LEAD":
      return [openmojiFire];
    case "QUOTE_SENT":
      return [openmojiEnvelope, openmojiPage];
    case "QUOTE_SIGNED":
      return [openmojiNib, openmojiPage];
    case "REMOVE_MOVER":
      return [openmojiCrossMark, openmojiManConstruction];
    case "SALES_REP_MARKED_BOOKED":
      return [openmojiCalendar];
    case "WAIVER_SENT":
      return [openmojiEnvelope, openmojiClipboard];
    case "WAIVER_SIGNED":
      return [openmojiNib, openmojiClipboard];
    case "WORK_BREAK_UPDATE":
      return [openmojiCoffee];
    default:
      return [openmojiSmile];
  }
}

export function getNewsFeedEventHref(
  slug: string,
  event: EnrichedNewsFeed
): string | undefined {
  const { newsFeedItem } = event;
  const eventType = newsFeedItem.type;
  const moveId = newsFeedItem.moveId;
  const moveCustomerId = newsFeedItem.moveCustomerId;

  switch (eventType) {
    case "CUSTOMER_CREATED_BY_REP":
    case "CUSTOMER_UPDATED_BY_REP":
    case "CUSTOMER_CREATED":
    case "CUSTOMER_UPDATED":
      if (moveCustomerId) {
        return `/app/${slug}/customer/${moveCustomerId}`;
      }
      break;
    case "MESSAGE_OUTGOING":
    case "MESSAGE_INCOMING":
      if (moveId) {
        return `/app/${slug}/moves/${moveId}/messages`;
      }
      break;

    default:
      if (moveId) {
        return `/app/${slug}/moves/${moveId}`;
      }
      break;
  }

  return undefined;
}
