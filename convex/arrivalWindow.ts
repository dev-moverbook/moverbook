import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateArrivalWindow,
  validatePolicy,
} from "./backendUtils/validate";
import { GetCompanyArrivalAndPoliciesData } from "@/types/convex-responses";
import { Doc, Id } from "./_generated/dataModel";

export const getCompanyArrivalAndPolicies = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<GetCompanyArrivalAndPoliciesData> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);
    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const arrivalWindow = validateArrivalWindow(
      await ctx.db
        .query("arrivalWindow")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .first()
    );

    const policy = validatePolicy(
      await ctx.db
        .query("policies")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .first()
    );

    return {
      arrivalWindow,
      policy,
    };
  },
});

export const getCompanyArrival = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<Doc<"arrivalWindow">> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);
    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const arrivalWindow = validateArrivalWindow(
      await ctx.db
        .query("arrivalWindow")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .first()
    );

    return arrivalWindow;
  },
});

export const updateArrivalWindow = mutation({
  args: {
    arrivalWindowId: v.id("arrivalWindow"),
    updates: v.object({
      morningArrival: v.optional(v.string()),
      morningEnd: v.optional(v.string()),
      afternoonArrival: v.optional(v.string()),
      afternoonEnd: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"arrivalWindow">> => {
    const { arrivalWindowId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const arrivalWindow = validateArrivalWindow(
      await ctx.db.get(arrivalWindowId)
    );
    const company = validateCompany(await ctx.db.get(arrivalWindow.companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(arrivalWindowId, updates);

    return arrivalWindowId;
  },
});
