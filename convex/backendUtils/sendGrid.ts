"use node";

import { ErrorMessages } from "@/types/errors";

const SENDGRID_API_BASE = "https://api.sendgrid.com";

function getHeaders() {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error(ErrorMessages.ENV_NOT_SET_SENDGRID_KEY);
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

type CreateSingleSenderParams = {
  fromEmail: string;
  fromName: string;
  address: {
    line1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
};

export async function createSingleSender({
  fromEmail,
  fromName,
  address,
}: CreateSingleSenderParams): Promise<string> {
  try {
    const res = await fetch(`${SENDGRID_API_BASE}/v3/senders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        address: address.line1,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
        from: {
          email: fromEmail,
          name: fromName,
        },
        reply_to: {
          email: fromEmail,
          name: fromName,
        },
        nickname: "Primary Sender",
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      console.error("SendGrid Sender Creation Error:", body);
      throw new Error(ErrorMessages.SENDGRID_SENDER_CREATION_ERROR);
    }

    return body.id;
  } catch (err) {
    console.error("SendGrid sender creation failed:", err);
    throw new Error(ErrorMessages.SENDGRID_SENDER_CREATION_ERROR);
  }
}

export async function checkSenderVerified(senderId: string): Promise<boolean> {
  try {
    const res = await fetch(`${SENDGRID_API_BASE}/senders/${senderId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const body = await res.json();

    if (!res.ok) {
      console.error("SendGrid Verification Check Error:", body);
      throw new Error(ErrorMessages.SENDGRID_SENDER_VERIFICATION_ERROR);
    }

    return body.verified === true;
  } catch (err) {
    console.error(
      `Failed to check verification for sender ID ${senderId}:`,
      err
    );
    throw new Error(ErrorMessages.SENDGRID_SENDER_VERIFICATION_ERROR);
  }
}
