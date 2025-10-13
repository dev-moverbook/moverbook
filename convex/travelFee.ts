import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateTravelFee } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
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
  handler: async (ctx, args): Promise<boolean> => {
    const { travelFeeId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const travelFee = validateTravelFee(await ctx.db.get(travelFeeId));
    const company = validateCompany(await ctx.db.get(travelFee.companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(travelFeeId, updates);

    return true;
  },
});
