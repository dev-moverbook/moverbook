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
  validateUser,
} from "./backendUtils/validate";
import { ClerkRoles } from "@/types/enums";
import { Doc } from "./_generated/dataModel";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";
import { throwConvexError } from "./backendUtils/errors";
import { WaiverStatusConvex } from "./schema";

export const createOrUpdateWaiver = mutation({
  args: {
    moveId: v.id("moves"),
    updates: v.object({
      customerSignature: v.optional(v.string()),
      repSignature: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveId } = args;
    const updates: Partial<Doc<"waivers">> = { ...args.updates };

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

    if (updates.customerSignature ) {
      updates.customerSignedAt = now;
    }

    if (updates.repSignature) {
      updates.repSignedAt = now;
    }
  

    const existing: Doc<"waivers"> | null = await ctx.db
      .query("waivers")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    const status = updates.customerSignature ? "completed" : "pending";


    if (existing) {
      await ctx.db.patch(existing._id, {...updates, status} );
    } else {
      await ctx.db.insert("waivers", {
        moveId,
        ...updates,
        status,
      });
    }

    if (updates.customerSignature) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "WAIVER_SIGNED",
          companyId: company._id,
          body: `**${moveCustomer.name}** signed waiver`,
          moveCustomerId: moveCustomer._id,

          moveId,
        },
      });
    }

    return true;
  },
});

export const customerSignWaiver = action({
  args: {
    waiverId: v.id("waivers"),
    updates: v.object({
      customerSignature: v.string(),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { waiverId } = args;

    const waiver = await ctx.runQuery(internal.waivers.getWaiverByIdInternal, {
      waiverId,
    });
    const validatedWaiver = validateDocExists(
      "waivers",
      waiver,
      "Waiver not found"
    );

    const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
      moveId: validatedWaiver.moveId,
    });

    if (!move) {
      throwConvexError("Move not found", {
        code: "BAD_REQUEST",
        showToUser: true,
      });
    }

    const moveCustomer = await ctx.runQuery(
      internal.moveCustomers.getMoveCustomerByIdInternal,
      {
        moveCustomerId: move.moveCustomerId,
      }
    );
    if (!moveCustomer) {
      throwConvexError("Move customer not found", {
        code: "BAD_REQUEST",
        showToUser: true,
      });
    }

    if (!move.salesRep) {
      throwConvexError("Sales rep not found", {
        code: "BAD_REQUEST",
      });
    }

    const salesRep = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: move.salesRep,
      })
   );


    await ctx.runMutation(internal.waivers.updateWaiverInternal, {
      waiverId: validatedWaiver._id,
      updates: {
        customerSignature: args.updates.customerSignature,
        status: "completed",
      },
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "WAIVER_SIGNED",
        companyId: move.companyId,
        body: `**${moveCustomer.name}** signed waiver`,
        moveCustomerId: move.moveCustomerId,
        moveId: move._id,
      },
    });

    await ctx.runAction(internal.actions.pdf.generatePdf, {
      moveId: move._id,
      documentType: "waiver",
      toEmail: moveCustomer.email,
      ccEmails: [salesRep.email],
      replyToName: salesRep.name,
      subject: "Waiver Signed",
      bodyText: "Waiver signed",
    });

    return true;
  },
});

export const getWaiverByMoveIdInternal = internalQuery({
  args: {
    moveId: v.id("moves"),
  },
  handler: async (ctx, args): Promise<Doc<"waivers"> | null> => {
    const { moveId } = args;
    const waiver = await ctx.db
      .query("waivers")
      .withIndex("by_move", (q) => q.eq("moveId", moveId))
      .unique();
    return waiver;
  },
});

export const getWaiverByIdInternal = internalQuery({
  args: {
    waiverId: v.id("waivers"),
  },
  handler: async (ctx, args): Promise<Doc<"waivers"> | null> => {
    const { waiverId } = args;
    return await ctx.db.get(waiverId);
  },
});

export const updateWaiverInternal = internalMutation({
  args: {
    waiverId: v.id("waivers"),
    updates: v.object({
      customerSignature: v.string(),
      status: v.optional(WaiverStatusConvex),
    }),
  },
  handler: async (ctx, args): Promise<void> => {
    const { waiverId } = args;
    const updates: Partial<Doc<"waivers">> = {
      ...args.updates,
      customerSignedAt: Date.now(),
    };
    await ctx.db.patch(waiverId, updates);
  },
});
