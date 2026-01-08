import {
  TollfreeVerificationEvent,
  TollfreeVerificationStatus,
  TwilioWebhookEventBase,
} from "@/types/types";

export const mapTwilioStatusToAppStatus = (
  twilioStatus: string | undefined
): TollfreeVerificationStatus | undefined => {
  const lower = twilioStatus?.toLowerCase();

  switch (lower) {
    case "twilio_approved":
      return "Approved";
    case "twilio_rejected":
      return "Rejected";
    case "pending_review":
      return "Pending Review";
    case "in_review":
      return "In Review";
    case "submitted":
      return "Pending Review";
    case "expired":
      return "Expired";
    default:
      return undefined;
  }
};

export const isTollfreeVerificationEvent = (
  event: TwilioWebhookEventBase
): event is TollfreeVerificationEvent => {
  return (
    typeof event.type === "string" &&
    event.type.startsWith(
      "com.twilio.messaging.compliance.toll-free-verification."
    )
  );
};

export const urlSearchParamsToObject = (
  params: URLSearchParams
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: Record<string, any> = {};
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  return obj;
};
