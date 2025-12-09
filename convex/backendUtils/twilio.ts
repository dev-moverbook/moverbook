"use node";
import { ErrorMessages } from "@/types/errors";
import { twilioClient } from "../lib/twilio";
import { throwConvexError } from "./errors";

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
