"use node";
import twilio from "twilio";
import { ErrorMessages } from "@/types/errors";

export const sendTwilioSms = async (
  to: string,
  body: string
): Promise<{ success: boolean; sid?: string }> => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
    process.env;

  // Collect missing env vars
  const missingVars: string[] = [];
  if (!TWILIO_ACCOUNT_SID) missingVars.push("TWILIO_ACCOUNT_SID");
  if (!TWILIO_AUTH_TOKEN) missingVars.push("TWILIO_AUTH_TOKEN");
  if (!TWILIO_PHONE_NUMBER) missingVars.push("TWILIO_PHONE_NUMBER");

  if (missingVars.length > 0) {
    console.error(
      "Missing Twilio environment variables:",
      missingVars.join(", ")
    );
    throw new Error(
      `Missing Twilio environment variables: ${missingVars.join(", ")}`
    );
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    const result = await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
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
