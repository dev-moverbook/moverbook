import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateDocument,
} from "./backendUtils/validate";
import { GetCompanyArrivalAndPoliciesData } from "@/types/convex-responses";
import { Doc } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { getFirstByCompanyId } from "./backendUtils/queries";

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
    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const arrivalWindow = await getFirstByCompanyId(
      ctx.db,
      "arrivalWindows",
      companyId,
      ErrorMessages.ARRIVAL_WINDOW_NOT_FOUND
    );

    const policy = await getFirstByCompanyId(
      ctx.db,
      "policies",
      companyId,
      ErrorMessages.POLICY_NOT_FOUND
    );

    return {
      arrivalWindow,
      policy,
    };
  },
});

export const getCompanyArrival = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<Doc<"arrivalWindows">> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);
    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const arrivalWindow = await getFirstByCompanyId(
      ctx.db,
      "arrivalWindows",
      companyId,
      ErrorMessages.ARRIVAL_WINDOW_NOT_FOUND
    );

    return arrivalWindow;
  },
});

export const updateArrivalWindow = mutation({
  args: {
    arrivalWindowId: v.id("arrivalWindows"),
    updates: v.object({
      morningArrival: v.optional(v.string()),
      morningEnd: v.optional(v.string()),
      afternoonArrival: v.optional(v.string()),
      afternoonEnd: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { arrivalWindowId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const arrivalWindow = await validateDocument(
      ctx.db,
      "arrivalWindows",
      arrivalWindowId,
      ErrorMessages.ARRIVAL_WINDOW_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, arrivalWindow.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(arrivalWindowId, updates);

    return true;
  },
});
