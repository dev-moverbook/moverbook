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
import openmojiDizzySkull from "openmoji/color/svg/1F480.svg";
import openmojiCart from "openmoji/color/svg/1F6D2.svg";
import openmojiStar from "openmoji/color/svg/2B50.svg";
import openmojiFire from "openmoji/color/svg/1F525.svg";
import openmojiSuitcase from "openmoji/color/svg/1F4BC.svg";
import openmojiMoneyWings from "openmoji/color/svg/1F4B8.svg";
import openmojiExchange from "openmoji/color/svg/1F501.svg";
import openmojiSpeechBubble from "openmoji/color/svg/1F5E8.svg";
import openmojiGreenCircle from "openmoji/color/svg/1F7E2.svg";
import openmojiRedCircle from "openmoji/color/svg/1F534.svg";
import openmojiClipboard from "openmoji/color/svg/1F4CB.svg";
import openmojiPhone from "openmoji/color/svg/260E.svg";

export function getEventEmojis(eventType: string): string[] {
  switch (eventType) {
    case "CUSTOMER_CREATED":
      return [openmojiPlus, openmojiBustSilhouette];
    case "CUSTOMER_UPDATED":
      return [openmojiPencil, openmojiBustSilhouette];
    case "MOVE_CREATED":
      return [openmojiPlus, openmojiPackage];
    case "MOVE_UPDATED":
      return [openmojiPencil, openmojiPackage];
    case "HOURS_UPDATED":
      return [openmojiPencil, openmojiClock];
    case "MOVE_STARTED":
      return [openmojiGear, openmojiLorry];
    case "MOVE_COMPLETED":
      return [openmojiCheck, openmojiLorry];
    case "FEE_ADDED":
      return [openmojiPlus, openmojiBankNote];
    case "FEE_UPDATED":
      return [openmojiPencil, openmojiBankNote];
    case "FEE_REMOVED":
      return [openmojiCrossMark, openmojiBankNote];
    case "DISCOUNT_ADDED":
      return [openmojiPlus, openmojiMoneyWings];
    case "DISCOUNT_REMOVED":
      return [openmojiCrossMark, openmojiMoneyWings];
    case "DISCOUNT_UPDATED":
      return [openmojiExchange, openmojiMoneyWings];
    case "INVOICE_SENT":
      return [openmojiEnvelope, openmojiCart];
    case "INVOICE_PAYMENT":
      return [openmojiCheck, openmojiBankNote];
    case "INVOICE_MARKED_COMPLETE":
      return [openmojiCheck, openmojiCart];
    case "INTERNAL_REVIEW_SENT":
      return [openmojiEnvelope, openmojiStar];
    case "INTERNAL_REVIEW_COMPLETED":
      return [openmojiCheck, openmojiStar];
    case "SALES_REP_SEND_PROPOSAL":
      return [openmojiEnvelope, openmojiPage];
    case "CUSTOMER_SIGNED_PROPOSAL":
      return [openmojiNib, openmojiPage];
    case "SALES_REP_MARKED_BOOKED":
      return [openmojiCalendar];
    case "ASSIGN_MOVER":
      return [openmojiCheck, openmojiManConstruction];
    case "REMOVE_MOVER":
      return [openmojiCrossMark, openmojiManConstruction];
    case "CONTRACT_SENT":
      return [openmojiEnvelope, openmojiPage];
    case "CUSTOMER_SIGNED_CONTRACT_DOC":
      return [openmojiNib, openmojiPage];
    case "WAIVER_SENT":
      return [openmojiEnvelope, openmojiClipboard];
    case "WAIVER_SIGNED":
      return [openmojiNib, openmojiClipboard];
    case "CLOCK_IN":
      return [openmojiGreenCircle, openmojiManConstruction];
    case "CLOCK_OUT":
      return [openmojiRedCircle, openmojiManConstruction];
    case "WORK_BREAK_UPDATE":
      return [openmojiSmile]; // placeholder: no beverage in OpenMoji set
    case "MOVE_STATUS_UPDATED":
      return [openmojiFire]; // example: use openmojiFire, add logic if you want more
    case "MOVE_ARRIVAL":
      return [openmojiLorry];
    case "FOLLOW_UP":
      return [openmojiEnvelope];
    case "MESSAGE_OUTGOING":
      return [openmojiSpeechBubble, openmojiGreenCircle];
    case "MESSAGE_INCOMING":
      return [openmojiSpeechBubble, openmojiRedCircle];
    case "NEW_LEAD":
      return [openmojiFire];
    default:
      return [openmojiSmile];
  }
}
