import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateDocument,
} from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";
import { Doc } from "./_generated/dataModel";

export const updateWebIntegrations = mutation({
  args: {
    webIntegrationsId: v.id("webIntegrations"),
    updates: v.object({
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

export const getWebIntegrationsByCompanyId = internalQuery({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Doc<"webIntegrations"> | null> => {
    const { companyId } = args;
    return await ctx.db
      .query("webIntegrations")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .first();
  },
});

export const updateWebformUrl = internalMutation({
  args: {
    webIntegrationsId: v.id("webIntegrations"),
    updates: v.object({
      webform: v.optional(v.string()),
      webformEmbeddedCode: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<void> => {
    const { webIntegrationsId, updates } = args;

    await ctx.db.patch(webIntegrationsId, updates);
  },
});
