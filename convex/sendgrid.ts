"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import {
  checkSenderVerified,
  createSingleSender,
} from "./backendUtils/sendGrid";
import {
  CheckSenderResponse,
  CreateSenderResponse,
} from "@/types/convex-responses";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { parseFullAddressToSendgridFormat } from "./backendUtils/helper";

export const createSender = action({
  args: {
    companyContactId: v.id("companyContacts"),
  },
  handler: async (ctx, { companyContactId }): Promise<string> => {
    await requireAuthenticatedUser(ctx, [ClerkRoles.ADMIN, ClerkRoles.MANAGER]);

    const companyContact = await ctx.runQuery(
      internal.companyContacts.getCompanyContactInternal,
      { companyContactId }
    );

    const sendgridSenderId = await createSingleSender({
      fromEmail: companyContact.email,
      fromName: "Support",
      address: parseFullAddressToSendgridFormat(
        companyContact.address?.formattedAddress ?? ""
      ),
    });

    await ctx.runMutation(internal.companyContacts.updateSendgridInfo, {
      companyContactId,
      updates: {
        sendgridSenderId,
      },
    });

    return sendgridSenderId;
  },
});

export const checkSender = action({
  args: {
    companyContactId: v.id("companyContacts"),
  },
  handler: async (ctx, { companyContactId }): Promise<CheckSenderResponse> => {
    try {
      await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.MANAGER,
      ]);

      const companyContact = await ctx.runQuery(
        internal.companyContacts.getCompanyContactInternal,
        { companyContactId }
      );

      const senderId = companyContact.sendgridSenderId;

      if (!senderId) {
        throw new Error(
          ErrorMessages.COMPANY_CONTACT_SENDGRID_SENDER_NOT_FOUND
        );
      }
      const isVerified = await checkSenderVerified(senderId);

      await ctx.runMutation(internal.companyContacts.updateSendgridInfo, {
        companyContactId,
        updates: {
          sendgridVerified: isVerified,
        },
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          isVerified,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error:
          error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR,
      };
    }
  },
});
