"use node";

import {
  CommunicationTypeConvex,
  MessageSentTypeConvex,
  PresSetScriptsConvex,
} from "@/types/convex-enums";
import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { action } from "../_generated/server";
import { requireAuthenticatedUser } from "../backendUtils/auth";
import { throwConvexError } from "../backendUtils/errors";
// import { sendSendGridEmail } from "../backendUtils/sendGrid";
// import { sendTwilioSms } from "../backendUtils/twilio";
import {
  validateMove,
  validateUser,
  validateDocExists,
  isUserInCompanyConvex,
  isUserInOrg,
  isIdentityInMove,
} from "../backendUtils/validate";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { createPresetNewsFeedEntry } from "../backendUtils/newsFeedHelper";
import {
  extractTemplateKeys,
  injectTemplateValues,
  resolveTemplateSideEffects,
} from "../backendUtils/template";
import { sendTwilioSms } from "../functions/twilio";
import { sendSendGridEmail } from "../backendUtils/sendGrid";

export const sendPresetScript = action({
  args: {
    moveId: v.id("moves"),
    preSetTypes: PresSetScriptsConvex,
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId, preSetTypes } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const move = validateMove(
      await ctx.runQuery(internal.moves.getMoveByIdInternal, { moveId })
    );

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: move.moveCustomerId,
      }
    );

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: identity.convexId as Id<"users">,
      })
    );

    const company = validateDocExists(
      "companies",
      await ctx.runQuery(internal.companies.getCompanyByIdInternal, {
        companyId: move.companyId,
      }),
      ErrorMessages.COMPANY_NOT_FOUND
    );

    isUserInCompanyConvex(user, company._id);

    const script = await ctx.runQuery(
      internal.scripts.getPresetScriptByPreSetType,
      {
        companyId: company._id,
        preSetType: preSetTypes,
      }
    );

    if (!script) {
      throwConvexError(ErrorMessages.SCRIPT_NOT_FOUND, {
        code: "NOT_FOUND",
        showToUser: true,
      });
    }

    const scriptType = script.type;
    let sid: string | undefined = undefined;
    const message = script.message;

    const messageKeys = extractTemplateKeys(message);
    const subjectKeys = script.emailTitle
      ? extractTemplateKeys(script.emailTitle)
      : new Set<string>();
    const allKeys = new Set([...messageKeys, ...subjectKeys]);
    const resolvedValues = await resolveTemplateSideEffects({
      ctx,
      keys: allKeys,
      move,
      slug: company.slug,
      moveCustomer,
      company,
    });

    const resolvedMessage = injectTemplateValues(message, resolvedValues);
    const resolvedSubject = script.emailTitle
      ? injectTemplateValues(script.emailTitle, resolvedValues)
      : null;

    if (scriptType === "email") {
      const companyContact = await ctx.runQuery(
        internal.companyContacts.getCompanyContactByCompanyIdInternal,
        {
          companyId: company._id,
        }
      );
      if (!companyContact) {
        throwConvexError(ErrorMessages.COMPANY_CONTACT_NOT_FOUND, {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }
      sid = await sendSendGridEmail({
        toEmail: moveCustomer.email,
        bodyText: resolvedMessage,
        bodyHtml: resolvedMessage,
        subject: resolvedSubject ?? "",
        replyToEmail: companyContact.email,
        replyToName: company.name,
        formatTextToHtml: true,
      });
    } else if (scriptType === "sms") {
      sid = "test sms";
      // const twilioNumber = await ctx.runQuery(
      //   internal.twilioNumbers.getTwilioNumberByCompanyIdInternal,
      //   {
      //     companyId: company._id,
      //   }
      // );
      // if (!twilioNumber) {
      //   throwConvexError(ErrorMessages.COMPANY_CONTACT_NOT_FOUND, {
      //     code: "NOT_FOUND",
      //     showToUser: true,
      //   });
      // }
      // if (!validatedMoveCustomer.phoneNumber) {
      //   throwConvexError("Customer phone number not found", {
      //     code: "NOT_FOUND",
      //     showToUser: true,
      //   });
      // }
      // sid = await sendTwilioSms({
      //   fromPhoneNumber: twilioNumber.phoneNumber,
      //   toPhoneNumber: validatedMoveCustomer.phoneNumber,
      //   body: script.message ?? "",
      // });
    }

    await ctx.runMutation(internal.messages.internalCreateMessage, {
      moveId,
      companyId: company._id,
      method: scriptType,
      status: "sent",
      message: script.message,
      resolvedMessage: script.message,
      sid,
      sentType: "outgoing",
      resolvedSubject: script.emailTitle,
      subject: script.emailTitle,
    });

    const moveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";
    const entry = createPresetNewsFeedEntry(preSetTypes, {
      moveId,
      companyId: company._id,
      userId: user._id,
      customerName: moveCustomer.name,
      moveDate,
      salesRepName: user.name,
      deliveryType: scriptType,
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, { entry });
    return true;
  },
});

