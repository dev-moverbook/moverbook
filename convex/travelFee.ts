import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateTravelFee } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { shouldExposeError } from "./backendUtils/helper";
import { UpdateTravelFeeResponse } from "@/types/convex-responses";
import { TravelChargingTypesConvex } from "@/types/convex-enums";

export const updateTravelFee = mutation({
  args: {
    travelFeeId: v.id("travelFee"),
    updates: v.object({
      isDefault: v.optional(v.boolean()),
      chargingMethod: v.optional(TravelChargingTypesConvex),
      rate: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateTravelFeeResponse> => {
    const { travelFeeId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const travelFee = validateTravelFee(await ctx.db.get(travelFeeId));
      const company = validateCompany(await ctx.db.get(travelFee.companyId));

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(travelFeeId, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { travelFeeId },
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
