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
  GetActiveVariablesByCompanyIdResponse,
  UpdateVariableResponse,
} from "@/types/convex-responses";
import { VariableSchema } from "@/types/convex-schemas";
import { checkExistingVariable } from "./backendUtils/checkUnique";

//not used
export const getActiveVariablesByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (
    ctx,
    args
  ): Promise<GetActiveVariablesByCompanyIdResponse> => {
    const { companyId } = args;
    try {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: { variables },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(errorMessage, error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: errorMessage,
      };
    }
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
  handler: async (ctx, args): Promise<UpdateVariableResponse> => {
    const { variableId, updates } = args;

    try {
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

      return {
        status: ResponseStatus.SUCCESS,
        data: { variableId },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
      console.error(errorMessage, error);
      return {
        status: ResponseStatus.ERROR,
        data: null,
        error: errorMessage,
      };
    }
  },
});
