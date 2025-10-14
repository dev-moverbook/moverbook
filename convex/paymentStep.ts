import { requireAuthenticatedUser } from "./backendUtils/auth";
import { isUserInOrg, validateDocument } from "./backendUtils/validate";
import { GetPaymentPageData } from "@/types/convex-responses";
import { query } from "./_generated/server";
import { validateCompany } from "./backendUtils/validate";
import { v } from "convex/values";
import { ClerkRoles } from "@/types/enums";
import { Doc } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";

export const getPaymentPage = query({
  args: {
    moveId: v.id("move"),
  },
  handler: async (ctx, { moveId }): Promise<GetPaymentPageData> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const move = await validateDocument(
      ctx.db,
      "move",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const additionalFees: Doc<"additionalFees">[] = await ctx.db
      .query("additionalFees")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const discounts: Doc<"discounts">[] = await ctx.db
      .query("discounts")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const invoice: Doc<"invoices"> | null = await ctx.db
      .query("invoices")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    const internalReview: Doc<"internalReview"> | null = await ctx.db
      .query("internalReview")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    const fees: Doc<"fees">[] = await ctx.db
      .query("fees")
      .withIndex("byCompanyId", (q) => q.eq("companyId", company._id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return {
      additionalFees,
      discounts,
      invoice,
      internalReview,
      fees,
    };
  },
});
