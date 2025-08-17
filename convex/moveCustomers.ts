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
import { Doc } from "./_generated/dataModel";
import {
  isUserInOrg,
  validateCompany,
  validateMoveCustomer,
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
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const normalized = searchTerm.toLowerCase();

      // --- Search customers
      const allCustomers = await ctx.db
        .query("moveCustomers")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .collect();

      const matchingCustomers = allCustomers.filter((customer) => {
        return (
          (customer.name?.toLowerCase().includes(normalized) ?? false) ||
          (customer.email?.toLowerCase().includes(normalized) ?? false) ||
          (customer.phoneNumber?.toLowerCase().includes(normalized) ?? false)
        );
      });

      // --- Search moves by jobId
      const allMoves = await ctx.db
        .query("move")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .collect();

      const matchingMoves = allMoves.filter((move) =>
        move.jobId?.toLowerCase().includes(normalized)
      );

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          moveCustomers: matchingCustomers.slice(0, 10),
          moves: matchingMoves.slice(0, 10),
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

      // Check for unique email (excluding current customer)
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

      // Check for unique phone number (excluding current customer)
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
      ]);

      const moveCustomer = validateMoveCustomer(
        await ctx.db.get(moveCustomerId)
      );
      const company = validateCompany(await ctx.db.get(moveCustomer.companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const moves: Doc<"move">[] = await ctx.db
        .query("move")
        .withIndex("by_moveCustomerId", (q) =>
          q.eq("moveCustomerId", moveCustomerId)
        )
        .collect();

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
