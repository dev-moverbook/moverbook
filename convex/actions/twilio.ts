"use node";

import { v } from "convex/values";
import { action, internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import {
  isIdentityInCompany,
  validateDocExists,
  validateUser,
} from "../backendUtils/validate";
import { requireAuthenticatedUser } from "../backendUtils/auth";
import { ClerkRoles } from "@/types/enums";
import { throwConvexError } from "../backendUtils/errors";
import {
  createTollfreeComplianceInquiry,
  purchaseTwilioNumber,
} from "../functions/twilio";
import { ErrorMessages } from "@/types/errors";
import { TwilioInquirySchema } from "@/types/types";
import { Doc, Id } from "../_generated/dataModel";
import { serverEnv } from "../backendUtils/serverEnv";
import twilioPkg from "twilio";

const { validateRequest } = twilioPkg;

export const insertTwilioNumber = action({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const { companyId } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.ADMIN]);

      const company = await ctx.runQuery(
        internal.companies.getCompanyByIdInternal,
        {
          companyId,
        }
      );

      const validatedCompany = validateDocExists(
        "companies",
        company,
        ErrorMessages.COMPANY_NOT_FOUND
      );

      isIdentityInCompany(identity, validatedCompany._id);

      const existingTwilioNumber = await ctx.runQuery(
        internal.twilioPhoneNumbers.getTwilioPhoneNumber,
        {
          companyId: validatedCompany._id,
        }
      );

      if (existingTwilioNumber) {
        throwConvexError("Twilio number already exists", {
          code: "BAD_REQUEST",
          showToUser: true,
        });
      }

      const { phoneNumber, sid } = await purchaseTwilioNumber(
        validatedCompany.name
      );

      await ctx.runMutation(
        internal.twilioPhoneNumbers.insertTwilioPhoneNumber,
        {
          companyId: validatedCompany._id,
          phoneNumberE164: phoneNumber,
          sid,
        }
      );

      return true;
    } catch (error) {
      throwConvexError(error, {
        code: "INTERNAL_ERROR",
      });
    }
  },
});

export const validateTwilioNumber = action({
  args: {},
  handler: async (ctx): Promise<TwilioInquirySchema> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.ADMIN]);
      const companyId = identity.convexOrgId as Id<"companies">;
      const userId = identity.convexId as Id<"users">;

      const user = await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId,
      });

      const validatedUser = validateUser(user, true, true);

      const company = await ctx.runQuery(
        internal.companies.getCompanyByIdInternal,
        {
          companyId,
        }
      );

      const validatedCompany = validateDocExists(
        "companies",
        company,
        ErrorMessages.COMPANY_NOT_FOUND
      );

      isIdentityInCompany(identity, validatedCompany._id);

      const existingTwilioNumber = await ctx.runQuery(
        internal.twilioPhoneNumbers.getTwilioPhoneNumber,
        {
          companyId: validatedCompany._id,
        }
      );

      if (!existingTwilioNumber) {
        throwConvexError("Twilio number not found", {
          code: "BAD_REQUEST",
          showToUser: true,
        });
      }

      if (existingTwilioNumber.tollfreeVerificationStatus === "Approved") {
        throwConvexError("Twilio number already verified", {
          code: "BAD_REQUEST",
          showToUser: true,
        });
      }

      const inquiry = await createTollfreeComplianceInquiry({
        tollfreePhoneNumber: existingTwilioNumber.phoneNumberE164,
        notificationEmail: validatedUser.email,
      });

      return {
        inquiryId: inquiry.inquiryId,
        inquirySessionToken: inquiry.inquirySessionToken,
      };
    } catch (error) {
      throwConvexError(error, {
        code: "INTERNAL_ERROR",
      });
    }
  },
});

export const validateAndProcessInboundSms = internalAction({
  args: {
    url: v.string(),
    twilioSignature: v.string(),
    bodyObject: v.any(),
    messageData: v.object({
      fromPhoneE164: v.string(),
      toPhoneE164: v.string(),
      messageBody: v.string(),
      twilioMessageSid: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { TWILIO_AUTH_TOKEN } = serverEnv();

    const isValid = validateRequest(
      TWILIO_AUTH_TOKEN,
      args.twilioSignature,
      args.url,
      args.bodyObject
    );

    if (!isValid) {
      console.error("Twilio signature validation failed in Node Action.");
      throw new Error("Unauthorized Twilio Request");
    }

    const twilioNumber = await ctx.runQuery(
      internal.twilioPhoneNumbers.getTwilioPhoneNumberByPhoneNumberE164,
      {
        phoneNumberE164: args.messageData.toPhoneE164,
      }
    );

    const validatedTwilioNumber = validateDocExists(
      "twilioPhoneNumbers",
      twilioNumber,
      "Twilio number not found"
    );

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByPhoneNumberInternal,
      {
        phoneNumber: args.messageData.fromPhoneE164,
      }
    );

    const validatedMoveCustomer = validateDocExists(
      "moveCustomers",
      moveCustomer,
      "Move customer not found"
    );

    const latestMove: Doc<"moves"> | null = await ctx.runQuery(
      internal.moves.getLatestMoveByMoveCustomerIdInternal,
      {
        moveCustomerId: validatedMoveCustomer._id,
        companyId: validatedTwilioNumber.companyId,
      }
    );

    const validatedMove: Doc<"moves"> = validateDocExists(
      "moves",
      latestMove,
      "Move not found"
    );

    await ctx.runMutation(internal.messages.internalCreateInboundMessage, {
      moveId: validatedMove._id,
      companyId: validatedTwilioNumber.companyId,
      method: "sms",
      status: "received",
      message: args.messageData.messageBody,
      sid: args.messageData.twilioMessageSid,
      sentType: "incoming",
    });

    return validatedMove;
  },
});
