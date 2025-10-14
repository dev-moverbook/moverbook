import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateDocument,
} from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";

export const updateCompliance = mutation({
  args: {
    complianceId: v.id("compliance"),
    updates: v.object({
      statePucPermitNumber: v.optional(v.string()),
      dmvNumber: v.optional(v.string()),
      usDotNumber: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { complianceId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const compliance = await validateDocument(
      ctx.db,
      "compliance",
      complianceId,
      ErrorMessages.COMPLIANCE_NOT_FOUND
    );

    const company = await validateCompany(ctx.db, compliance.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(compliance._id, updates);

    return true;
  },
});
