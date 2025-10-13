import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateVariable,
} from "./backendUtils/validate";
import {
  CreateVariableResponse,
  UpdateVariableResponse,
} from "@/types/convex-responses";
import { VariableSchema } from "@/types/convex-schemas";
import { checkExistingVariable } from "./backendUtils/checkUnique";
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

    const company = await ctx.db.get(companyId);

    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const variables = await ctx.db
      .query("variables")
      .filter((q) => q.and(q.eq(q.field("companyId"), validatedCompany._id)))
      .collect();

    return variables;
  },
});

// not used
export const createVariable = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    defaultValue: v.string(),
  },
  handler: async (ctx, args): Promise<CreateVariableResponse> => {
    const { companyId, name, defaultValue } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const company = await ctx.db.get(companyId);
      const validatedCompany = validateCompany(company);

      isUserInOrg(identity, validatedCompany.clerkOrganizationId);

      const existingVariable: VariableSchema | null =
        await checkExistingVariable(ctx, companyId, name);

      if (existingVariable) {
        return {
          status: ResponseStatus.ERROR,
          error: ErrorMessages.VARIABLE_NAME_EXISTS,
          data: null,
        };
      }

      const variableId = await ctx.db.insert("variables", {
        companyId,
        name,
        defaultValue,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: { variableId },
      };
    } catch (error) {
      console.error(error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: ErrorMessages.GENERIC_ERROR,
      };
    }
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

    const variable = await ctx.db.get(variableId);
    const validatedVariable = validateVariable(variable);

    const company = await ctx.db.get(validatedVariable.companyId);
    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    await ctx.db.patch(variableId, updates);

    return variableId;
  },
});
