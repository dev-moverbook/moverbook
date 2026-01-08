import { GenericActionCtx } from "convex/server";
import { internal } from "../_generated/api";
import { TollfreeVerificationCloudEvent } from "@/types/types";
import {
  mapTwilioStatusToAppStatus,
  urlSearchParamsToObject,
} from "../backendUtils/twilioHelpers";
import { DataModel } from "../_generated/dataModel";

export const processTollfreeVerificationEvent = async (
  ctx: GenericActionCtx<DataModel>,
  event: TollfreeVerificationCloudEvent
): Promise<void> => {
  const data = event.data;
  const phoneSid = data.phoneNumberSid;
  const newStatus = data.verificationstatus.toLowerCase();

  if (!phoneSid) {
    return;
  }

  const phoneRecord = await ctx.runQuery(
    internal.twilioPhoneNumbers.getTwilioPhoneNumberBySid,
    {
      sid: phoneSid,
    }
  );

  if (!phoneRecord) {
    return;
  }

  const appStatus = mapTwilioStatusToAppStatus(newStatus);

  if (!appStatus) {
    return;
  }
  const now = Date.now();
  const patch: Partial<{
    tollfreeVerificationStatus: typeof appStatus;
    tollfreeVerifiedAt: number;
    tollfreeVerificationSid: string;
    tollfreeRejectionReasons: string;
    tollfreeLastChecked: number;
  }> = {
    tollfreeVerificationStatus: appStatus,
    tollfreeLastChecked: now,
  };

  if (appStatus === "Approved") {
    patch.tollfreeVerifiedAt = now;
  }

  if (data.verificationSid) {
    patch.tollfreeVerificationSid = data.verificationSid;
  }

  if (newStatus === "twilio_rejected" && data.rejectionReasons) {
    patch.tollfreeRejectionReasons = Array.isArray(data.rejectionReasons)
      ? JSON.stringify(data.rejectionReasons)
      : data.rejectionReasons;
  }

  await ctx.runMutation(
    internal.twilioPhoneNumbers.updateTwilioPhoneNumberInternal,
    {
      id: phoneRecord._id,
      updates: patch,
    }
  );
};

export const handleInboundTwilioSms = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: GenericActionCtx<any>,
  request: Request
): Promise<Response> => {
  const url = new URL(request.url);
  const twilioSignature = request.headers.get("X-Twilio-Signature") ?? "";
  const bodyString = await request.text();

  const messageData = new URLSearchParams(bodyString);
  const bodyObject = urlSearchParamsToObject(messageData);

  const fromPhoneE164 = messageData.get("From");
  const toPhoneE164 = messageData.get("To");
  const messageBody = messageData.get("Body");
  const twilioMessageSid = messageData.get("MessageSid");

  if (!fromPhoneE164 || !toPhoneE164 || !messageBody || !twilioMessageSid) {
    console.error("Missing required fields from Twilio webhook.");
    return new Response("Bad Request", { status: 400 });
  }

  try {
    await ctx.runAction(internal.actions.twilio.validateAndProcessInboundSms, {
      url: url.toString(),
      twilioSignature,
      bodyObject,
      messageData: {
        fromPhoneE164,
        toPhoneE164,
        messageBody,
        twilioMessageSid,
      },
    });
  } catch (error) {
    console.error("Twilio processing error:", error);
    return new Response("Unauthorized/Error", { status: 403 });
  }

  return new Response("<Response/>", {
    headers: { "Content-Type": "text/xml" },
  });
};
