import { v } from "convex/values";
import { query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles } from "@/types/enums";
import {
  isIdentityInMove,
  validateDocExists,
  validateDocument,
} from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";
import { GetCustomerMoveDocumentsData } from "@/types/convex-responses";

export const getCustomerMoveDocuments = query({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<GetCustomerMoveDocumentsData> => {
    const { moveId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.CUSTOMER,
      ClerkRoles.MOVER,
    ]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

    isIdentityInMove(identity, move);

    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .first();

    const waiver = await ctx.db
      .query("waivers")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .first();
    const policy = await ctx.db
      .query("policies")
      .withIndex("by_companyId", (q) => q.eq("companyId", move.companyId))
      .first();

    const validatedPolicy = validateDocExists(
      "policies",
      policy,
      "Policy not found"
    );

    return {
      contract,
      waiver,
      policy: validatedPolicy,
    };
  },
});
