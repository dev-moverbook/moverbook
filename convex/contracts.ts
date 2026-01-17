import {
  action,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { v } from "convex/values";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import {
  isIdentityInMove,
  isUserInOrg,
  validateCompany,
  validateDocExists,
  validateDocument,
  validateMoveCustomer,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { Doc, Id } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";
import { throwConvexError } from "./backendUtils/errors";
import { ContractStatusConvex } from "./schema";

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

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    if (existing) {
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("contracts", {
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
        },
      });
    }

    return true;
  },
});

export const customerUpdateContract = action({
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

    const contract = await ctx.runQuery(
      internal.contracts.getContractByIdInternal,
      {
        contractId,
      }
    );
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

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId: validatedContract.moveId,
    });

    if (!move) {
      throwConvexError("Move not found", {
        code: "BAD_REQUEST",
        showToUser: true,
      });
    }

    isIdentityInMove(identity, move);

    const companyContact = await ctx.runQuery(
      internal.companyContacts.getCompanyContactByCompanyIdInternal,
      {
        companyId: move.companyId,
      }
    );
    if (!companyContact) {
      throwConvexError("Company contact not found", {
        code: "BAD_REQUEST",
        showToUser: true,
      });
    }

    await ctx.runMutation(internal.contracts.updateContractInternal, {
      contractId: validatedContract._id,
      updates,
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_SIGNED_CONTRACT_DOC",
        companyId: move.companyId,
        body: `**${moveCustomer.name}** signed contract.`,
        moveId: validatedContract.moveId,
        moveCustomerId: move.moveCustomerId,
      },
    });

    await ctx.runAction(internal.actions.pdf.generatePdf, {
      documentType: "contract",
      toEmail: moveCustomer.email,
      ccEmails: [companyContact.email],
      subject: "Contract Signed",
      bodyText: "Contract signed",
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

export const getContractByIdInternal = internalQuery({
  args: {
    contractId: v.id("contracts"),
  },
  handler: async (ctx, args): Promise<Doc<"contracts"> | null> => {
    const { contractId } = args;
    return ctx.db.get(contractId);
  },
});

export const updateContractInternal = internalMutation({
  args: {
    contractId: v.id("contracts"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      customerSignedAt: v.optional(v.number()),
      status: v.optional(ContractStatusConvex),
    }),
  },
  handler: async (ctx, args) => {
    const { contractId, updates } = args;
    return ctx.db.patch(contractId, updates);
  },
});
