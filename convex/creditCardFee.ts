import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  validateCreditCardFee,
} from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { Id } from "./_generated/dataModel";

export const updateCreditCardFee = mutation({
  args: {
    creditCardFeeId: v.id("creditCardFees"),
    updates: v.object({
      rate: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"creditCardFees">> => {
    const { creditCardFeeId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const creditCardFee = validateCreditCardFee(
      await ctx.db.get(creditCardFeeId)
    );
    const company = validateCompany(await ctx.db.get(creditCardFee.companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(creditCardFeeId, updates);

    return creditCardFeeId;
  },
});
