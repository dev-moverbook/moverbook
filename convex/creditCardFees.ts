import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateCreditCardFee,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";

export const updateCreditCardFee = mutation({
  args: {
    creditCardFeeId: v.id("creditCardFees"),
    updates: v.object({
      rate: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { creditCardFeeId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const creditCardFee = validateCreditCardFee(
      await ctx.db.get(creditCardFeeId)
    );
    const company = await validateCompany(ctx.db, creditCardFee.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(creditCardFeeId, updates);

    return true;
  },
});
