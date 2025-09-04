import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import { handleInternalError } from "./backendUtils/helper";
import {
  CreateMoveCustomerResponse,
  GetCustomerAndMovesResponse,
  GetMoveCustomerResponse,
  SearchMoveCustomersAndJobIdResponse,
  UpdateMoveCustomerResponse,
} from "@/types/convex-responses";
import { Doc, Id } from "./_generated/dataModel";
import {
  isUserInOrg,
  validateCompany,
  validateMoveCustomer,
  validateUser,
} from "./backendUtils/validate";
import { ErrorMessages } from "@/types/errors";

export const createMoveCustomer = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    altPhoneNumber: v.union(v.string(), v.null()),
    referral: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args): Promise<CreateMoveCustomerResponse> => {
    const { name, email, phoneNumber, altPhoneNumber, referral, companyId } =
      args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const company = validateCompany(await ctx.db.get(args.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const byEmail: Doc<"moveCustomers"> | null = await ctx.db
        .query("moveCustomers")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      if (byEmail) {
        return {
          status: ResponseStatus.SUCCESS,
          data: {
            moveCustomer: byEmail,
          },
        };
      }

      const byPhone: Doc<"moveCustomers"> | null = await ctx.db
        .query("moveCustomers")
        .withIndex("by_phone", (q) => q.eq("phoneNumber", phoneNumber))
        .first();

      if (byPhone) {
        return {
          status: ResponseStatus.SUCCESS,
          data: {
            moveCustomer: byPhone,
          },
        };
      }

      const moveCustomerId = await ctx.db.insert("moveCustomers", {
        name,
        email,
        phoneNumber,
        altPhoneNumber,
        referral,
        companyId,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          moveCustomerId,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const searchMoveCustomersAndJobId = query({
  args: {
    companyId: v.id("companies"),
    searchTerm: v.string(),
  },
  handler: async (
    ctx,
    { companyId, searchTerm }
  ): Promise<SearchMoveCustomersAndJobIdResponse> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.MOVER,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const isMover = identity.role === ClerkRoles.MOVER;

      const clerkId = identity.id as string;
      let moverId: Id<"users"> | null = null;

      if (isMover) {
        const user = validateUser(
          await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkId))
            .first()
        );
        moverId = user._id;
      }

      const normalized = searchTerm.toLowerCase();

      const allCustomers = await ctx.db
        .query("moveCustomers")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .collect();

      const allMoves = await ctx.db
        .query("move")
        .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
        .collect();

      let allowedMoveIds: Set<Id<"move">> | null = null;
      if (isMover && moverId) {
        const assignments = await ctx.db
          .query("moveAssignments")
          .withIndex("by_mover", (q) => q.eq("moverId", moverId))
          .collect();
        allowedMoveIds = new Set(assignments.map((a) => a.moveId));
      }

      const matchingMoves = allMoves
        .filter(
          (m) =>
            (allowedMoveIds ? allowedMoveIds.has(m._id) : true) &&
            (m.jobId?.toLowerCase().includes(normalized) ?? false)
        )
        .slice(0, 10);

      const allowedCustomerIds = allowedMoveIds
        ? new Set(
            allMoves
              .filter((m) => allowedMoveIds!.has(m._id))
              .map((m) => m.moveCustomerId)
          )
        : null;

      const matchingCustomers = allCustomers
        .filter(
          (c) =>
            (allowedCustomerIds ? allowedCustomerIds.has(c._id) : true) &&
            ((c.name?.toLowerCase().includes(normalized) ?? false) ||
              (c.email?.toLowerCase().includes(normalized) ?? false) ||
              (c.phoneNumber?.toLowerCase().includes(normalized) ?? false))
        )
        .slice(0, 10);

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          moveCustomers: matchingCustomers,
          moves: matchingMoves,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const updateMoveCustomer = mutation({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      altPhoneNumber: v.optional(v.union(v.string(), v.null())),
      referral: v.optional(v.union(v.string(), v.null())),
    }),
  },
  handler: async (ctx, args): Promise<UpdateMoveCustomerResponse> => {
    const { moveCustomerId, updates } = args;

    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);
      const existing = validateMoveCustomer(await ctx.db.get(moveCustomerId));

      const company = validateCompany(await ctx.db.get(existing.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      if (updates.email && updates.email !== existing.email) {
        const emailTaken = await ctx.db
          .query("moveCustomers")
          .withIndex("by_email", (q) => q.eq("email", updates.email!))
          .filter((q) => q.neq(q.field("_id"), moveCustomerId))
          .first();

        if (emailTaken) {
          throw new Error(ErrorMessages.CUSTOMER_EMAIL_TAKEN);
        }
      }

      if (updates.phoneNumber && updates.phoneNumber !== existing.phoneNumber) {
        const phoneTaken = await ctx.db
          .query("moveCustomers")
          .withIndex("by_phone", (q) =>
            q.eq("phoneNumber", updates.phoneNumber!)
          )
          .filter((q) => q.neq(q.field("_id"), moveCustomerId))
          .first();

        if (phoneTaken) {
          throw new Error(ErrorMessages.CUSTOMER_PHONE_TAKEN);
        }
      }

      await ctx.db.patch(moveCustomerId, {
        ...updates,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          moveCustomerId,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getCustomerAndMoves = query({
  args: {
    moveCustomerId: v.id("moveCustomers"),
  },
  handler: async (
    ctx,
    { moveCustomerId }
  ): Promise<GetCustomerAndMovesResponse> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
        ClerkRoles.MOVER,
      ]);

      const moveCustomer = validateMoveCustomer(
        await ctx.db.get(moveCustomerId)
      );
      const company = validateCompany(await ctx.db.get(moveCustomer.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const isMover = identity.role === ClerkRoles.MOVER;

      let moverId: Id<"users"> | null = null;

      if (isMover) {
        const user = validateUser(
          await ctx.db
            .query("users")
            .withIndex("by_clerkUserId", (q) =>
              q.eq("clerkUserId", identity.id as string)
            )
            .first()
        );
        moverId = user._id;
      }

      let moves: Doc<"move">[] = await ctx.db
        .query("move")
        .withIndex("by_moveCustomerId", (q) =>
          q.eq("moveCustomerId", moveCustomerId)
        )
        .collect();

      if (isMover && moverId) {
        const filtered = await Promise.all(
          moves.map(async (m) => {
            const assigned = await ctx.db
              .query("moveAssignments")
              .withIndex("by_move_mover", (q) =>
                q.eq("moveId", m._id).eq("moverId", moverId!)
              )
              .first();
            return assigned ? m : null;
          })
        );
        moves = filtered.filter((m): m is Doc<"move"> => m !== null);
      }

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          moveCustomer,
          moves,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getMoveCustomer = query({
  args: {
    moveCustomerId: v.id("moveCustomers"),
  },
  handler: async (
    ctx,
    { moveCustomerId }
  ): Promise<GetMoveCustomerResponse> => {
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const moveCustomer = validateMoveCustomer(
        await ctx.db.get(moveCustomerId)
      );
      const company = validateCompany(await ctx.db.get(moveCustomer.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          moveCustomer,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getMoveCustomerByIdInternal = internalQuery({
  args: { moveCustomerId: v.id("moveCustomers") },
  handler: async (ctx, args): Promise<Doc<"moveCustomers"> | null> => {
    const { moveCustomerId } = args;
    try {
      return await ctx.db.get(moveCustomerId);
    } catch (error) {
      console.error(ErrorMessages.MOVE_CUSTOMER_DB_QUERY_BY_ID, error);
      throw new Error(ErrorMessages.MOVE_CUSTOMER_DB_QUERY_BY_ID);
    }
  },
});
