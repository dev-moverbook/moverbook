import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateCompany,
  isUserInOrg,
  validateScriptFields,
  validateScript,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";

import { CommunicationTypeConvex } from "@/types/convex-enums";
import { checkExistingScript } from "./backendUtils/checkUnique";
import { Doc, Id } from "./_generated/dataModel";

export const getScriptsByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<Doc<"scripts">[]> => {
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

    const scripts = await ctx.db
      .query("scripts")
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), validatedCompany._id),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    return scripts;
  },
});

export const getActiveScriptsAndVariablesByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (
    ctx,
    args
  ): Promise<{ scripts: Doc<"scripts">[]; variables: Doc<"variables">[] }> => {
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

    const scripts: Doc<"scripts">[] = await ctx.db
      .query("scripts")
      .filter((q) =>
        q.and(
          q.eq(q.field("companyId"), validatedCompany._id),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();

    const variables: Doc<"variables">[] = await ctx.db
      .query("variables")
      .filter((q) => q.eq(q.field("companyId"), validatedCompany._id))
      .collect();
    return { scripts, variables };
  },
});

export const createScript = mutation({
  args: {
    companyId: v.id("companies"),
    title: v.string(),
    type: CommunicationTypeConvex,
    message: v.string(),
    emailTitle: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, title, type, message, emailTitle } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await ctx.db.get(companyId);
    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const existingScript = await checkExistingScript(
      ctx,
      companyId,
      title,
      type
    );
    if (existingScript) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: ErrorMessages.SCRIPT_WITH_TITLE_EXITS,
      });
    }
    validateScriptFields(type, emailTitle);

    await ctx.db.insert("scripts", {
      companyId,
      title,
      type,
      message,
      isActive: true,
      emailTitle,
    });

    return true;
  },
});

export const updateScript = mutation({
  args: {
    scriptId: v.id("scripts"),
    updates: v.object({
      title: v.optional(v.string()),
      type: v.optional(CommunicationTypeConvex),
      message: v.optional(v.string()),
      emailTitle: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { scriptId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const script = await ctx.db.get(scriptId);
    const validatedScript = validateScript(script);

    const company = await ctx.db.get(validatedScript.companyId);
    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    if (updates.title || updates.type) {
      const newTitle = updates.title ?? validatedScript.title;
      const newType = updates.type ?? validatedScript.type;

      const scriptExists = await checkExistingScript(
        ctx,
        validatedScript.companyId,
        newTitle,
        newType,
        scriptId
      );

      if (scriptExists) {
        throw new ConvexError({
          code: "BAD_REQUEST",
          message: ErrorMessages.SCRIPT_WITH_TITLE_EXITS,
        });
      }
    }

    const finalType = updates.type ?? validatedScript.type;
    const finalEmailTitle = updates.emailTitle ?? validatedScript.emailTitle;
    validateScriptFields(finalType, finalEmailTitle);

    await ctx.db.patch(scriptId, {
      ...updates,
      emailTitle: finalType === "email" ? finalEmailTitle : undefined,
    });

    return true;
  },
});

export const deleteScript = mutation({
  args: {
    scriptId: v.id("scripts"),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { scriptId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const script = await ctx.db.get(scriptId);
    const validatedScript = validateScript(script, true, true);

    if (validatedScript.preSetTypes) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: ErrorMessages.SCRIPT_PRESET_CANNOT_BE_DELETED,
      });
    }

    const company = await ctx.db.get(validatedScript.companyId);
    const validatedCompany = validateCompany(company);
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    await ctx.db.patch(scriptId, { isActive: false });

    return true;
  },
});
