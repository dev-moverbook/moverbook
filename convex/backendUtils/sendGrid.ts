"use node";

import { ErrorMessages } from "@/types/errors";
import { serverEnv } from "./serverEnv";
import sgMail from "@sendgrid/mail";
import { textToEmailHtml } from "@/utils/strings";
import { SendGridError } from "@/types/types";

function getHeaders() {
  const { SENDGRID_API_KEY } = serverEnv();
  return {
    Authorization: `Bearer ${SENDGRID_API_KEY}`,
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
    const res = await fetch(`https://api.sendgrid.com/v3/senders`, {
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
        nickname: `Sender-${fromEmail}`,
      }),
    });

    const body = await res.json();

    if (!res.ok) {
      console.error("SendGrid Sender Creation Error:", body);
      throw new Error(ErrorMessages.SENDGRID_SENDER_CREATION_ERROR);
    }

    return String(body.id);
  } catch (err) {
    console.error("SendGrid sender creation failed:", err);
    throw new Error(ErrorMessages.SENDGRID_SENDER_CREATION_ERROR);
  }
}

export async function checkSenderVerified(senderId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.sendgrid.com/v3/senders/${senderId}`, {
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

export const sendSendGridEmail = async ({
  toEmail,
  ccEmails,
  bccEmails,
  subject,
  bodyText,
  bodyHtml,
  replyToEmail,
  replyToName,
  attachments,
  formatTextToHtml = false,
}: {
  toEmail: string;
  ccEmails?: string[];
  bccEmails?: string[];
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  replyToEmail?: string;
  replyToName?: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition?: "attachment" | "inline";
  }[];
  formatTextToHtml?: boolean;
}): Promise<string> => {
  const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = serverEnv();

  sgMail.setApiKey(SENDGRID_API_KEY);

  let finalHtml: string;

  if (formatTextToHtml) {
    finalHtml = textToEmailHtml(bodyText);
  } else {
    finalHtml = bodyHtml ?? `<p>${bodyText}</p>`;
  }

  const hasCc = Array.isArray(ccEmails) && ccEmails.length > 0;
  const hasBcc = Array.isArray(bccEmails) && bccEmails.length > 0;
  const hasAttachments = Array.isArray(attachments) && attachments.length > 0;

  const msg = {
    to: toEmail,
    from: {
      email: SENDGRID_FROM_EMAIL,
      name: "Moverbook",
    },
    subject,
    text: bodyText,
    html: finalHtml,
    ...(hasAttachments && { attachments }),
    ...(hasCc && { cc: ccEmails }),
    ...(hasBcc && { bcc: bccEmails }),
    ...(replyToEmail && {
      replyTo: {
        email: replyToEmail,
        name: replyToName,
      },
    }),
  };

  try {
    const [response] = await sgMail.send(msg);
    return (
      response.headers["x-message-id"] ?? response.headers["x-msg-id"] ?? ""
    );
  } catch (error: unknown) {
    const err = error as SendGridError;

    console.error("SendGrid email failed:", {
      message: err.message,
      code: err.code,
      errors: err.response?.body?.errors,
    });

    throw new Error(ErrorMessages.SENDGRID_EMAIL_FAILED);
  }
};
