import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateDocument } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { TravelChargingTypesConvex } from "@/types/convex-enums";
import { ErrorMessages } from "@/types/errors";

export const updateTravelFee = mutation({
  args: {
    travelFeeId: v.id("travelFee"),
    updates: v.object({
      mileageRate: v.optional(v.number()),
      flatRate: v.optional(v.number()),
      defaultMethod: v.optional(v.union(v.null(), TravelChargingTypesConvex)),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { travelFeeId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const travelFee = await validateDocument(
      ctx.db,
      "travelFee",
      travelFeeId,
      ErrorMessages.TRAVEL_FEE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, travelFee.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(travelFeeId, updates);

    return true;
  },
});
