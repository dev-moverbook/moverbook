import { internalQuery, mutation, query } from "./_generated/server";
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

import {
  CommunicationTypeConvex,
  PresSetScriptsConvex,
} from "@/types/convex-enums";
import { checkExistingScript } from "./backendUtils/checkUnique";
import { Doc } from "./_generated/dataModel";
import { throwConvexError } from "./backendUtils/errors";

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

    const validatedCompany = await validateCompany(ctx.db, companyId);
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

export const getActiveScriptsByCompanyId = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<{ scripts: Doc<"scripts">[] }> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const validatedCompany = await validateCompany(ctx.db, companyId);
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

    return { scripts };
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

    const validatedCompany = await validateCompany(ctx.db, companyId);
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
      updatedAt: Date.now(),
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

    const validatedCompany = await validateCompany(
      ctx.db,
      validatedScript.companyId
    );
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
      updatedAt: Date.now(),
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
      throwConvexError(ErrorMessages.SCRIPT_PRESET_CANNOT_BE_DELETED, {
        code: "BAD_REQUEST",
        showToUser: true,
      });
    }

    const validatedCompany = await validateCompany(
      ctx.db,
      validatedScript.companyId
    );
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    await ctx.db.patch(scriptId, { isActive: false, updatedAt: Date.now() });

    return true;
  },
});

export const getPresetScriptByPreSetType = internalQuery({
  args: { companyId: v.id("companies"), preSetType: PresSetScriptsConvex },
  handler: async (ctx, args): Promise<Doc<"scripts"> | null> => {
    const { companyId, preSetType } = args;

    return await ctx.db
      .query("scripts")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("preSetTypes"), preSetType))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});