export const createMessage = action({
  args: {
    moveId: v.id("moves"),
    method: CommunicationTypeConvex,
    message: v.string(),
    subject: v.optional(v.union(v.string(), v.null())),
    sentType: MessageSentTypeConvex,
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId, method, message, subject, sentType } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const move = validateMove(
      await ctx.runQuery(internal.moves.getMoveByIdInternal, { moveId })
    );

    const company = await ctx.runQuery(
      internal.companies.getCompanyByIdInternal,
      {
        companyId: move.companyId,
      }
    );

    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );

    const companyContact = await ctx.runQuery(
      internal.companyContacts.getCompanyContactByCompanyIdInternal,
      {
        companyId: move.companyId,
      }
    );

    if (!companyContact) {
      throwConvexError(ErrorMessages.COMPANY_CONTACT_NOT_FOUND, {
        code: "NOT_FOUND",
        showToUser: true,
      });
    }

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: move.moveCustomerId,
      }
    );

    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const messageKeys = extractTemplateKeys(message);
    const subjectKeys = subject
      ? extractTemplateKeys(subject)
      : new Set<string>();

    const allKeys = new Set([...messageKeys, ...subjectKeys]);

    const resolvedValues = await resolveTemplateSideEffects({
      ctx,
      keys: allKeys,
      move,
      slug: validatedCompany.slug,
      moveCustomer,
      company: validatedCompany,
    });

    const resolvedMessage = injectTemplateValues(message, resolvedValues);
    const resolvedSubject = subject
      ? injectTemplateValues(subject, resolvedValues)
      : null;

    const deliveryStatus: "sent" | "failed" = "sent";
    let sid: string | undefined;

    if (method === "sms") {
      const twilioNumber = await ctx.runQuery(
        internal.twilioPhoneNumbers.getTwilioPhoneNumber,
        { companyId: move.companyId }
      );

      if (!twilioNumber) {
        throwConvexError("Twilio phone number not found", {
          code: "BAD_REQUEST",
          showToUser: true,
        });
      }
      const result = await sendTwilioSms({
        fromPhoneNumber: twilioNumber.phoneNumberE164,
        toPhoneNumber: moveCustomer.phoneNumber,
        body: resolvedMessage,
      });
      sid = result;
    } else if (method === "email") {
      sid = await sendSendGridEmail({
        toEmail: moveCustomer.email,
        bodyText: resolvedMessage,
        bodyHtml: resolvedMessage,
        subject: resolvedSubject ?? "",
        replyToEmail: companyContact.email,
        replyToName: validatedCompany.name,
      });
    }

    const moveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: identity.convexId as Id<"users">,
      })
    );

    await ctx.runMutation(internal.messages.internalCreateMessage, {
      moveId,
      companyId: move.companyId,
      method,
      status: deliveryStatus,
      message,
      resolvedMessage,
      sid,
      sentType,
      resolvedSubject,
      subject,
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "MESSAGE_OUTGOING",
        body: `**${user.name}** sent message to **${moveCustomer.name}** **${moveDate}** via ${method}`,
        companyId: move.companyId,
        userId: user._id,
        moveId,
        moveCustomerId: move.moveCustomerId,
      },
    });

    return true;
  },
});

