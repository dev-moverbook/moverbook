import { internalQuery, mutation } from "./_generated/server";
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

    const moveCustomer = validateMoveCustomer(
      await ctx.db.get(move.moveCustomerId)
    );

    if (existing) {
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("waivers", {
        moveId,
        ...updates,
      });
    }

    if (updates.customerSignature) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "WAIVER_SIGNED",
          companyId: company._id,
          body: `**${moveCustomer.name}** signed waiver`,
          moveCustomerId: move.moveCustomerId,

          moveId,
        },
      });
    }

    return true;
  },
});

// To Be Deleted
// export const sendWaiver = action({
//   args: {
//     moveId: v.id("moves"),
//     channel: v.union(v.literal("email"), v.literal("sms")),
//   },
//   handler: async (ctx, args): Promise<boolean> => {
//     const identity = await requireAuthenticatedUser(ctx, [
//       ClerkRoles.ADMIN,
//       ClerkRoles.APP_MODERATOR,
//       ClerkRoles.MANAGER,
//       ClerkRoles.SALES_REP,
//       ClerkRoles.MOVER,
//     ]);

//     const move = await ctx.runQuery(internal.moves.getMoveByIdInternal, {
//       moveId: args.moveId,
//     });
//     const validatedMove = validateDocExists(
//       "moves",
//       move,
//       ErrorMessages.MOVE_NOT_FOUND
//     );

//     const company = await ctx.runQuery(
//       internal.companies.getCompanyByIdInternal,
//       {
//         companyId: validatedMove.companyId,
//       }
//     );
//     const validatedCompany = validateDocExists(
//       "companies",
//       company,
//       ErrorMessages.COMPANY_NOT_FOUND
//     );

//     isUserInOrg(identity, validatedCompany.clerkOrganizationId);

//     const user = validateUser(
//       await ctx.runQuery(internal.users.getUserByIdInternal, {
//         userId: identity.convexId as Id<"users">,
//       })
//     );

//     const moveCustomer = await ctx.runQuery(
//       internal.moveCustomers.getMoveCustomerByIdInternal,
//       {
//         moveCustomerId: validatedMove.moveCustomerId,
//       }
//     );

//     if (args.channel === "email") {
//       // TODO: Send waiver email
//     } else if (args.channel === "sms") {
//       // TODO: Send waiver SMS
//     }
//     await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
//       entry: {
//         type: "WAIVER_SENT",
//         companyId: validatedCompany._id,
//         body: `**${user.name}** sent waiver to **${moveCustomer.name}** via ${args.channel}`,
//         moveId: validatedMove._id,
//         context: {
//           customerName: moveCustomer.name,
//           deliveryType: args.channel,
//           salesRepName: user.name,
//         },
//         userId: user._id,
//       },
//     });

//     return true;
//   },
// });

export const customerSignWaiver = mutation({
  args: {
    waiverId: v.id("waivers"),
    updates: v.object({
      customerSignature: v.string(),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { waiverId } = args;
    const updates: Partial<Doc<"waivers">> = {
      ...args.updates,
      customerSignedAt: Date.now(),
    };

    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);

    const waiver = await ctx.db.get(waiverId);
    const validatedWaiver = validateDocExists(
      "waivers",
      waiver,
      "Waiver not found"
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
      validatedWaiver.moveId,
      ErrorMessages.MOVE_NOT_FOUND
    );

    isIdentityInMove(identity, move);

    await ctx.db.patch(validatedWaiver._id, updates);

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "WAIVER_SIGNED",
        companyId: move.companyId,
        body: `**${moveCustomer.name}** signed waiver`,
        moveCustomerId: move.moveCustomerId,
        moveId: move._id,
      },
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
