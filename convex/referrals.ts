import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import {
  isUserInOrg,
  validateCompany,
  validateReferral,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { requireAuthenticatedUser } from "./backendUtils/auth";

import { Doc, Id } from "./_generated/dataModel";

export const getActiveReferralsByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<Doc<"referrals">[]> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await ctx.db.get(companyId);

    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const referrals = await ctx.db
      .query("referrals")
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), validatedCompany._id),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    return referrals;
  },
});

export const createReferral = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, name } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await ctx.db.get(companyId);

    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    await ctx.db.insert("referrals", {
      companyId,
      name,
      isActive: true,
    });

    return true;
  },
});

export const updateReferral = mutation({
  args: {
    referralId: v.id("referrals"),
    updates: v.object({
      name: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"referrals">> => {
    const { referralId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const referral = await ctx.db.get(referralId);
    const validatedReferral = validateReferral(referral);

    const company = await ctx.db.get(validatedReferral.companyId);
    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    await ctx.db.patch(referralId, updates);

    return referralId;
  },
});
