"use node";
import { ErrorMessages } from "@/types/errors";
import { twilioClient } from "../lib/twilio";
import { throwConvexError } from "../backendUtils/errors";
import { serverEnv } from "../backendUtils/serverEnv";

export const sendTwilioSms = async ({
  fromPhoneNumber,
  toPhoneNumber,
  body,
}: {
  fromPhoneNumber: string;
  toPhoneNumber: string;
  body: string;
}): Promise<string> => {
  try {
    const result = await twilioClient.messages.create({
      from: fromPhoneNumber,
      to: toPhoneNumber,
      body,
    });

    if (!result.sid) {
      throw new Error(ErrorMessages.MISSING_TWILIO_SID);
    }

    return result.sid;
  } catch (error) {
    throwConvexError(error, {
      code: "INTERNAL_ERROR",
    });
  }
};

export const purchaseTwilioNumber = async (companyName: string) => {
  const { HTTP_ACTIONS } = serverEnv();

  const available = await twilioClient
    .availablePhoneNumbers("US")
    .tollFree.list({
      smsEnabled: true,
      limit: 1,
    });

  if (available.length === 0) {
    throw new Error("No Twilio toll-free numbers available");
  }

  const incomingNumber = await twilioClient.incomingPhoneNumbers.create({
    phoneNumber: available[0].phoneNumber,
    friendlyName: `${companyName} SMS Toll-Free Number`,
    smsUrl: `${HTTP_ACTIONS}/twilio/inbound-sms`,
    smsMethod: "POST",
  });

  return {
    phoneNumber: incomingNumber.phoneNumber,
    sid: incomingNumber.sid,
  };
};

export const createTollfreeComplianceInquiry = async ({
  tollfreePhoneNumber,
  notificationEmail,
}: {
  tollfreePhoneNumber: string;
  notificationEmail: string;
}) => {
  return await twilioClient.trusthub.v1.complianceTollfreeInquiries.create({
    tollfreePhoneNumber,
    notificationEmail,
  });
};
