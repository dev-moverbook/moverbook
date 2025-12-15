import { formatMonthDayLabelStrict } from "@/frontendUtils/luxonUtils";
import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  validateDocExists,
  isUserInOrg,
  validateUser,
} from "./backendUtils/validate";
import { Id } from "./_generated/dataModel";

// To be Deleted
export const sendExternalReview = action({
  args: {
    moveId: v.id("moves"),
    channel: v.union(v.literal("email"), v.literal("sms")),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId: args.moveId,
    });
    const validatedMove = validateDocExists(
      "moves",
      move,
      ErrorMessages.MOVE_NOT_FOUND
    );

    const company = await ctx.runQuery(
      internal.companies.getCompanyByIdInternal,
      {
        companyId: validatedMove.companyId,
      }
    );
    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );

    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: identity.convexId as Id<"users">,
      })
    );

    const validatedMoveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: validatedMove.moveCustomerId,
      }
    );

    if (args.channel === "email") {
      // TODO: Send waiver email
    } else if (args.channel === "sms") {
      // TODO: Send waiver SMS
    }
    const moveDate = validatedMove.moveDate
      ? formatMonthDayLabelStrict(validatedMove.moveDate)
      : "TBD";
    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "EXTERNAL_REVIEW_SENT",
        companyId: validatedCompany._id,
        body: `**${user.name}** sent external review to **${validatedMoveCustomer.name}** **${moveDate}** via ${args.channel}`,
        moveId: validatedMove._id,
        userId: user._id,
      },
    });

    return true;
  },
});
