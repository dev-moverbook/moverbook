"use node";
import twilio from "twilio";
import { ErrorMessages } from "@/types/errors";
import { serverEnv } from "./serverEnv";

export const sendTwilioSms = async (
  phoneNumber: string,
  to: string,
  body: string
): Promise<{ success: boolean; sid?: string }> => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = serverEnv();

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    const result = await client.messages.create({
      from: phoneNumber,
      to,
      body,
    });

    if (!result.sid) {
      throw new Error(ErrorMessages.MISSING_TWILIO_SID);
    }

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error("Twilio SMS failed:", error);
    throw new Error(ErrorMessages.TWILIO_SMS_FAILED);
  }
};
