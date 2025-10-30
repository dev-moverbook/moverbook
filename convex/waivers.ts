import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isUserInOrg,
  validateCompany,
  validateDocExists,
  validateDocument,
  validateMoveCustomer,
  validateUser,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { Doc, Id } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";

export const createOrUpdateWaiver = mutation({
  args: {
    moveId: v.id("moves"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      customerSignedAt: v.optional(v.number()),
      repSignature: v.optional(v.string()),
      repSignedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId } = args;
    const updates = { ...args.updates };

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const move = await validateDocument(
      ctx.db,
      "moves",
      moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );
    const company = await validateCompany(ctx.db, move.companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const now = Date.now();

    if (updates.customerSignature && !updates.customerSignedAt) {
      updates.customerSignedAt = now;
    }

    if (updates.repSignature && !updates.repSignedAt) {
      updates.repSignedAt = now;
    }

    const existing: Doc<"waivers"> | null = await ctx.db
      .query("waivers")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    let waiverId: Id<"waivers">;

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      waiverId = existing._id;
    } else {
      waiverId = await ctx.db.insert("waivers", {
        moveId,
        ...updates,
      });
    }

    if (updates.customerSignature) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        type: "WAIVER_SIGNED",
        companyId: company._id,
        body: `**${moveCustomer.name}** signed waiver`,
        moveCustomerId: move.moveCustomerId,
        context: {
          customerName: moveCustomer.name,
        },
        moveId,
      });
    }

    return true;
  },
});

export const sendWaiverNotification = action({
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
      ClerkRoles.MOVER,
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
      await ctx.runQuery(internal.users.getUserByClerkIdInternal, {
        clerkUserId: identity.id as string,
      })
    );

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: validatedMove.moveCustomerId,
      }
    );

    const validatedMoveCustomer = validateDocExists(
      "moveCustomers",
      moveCustomer,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    if (args.channel === "email") {
      // TODO: Send waiver email
    } else if (args.channel === "sms") {
      // TODO: Send waiver SMS
    }
    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      type: "WAIVER_SENT",
      companyId: validatedCompany._id,
      body: `**${user.name}** sent waiver to **${validatedMoveCustomer.name}** via ${args.channel}`,
      moveId: validatedMove._id,
      context: {
        customerName: validatedMoveCustomer.name,
        deliveryType: args.channel,
        salesRepName: user.name,
      },
      userId: user._id,
    });

    return true;
  },
});
