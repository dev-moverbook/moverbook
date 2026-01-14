"use node";

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { sendSendGridEmail } from "../backendUtils/sendGrid";
import { throwConvexError } from "../backendUtils/errors";

export const generatePdf = internalAction({
  args: {
    documentType: v.union(
      v.literal("quote"),
      v.literal("contract"),
      v.literal("waiver"),
      v.literal("invoice")
    ),
    toEmail: v.string(),
    ccEmails: v.optional(v.array(v.string())),
    bccEmails: v.optional(v.array(v.string())),
    subject: v.string(),
    bodyText: v.string(),
    bodyHtml: v.optional(v.string()),
    replyToEmail: v.optional(v.string()),
    replyToName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const {
      documentType,
      toEmail,
      ccEmails,
      bccEmails,
      subject,
      bodyText,
      bodyHtml,
      replyToEmail,
      replyToName,
    } = args;

    const documentTypeMap = {
      quote: "quote.pdf",
      contract: "contract.pdf",
      waiver: "waiver.pdf",
      invoice: "invoice.pdf",
    };

    const html = `<html>
    <body style="font-family: Arial; padding: 40px">
      <h1 style="color: #16a34a">Quote PDF Test</h1>
      <p>This PDF was generated successfully.</p>
    </body>
  </html>`;
    try {
      const response = await fetch("https://moverbook.com/api/pdf", {
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
        replyToEmail: replyToEmail,
        replyToName: replyToName,
        attachments: [
          {
            content: pdfBase64,
            filename: documentTypeMap[documentType],
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
