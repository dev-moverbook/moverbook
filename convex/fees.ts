import { ClerkRoles } from "@/types/enums";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { validateCompany, validateDocument } from "./backendUtils/validate";
import { isUserInOrg } from "./backendUtils/validate";
import { Doc } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";

export const createFee = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    price: v.number(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, name, price } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.insert("fees", {
      companyId,
      name,
      price,
      isActive: true,
    });

    return true;
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
  handler: async (ctx, args): Promise<boolean> => {
    const { feeId, updates } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
    ]);

    const fee = await validateDocument(
      ctx.db,
      "fees",
      feeId,
      ErrorMessages.FEE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, fee.companyId);

    isUserInOrg(identity, company.clerkOrganizationId);

    await ctx.db.patch(feeId, updates);

    return true;
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

    const company = await validateCompany(ctx.db, companyId);
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
