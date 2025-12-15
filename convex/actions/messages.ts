"use node";

import { PresSetScriptsConvex } from "@/types/convex-enums";
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
} from "../backendUtils/validate";
import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { createPresetNewsFeedEntry } from "../backendUtils/newsFeedHelper";
import { sendClerkMoveCustomerInvitation } from "../functions/clerk";

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
