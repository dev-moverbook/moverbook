import { PresSetScripts } from "./enums";

export const STARTER_PRESET_SCRIPTS: {
  preSetType: PresSetScripts;
  type: "email" | "sms";
  title: string;
  emailTitle?: string;
  message: string;
}[] = [
  {
    preSetType: PresSetScripts.EMAIL_QUOTE,
    type: "email",
    title: "Quote Email",
    emailTitle: "Your Quote",
    message: "Here is your quote.",
  },
  {
    preSetType: PresSetScripts.SMS_QUOTE,
    type: "sms",
    title: "Quote SMS",
    message: "Your quote is ready.",
  },
  {
    preSetType: PresSetScripts.EMAIL_INVOICE,
    type: "email",
    title: "Invoice Email",
    emailTitle: "Invoice",
    message: "Your invoice.",
  },
  {
    preSetType: PresSetScripts.SMS_INVOICE,
    type: "sms",
    title: "Invoice SMS",
    message: "Invoice sent.",
  },
  {
    preSetType: PresSetScripts.EMAIL_CONTRACT,
    type: "email",
    title: "Contract Email",
    emailTitle: "Contract",
    message: "Sign your contract.",
  },
  {
    preSetType: PresSetScripts.SMS_CONTRACT,
    type: "sms",
    title: "Contract SMS",
    message: "Sign contract.",
  },
  {
    preSetType: PresSetScripts.EMAIL_WAIVER,
    type: "email",
    title: "Waiver Email",
    emailTitle: "Waiver",
    message: "Sign waiver.",
  },
  {
    preSetType: PresSetScripts.SMS_WAIVER,
    type: "sms",
    title: "Waiver SMS",
    message: "Sign waiver.",
  },
  {
    preSetType: PresSetScripts.EMAIL_INTERNAL_REVIEW,
    type: "email",
    title: "Internal Review",
    emailTitle: "Review",
    message: "Internal review.",
  },
  {
    preSetType: PresSetScripts.SMS_INTERNAL_REVIEW,
    type: "sms",
    title: "Internal Review SMS",
    message: "Review move.",
  },
  {
    preSetType: PresSetScripts.EMAIL_EXTERNAL_REVIEW,
    type: "email",
    title: "Review Request",
    emailTitle: "Review Us",
    message: "Leave a review.",
  },
  {
    preSetType: PresSetScripts.SMS_EXTERNAL_REVIEW,
    type: "sms",
    title: "Review SMS",
    message: "Leave a review.",
  },
  {
    preSetType: PresSetScripts.EMAIL_FOLLOW_UP,
    type: "email",
    title: "Follow Up",
    emailTitle: "Checking In",
    message: "Still need help?",
  },
  {
    preSetType: PresSetScripts.SMS_FOLLOW_UP,
    type: "sms",
    title: "Follow Up SMS",
    message: "Still need to move?",
  },
] as const;

export const STARTER_REFERRALS: string[] = [
  "Craigslist",
  "Direct mail or business card",
  "Door hanger",
  "Facebook",
  "Google ad",
  "Other",
  "Realtor",
  "Referral",
  "Repeat customer",
  "Saw our truck",
  "Yard sign",
  "Yelp",
  "Web form",
];