export const markMoveAsBooked = action({
  args: {
    moveId: v.id("moves"),
    customerSignature: v.optional(v.string()),
    salesRepSignature: v.optional(v.string()),
    updateQuote: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId, customerSignature, salesRepSignature, updateQuote } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.CUSTOMER,
    ]);

    const move = validateMove(
      await ctx.runQuery(internal.moves.getMoveByIdInternal, { moveId })
    );

    isIdentityInMove(identity, move);

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: move.moveCustomerId,
      }
    );

    const companyContact = await ctx.runQuery(
      internal.companyContacts.getCompanyContactByCompanyIdInternal,
      {
        companyId: move.companyId,
      }
    );

    if (!companyContact) {
      throwConvexError(ErrorMessages.COMPANY_CONTACT_NOT_FOUND, {
        code: "NOT_FOUND",
        showToUser: true,
      });
    }

    const now = Date.now();
    let customerSignatureDate: number | undefined;
    let salesRepSignatureDate: number | undefined;

    if (customerSignature) {
      customerSignatureDate = now;
    }
    if (salesRepSignature) {
      salesRepSignatureDate = now;
    }

    if (updateQuote) {
      const quote = await ctx.runQuery(internal.quotes.getQuoteByMoveId, {
        moveId,
      });
      if (quote) {
        await ctx.runMutation(internal.quotes.updateQuote, {
          quoteId: quote._id,
          updates: {
            customerSignature: customerSignature,
            customerSignedAt: customerSignatureDate,
            repSignature: salesRepSignature,
            repSignedAt: salesRepSignatureDate,
          },
        });
      } else {
        await ctx.runMutation(internal.quotes.createQuote, {
          moveId,
          customerSignature: customerSignature,
          customerSignedAt: customerSignatureDate,
          repSignature: salesRepSignature,
          repSignedAt: salesRepSignatureDate,
          status: "completed",
        });
      }
    }
    const formattedMoveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";

    await ctx.runMutation(internal.moves.updateMoveInternal, {
      moveId,
      updates: {
        moveStatus: "Booked",
      },
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "MOVE_STATUS_UPDATED",
        companyId: move.companyId,
        body: `**${moveCustomer.name}** **${formattedMoveDate}** is now marked as **Booked**`,
        moveCustomerId: moveCustomer._id,
        moveId,
      },
    });

    try {
      await ctx.runAction(internal.actions.pdf.generatePdf, {
        documentType: "quote",
        toEmail: moveCustomer.email,
        ccEmails: [companyContact.email],
        subject: `Quote for ${moveCustomer.name} on ${formattedMoveDate}`,
        bodyText: "Quote generated",
      });
    } catch (error) {
      console.error(error);
    }

    return true;
  },
});

export const markInvoiceAsComplete = action({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.CUSTOMER,
    ]);

    const move = validateMove(
      await ctx.runQuery(internal.moves.getMoveByIdInternal, { moveId })
    );

    const userId = identity.convexId as Id<"users">;

    isIdentityInMove(identity, move);

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: move.moveCustomerId,
      }
    );

    const companyContact = await ctx.runQuery(
      internal.companyContacts.getCompanyContactByCompanyIdInternal,
      {
        companyId: move.companyId,
      }
    );

    if (!companyContact) {
      throwConvexError(ErrorMessages.COMPANY_CONTACT_NOT_FOUND, {
        code: "NOT_FOUND",
        showToUser: true,
      });
    }

    const now = Date.now();

    const formattedMoveDate = move.moveDate
      ? formatMonthDayLabelStrict(move.moveDate)
      : "TBD";

    await ctx.runMutation(internal.moves.updateMoveInternal, {
      moveId,
      updates: {
        moveStatus: "Completed",
        invoicePaid: true,
        invoicePaidAt: now,
        invoicePaymentError: null,
      },
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "INVOICE_MARKED_COMPLETE",
        companyId: move.companyId,
        body: `**${identity.name}** marked invoice complete for ${moveCustomer.name} on ${formattedMoveDate}`,
        moveId,
        userId,
      },
    });

    try {
      await ctx.runAction(internal.actions.pdf.generatePdf, {
        documentType: "invoice",
        toEmail: moveCustomer.email,
        ccEmails: [companyContact.email],
        subject: `Invoice for ${moveCustomer.name} on ${formattedMoveDate}`,
        bodyText: "Invoice generated",
      });
    } catch (error) {
      console.error(error);
    }

    return true;
  },
});
