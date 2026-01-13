"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { sendSendGridEmail } from "../backendUtils/sendGrid";
import { throwConvexError } from "../backendUtils/errors";

export const generateQuotePdf = action({
  args: {
    toEmail: v.string(),
    ccEmails: v.optional(v.array(v.string())),
    bccEmails: v.optional(v.array(v.string())),
    subject: v.string(),
    bodyText: v.string(),
    bodyHtml: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { toEmail, ccEmails, bccEmails, subject, bodyText, bodyHtml } = args;

    const html = `<html>
    <body style="font-family: Arial; padding: 40px">
      <h1 style="color: #16a34a">Quote PDF Test</h1>
      <p>This PDF was generated successfully.</p>
    </body>
  </html>`;
    try {
      const response = await fetch("https://moverbook.com/api/test-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });
      if (!response.ok) {
        throw new Error(`PDF route failed: ${response.status}`);
      }

      const pdfArrayBuffer = await response.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString("base64");

      await sendSendGridEmail({
        toEmail: toEmail,
        ccEmails: ccEmails,
        bccEmails: bccEmails,
        subject: subject,
        bodyText: bodyText,
        bodyHtml: bodyHtml,
        attachments: [
          {
            content: pdfBase64,
            filename: "quote.pdf",
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      });

      return true;
    } catch (error) {
      throwConvexError(error, {
        code: "BAD_REQUEST",
        showToUser: true,
      });
    }
  },
});
