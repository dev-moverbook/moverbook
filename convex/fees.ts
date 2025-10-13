import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateFee } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { Doc, Id } from "./_generated/dataModel";

export const createFee = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"fees">> => {
    const { companyId, name, price } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const feeId = await ctx.db.insert("fees", {
      companyId,
      name,
      price,
      isActive: true,
    });

    return feeId;
  },
});

export const updateFee = mutation({
  args: {
    feeId: v.id("fees"),
    updates: v.object({
      name: v.optional(v.string()),
      price: v.optional(v.number()),
      isActive: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args): Promise<Id<"fees">> => {
    const { feeId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const fee = validateFee(await ctx.db.get(feeId));
    const company = validateCompany(await ctx.db.get(fee.companyId));

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(feeId, updates);

    return feeId;
  },
});

export const getFees = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Doc<"fees">[]> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const fees: Doc<"fees">[] = await ctx.db
      .query("fees")
      .withIndex("byCompanyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const sortedFees = fees.sort((a, b) => a.name.localeCompare(b.name));

    return sortedFees;
  },
});
