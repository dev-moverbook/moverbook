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

export const updateWebIntegrations = mutation({
  args: {
    webIntegrationsId: v.id("webIntegrations"),
    updates: v.object({
      webform: v.optional(v.string()),
      webformEmbeddedCode: v.optional(v.string()),
      externalReviewUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { webIntegrationsId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const webIntegrations = await validateDocument(
      ctx.db,
      "webIntegrations",
      webIntegrationsId,
      ErrorMessages.WEB_INTEGRATIONS_NOT_FOUND
    );

    const company = await validateCompany(ctx.db, webIntegrations.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);
    await ctx.db.patch(webIntegrations._id, updates);

    return true;
  },
});
