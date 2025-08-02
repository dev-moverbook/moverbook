import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { handleInternalError } from "./backendUtils/helper";
import {
  validateCompany,
  isUserInOrg,
  validateWebIntegrations,
} from "./backendUtils/validate";
import { UpdateWebIntegrationsResponse } from "@/types/convex-responses";

export const updateWebIntegrations = mutation({
  args: {
    webIntegrationsId: v.id("webIntegrations"),
    updates: v.object({
      webform: v.optional(v.string()),
      webformEmbeddedCode: v.optional(v.string()),
      externalReviewUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<UpdateWebIntegrationsResponse> => {
    const { webIntegrationsId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const webIntegrations = validateWebIntegrations(
        await ctx.db.get(webIntegrationsId)
      );

      const company = validateCompany(
        await ctx.db.get(webIntegrations.companyId)
      );

      isUserInOrg(identity, company.clerkOrganizationId);

      await ctx.db.patch(webIntegrations._id, updates);

      return {
        status: ResponseStatus.SUCCESS,
        data: { webIntegrationsId: webIntegrations._id },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});
