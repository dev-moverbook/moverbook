import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateCreditCardFee,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { shouldExposeError } from "./backendUtils/helper";
import { UpdateCreditCardFeeResponse } from "@/types/convex-responses";

export const updateCreditCardFee = mutation({
  args: {
    creditCardFeeId: v.id("creditCardFees"),
    updates: v.object({
      rate: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateCreditCardFeeResponse> => {
    const { creditCardFeeId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const creditCardFee = validateCreditCardFee(
        await ctx.db.get(creditCardFeeId)
      );
      const company = validateCompany(
        await ctx.db.get(creditCardFee.companyId)
      );

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(creditCardFeeId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { creditCardFeeId },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error("Internal Error:", errorMessage, error);

      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: shouldExposeError(errorMessage)
          ? errorMessage
          : ErrorMessages.GENERIC_ERROR,
      };
    }
  },
});
