"use node";

import {
  CommunicationTypeConvex,
  MessageSentTypeConvex,
  PresSetScriptsConvex,
} from "@/types/convex-enums";
import { ClerkRoles, PresSetScripts } from "@/types/enums";
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
} from "../backendUtils/validate";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { createPresetNewsFeedEntry } from "../backendUtils/newsFeedHelper";
import { sendClerkMoveCustomerInvitation } from "../functions/clerk";
import {
  extractTemplateKeys,
  injectTemplateValues,
  resolveTemplateSideEffects,
} from "../backendUtils/template";
import { sendTwilioSms } from "../functions/twilio";

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

    const validatedMoveCustomer = validateDocExists(
      "users",
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: move.moveCustomerId,
      }),
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
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

    if (
      (preSetTypes === PresSetScripts.EMAIL_QUOTE ||
        preSetTypes === PresSetScripts.SMS_QUOTE) &&
      validatedMoveCustomer.clerkUserId === undefined
    ) {
      console.log("sending clerk move customer invitation");
      await sendClerkMoveCustomerInvitation({
        email: validatedMoveCustomer.email,
        slug: company.slug,
        moveId,
        convexUserId: validatedMoveCustomer._id,
      });
    }

    if (scriptType === "email") {
      sid = "test email";
      // const companyContact = await ctx.runQuery(
      //   internal.companyContacts.getCompanyContactByCompanyIdInternal,
      //   {
      //     companyId: company._id,
      //   }
      // );
      // if (!companyContact) {
      //   throwConvexError(ErrorMessages.COMPANY_CONTACT_NOT_FOUND, {
      //     code: "NOT_FOUND",
      //     showToUser: true,
      //   });
      // }
      // sid = await sendSendGridEmail({
      //   fromEmail: companyContact.email,
      //   toEmail: validatedMoveCustomer.email,
      //   body: script.message,
      //   subject: script.emailTitle ?? "No Subject",
      // });
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
      customerName: validatedMoveCustomer.name || "Customer",
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
    });

    // const templateValues = await buildTemplateValues({
    //   keys: allKeys,
    //   move,
    //   customerName: moveCustomer.name,
    //   resolvedValues,
    // });

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
    }
    // if (!move.email) {
    //   throw new Error(ErrorMessages.MOVE_EMAIL_NOT_FOUND);
    // }
    // sid = await sendSendGridEmail(move.email, resolvedMessage, subject);
    //   }
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
