"use node";
import { serverEnv } from "../backendUtils/serverEnv";
import twilio from "twilio";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = serverEnv();

export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
