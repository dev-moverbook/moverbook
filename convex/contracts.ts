import { action, internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isIdentityInMove,
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

export const createOrUpdateContract = mutation({
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
    const updates: Partial<Doc<"contracts">> = { ...args.updates };

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
      updates.status = "pending";
    }

    if (updates.repSignature && !updates.repSignedAt) {
      updates.repSignedAt = now;
      updates.status = "completed";
    }

    const existing: Doc<"contracts"> | null = await ctx.db
      .query("contracts")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    let contractId: Id<"contracts">;

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      contractId = existing._id;
    } else {
      contractId = await ctx.db.insert("contracts", {
        moveId,
        ...updates,
        status: "pending",
      });
    }

    if (updates.customerSignature) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "CUSTOMER_SIGNED_CONTRACT_DOC",
          companyId: company._id,
          body: `**${moveCustomer.name}** signed contract.`,
          moveId,
          moveCustomerId: move.moveCustomerId,
          context: {
            customerName: moveCustomer.name,
            contractId,
          },
        },
      });
    }

    return true;
  },
});

// To Be Deleted
export const sendContract = action({
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
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: identity.convexId as Id<"users">,
      })
    );

    const moveCustomer = await ctx.runQuery(
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

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CONTRACT_SENT",
        companyId: validatedCompany._id,
        body: `**${user.name}** sent contract to **${moveCustomer.name}** via ${args.channel}`,
        moveId: validatedMove._id,
        context: {
          customerName: moveCustomer.name,
          deliveryType: args.channel,
          salesRepName: user.name,
        },
        userId: user._id,
      },
    });

    return true;
  },
});

export const customerUpdateContract = mutation({
  args: {
    contractId: v.id("contracts"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { contractId } = args;
    const updates: Partial<Doc<"contracts">> = {
      ...args.updates,
      customerSignedAt: Date.now(),
      status: "completed",
    };

    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);

    const contract = await ctx.db.get(contractId);
    const validatedContract = validateDocExists(
      "contracts",
      contract,
      "Contract not found"
    );

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: identity.convexId as Id<"users">,
      }
    );

    const move = await validateDocument(
      ctx.db,
      "moves",
      validatedContract.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

    isIdentityInMove(identity, move);

    await ctx.db.patch(validatedContract._id, updates);

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_SIGNED_CONTRACT_DOC",
        companyId: move.companyId,
        body: `**${moveCustomer.name}** signed contract.`,
        moveId: validatedContract.moveId,
        moveCustomerId: move.moveCustomerId,
        context: {
          customerName: moveCustomer.name,
          contractId: validatedContract._id,
        },
      },
    });

    return true;
  },
});

export const getContractByMoveIdInternal = internalQuery({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"contracts"> | null> => {
    const { moveId } = args;
    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();
    return contract;
  },
});
