import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateWebIntegrations,
} from "./backendUtils/validate";
import { Id } from "./_generated/dataModel";

export const updateWebIntegrations = mutation({
  args: {
    webIntegrationsId: v.id("webIntegrations"),
    updates: v.object({
      webform: v.optional(v.string()),
      webformEmbeddedCode: v.optional(v.string()),
      externalReviewUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"webIntegrations">> => {
    const { webIntegrationsId, updates } = args;

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

    return webIntegrations._id;
  },
});
