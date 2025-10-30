import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateDocument,
} from "./backendUtils/validate";
import { Doc, Id } from "./_generated/dataModel";

export const getVariablesByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<Doc<"variables">[]> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const validatedCompany = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const variables = await ctx.db
      .query("variables")
      .filter((q) => q.and(q.eq(q.field("companyId"), validatedCompany._id)))
      .collect();

    return variables;
  },
});

export const updateVariable = mutation({
  args: {
    variableId: v.id("variables"),
    updates: v.object({
      name: v.optional(v.string()),
      defaultValue: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"variables">> => {
    const { variableId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const variable = await validateDocument(
      ctx.db,
      "variables",
      variableId,
      ErrorMessages.VARIABLE_NOT_FOUND
    );

    const validatedCompany = await validateCompany(ctx.db, variable.companyId);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    await ctx.db.patch(variableId, updates);

    return variableId;
  },
});
