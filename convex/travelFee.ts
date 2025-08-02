import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateTravelFee } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { handleInternalError } from "./backendUtils/helper";
import { UpdateTravelFeeResponse } from "@/types/convex-responses";
import { TravelChargingTypesConvex } from "@/types/convex-enums";

export const updateTravelFee = mutation({
  args: {
    travelFeeId: v.id("travelFee"),
    updates: v.object({
      mileageRate: v.optional(v.number()),
      flatRate: v.optional(v.number()),
      defaultMethod: v.optional(v.union(v.null(), TravelChargingTypesConvex)),
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
      return handleInternalError(error);
    }
  },
});
