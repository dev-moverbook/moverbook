import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles } from "@/types/enums";
import {
  EnrichedMoveForMover,
  GetCustomerAndMovesData,
  newCustomerResponse,
} from "@/types/convex-responses";
import { Doc, Id } from "./_generated/dataModel";
import {
  isUserInCompanyConvex,
  isUserInOrg,
  validateCompany,
  validateDocExists,
  validateDocument,
  validateUser,
} from "./backendUtils/validate";
import {
  buildMoverWageForMoveDisplay,
  scopeMovesToMover,
  resolveMoverContext,
} from "./backendUtils/queryHelpers";
import { HourStatus } from "@/types/types";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";
import { throwConvexError } from "./backendUtils/errors";
import { validateAndFormatPhone } from "./backendUtils/helper";

export const searchMoveCustomersAndJobId = query({
  args: {
    companyId: v.id("companies"),
    searchTerm: v.string(),
  },
  handler: async (
    ctx,
    { companyId, searchTerm }
  ): Promise<{
    moveCustomers: Doc<"moveCustomers">[];
    moves: EnrichedMoveForMover[];
  }> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const {
      isMover,
      moverId: signedInMoverId,
      hourlyRate: signedInMoverHourlyRate,
    } = await resolveMoverContext(ctx, identity);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const allCustomers = await ctx.db
      .query("moveCustomers")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .collect();

    const allCompanyMoves = await ctx.db
      .query("moves")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .collect();

    let assignmentMapByMoveId: Map<string, Doc<"moveAssignments">> | undefined;

    let movesScopedToMover: Doc<"moves">[] = allCompanyMoves;

    if (isMover && signedInMoverId) {
      const { moves: scopedMoves, assignmentMap } = await scopeMovesToMover(
        ctx,
        allCompanyMoves,
        signedInMoverId
      );
      movesScopedToMover = scopedMoves;
      assignmentMapByMoveId = assignmentMap;
    }

    const allowedMoveIds: Set<Id<"moves">> | null =
      isMover && signedInMoverId
        ? new Set(movesScopedToMover.map((moveRecord) => moveRecord._id))
        : null;

    const matchingMovesBase = allCompanyMoves
      .filter(
        (moveRecord) =>
          (allowedMoveIds ? allowedMoveIds.has(moveRecord._id) : true) &&
          (moveRecord.jobId?.toLowerCase().includes(normalizedSearch) ?? false)
      )
      .slice(0, 10);

    const enrichedMoves: EnrichedMoveForMover[] =
      isMover && signedInMoverId && assignmentMapByMoveId
        ? matchingMovesBase.map((moveRecord) => {
            const assignment = assignmentMapByMoveId!.get(moveRecord._id);
            return {
              ...moveRecord,
              moverWageForMove: assignment
                ? buildMoverWageForMoveDisplay(
                    moveRecord,
                    assignment,
                    signedInMoverHourlyRate
                  )
                : undefined,
              hourStatus: (assignment?.hourStatus as HourStatus) ?? undefined,
            };
          })
        : (matchingMovesBase as EnrichedMoveForMover[]);

    const allowedCustomerIdsForMover = allowedMoveIds
      ? new Set(
          allCompanyMoves
            .filter((moveRecord) => allowedMoveIds!.has(moveRecord._id))
            .map((moveRecord) => moveRecord.moveCustomerId)
        )
      : null;

    const matchingCustomers = allCustomers
      .filter(
        (customerRecord) =>
          (allowedCustomerIdsForMover
            ? allowedCustomerIdsForMover.has(customerRecord._id)
            : true) &&
          ((customerRecord.name?.toLowerCase().includes(normalizedSearch) ??
            false) ||
            (customerRecord.email?.toLowerCase().includes(normalizedSearch) ??
              false) ||
            (customerRecord.phoneNumber
              ?.toLowerCase()
              .includes(normalizedSearch) ??
              false))
      )
      .slice(0, 10);

    return {
      moveCustomers: matchingCustomers,
      moves: enrichedMoves,
    };
  },
});

export const createMoveCustomer = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    altPhoneNumber: v.optional(v.string()),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<newCustomerResponse> => {
    const { name, email, phoneNumber, altPhoneNumber, companyId } = args;

    const validatedPhoneNumber = validateAndFormatPhone(phoneNumber, "US");

    let validatedAltPhoneNumber: string | undefined;
    if (altPhoneNumber) {
      validatedAltPhoneNumber = validateAndFormatPhone(altPhoneNumber, "US");
    }

    const byEmail: Doc<"moveCustomers"> | null = await ctx.db
      .query("moveCustomers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (byEmail) {
      return {
        moveCustomer: byEmail,
        isExistingCustomer: true,
      };
    }

    const byPhone: Doc<"moveCustomers"> | null = await ctx.db
      .query("moveCustomers")
      .withIndex("by_phoneNumber", (q) =>
        q.eq("phoneNumber", validatedPhoneNumber)
      )
      .first();

    if (byPhone) {
      return {
        moveCustomer: byPhone,
        isExistingCustomer: true,
      };
    }

    const moveCustomerId = await ctx.db.insert("moveCustomers", {
      name,
      email,
      phoneNumber: validatedPhoneNumber,
      altPhoneNumber: validatedAltPhoneNumber,
      isActive: true,
      updatedAt: Date.now(),
      companyId,
    });

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "CUSTOMER_CREATED",
          companyId,
          moveCustomerId,
          body: `A new customer, **${name}** was created.`,
        },
      });
      const moveCustomer = await validateDocument(
        ctx.db,
        "moveCustomers",
        moveCustomerId,
        ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
      );
      return {
        moveCustomer: moveCustomer,
        isExistingCustomer: false,
      };
    }
    const identityVerified = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const currentUserId = identityVerified.convexId as Id<"users">;

    const user = validateUser(await ctx.db.get(currentUserId));
    isUserInCompanyConvex(user, companyId);

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_CREATED_BY_REP",
        companyId,
        moveCustomerId,
        userId: user._id,
        body: `**${user.name}** created a new customer, **${name}**`,
      },
    });

    const moveCustomer = await validateDocument(
      ctx.db,
      "moveCustomers",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    return {
      moveCustomer: moveCustomer,
      isExistingCustomer: false,
    };
  },
});

export const updateMoveCustomer = mutation({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    companyId: v.id("companies"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      altPhoneNumber: v.optional(v.string()),
    }),
    moveId: v.optional(v.id("moves")),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveCustomerId, updates, companyId, moveId } = args;

    const identityVerified = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const currentUserId = identityVerified.convexId as Id<"users">;

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: currentUserId,
      })
    );
    isUserInCompanyConvex(user, companyId);

  
      const existingMoveCustomer = await ctx.runQuery(internal.moveCustomers.getMoveCustomerByIdInternal, {
        moveCustomerId,
      });

      if (!existingMoveCustomer) {
        throwConvexError(ErrorMessages.MOVE_CUSTOMER_NOT_FOUND, {
          code: "NOT_FOUND",
          showToUser: true,
        });
      }

    if (updates.email && updates.email !== existingMoveCustomer.email) {
      const emailTaken = await ctx.db.query("moveCustomers")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .first();

      if (emailTaken) {
        throwConvexError(ErrorMessages.CUSTOMER_EMAIL_TAKEN, {
          code: "CONFLICT",
          showToUser: true,
        });
      }
    }

    let validatedPhoneNumber: string | undefined;
    if (updates.phoneNumber !== undefined) {
      validatedPhoneNumber = validateAndFormatPhone(updates.phoneNumber, "US");

      if (validatedPhoneNumber !== existingMoveCustomer.phoneNumber) {
        const phoneTaken = await ctx.runQuery(
          internal.moveCustomers.getMoveCustomerByPhoneNumberInternal,
          { phoneNumber: validatedPhoneNumber }
        );

        if (phoneTaken) {
          throwConvexError(ErrorMessages.CUSTOMER_PHONE_TAKEN, {
            code: "CONFLICT",
            showToUser: true,
          });
        }
      }
    }

    let validatedAltPhoneNumber: string | undefined;
    if (updates.altPhoneNumber !== undefined) {
      const trimmed = updates.altPhoneNumber.trim();
      if (trimmed === "") {
        validatedAltPhoneNumber = undefined;
      } else {
        validatedAltPhoneNumber = validateAndFormatPhone(trimmed, "US");
      }
    }

    if (
      existingMoveCustomer._id !== undefined &&
      updates.name &&
      updates.name !== existingMoveCustomer.name
    ) {
      await ctx.runMutation(internal.moveCustomers.updateMoveCustomerInternal, {
        moveCustomerId: existingMoveCustomer._id,
        updates: {
          name: updates.name,
        },
      });
    }

    const dbUpdates: Partial<{
      name: string;
      email: string;
      phoneNumber: string;
      altPhoneNumber?: string;
    }> = { ...updates };

    if (validatedPhoneNumber !== undefined) {
      dbUpdates.phoneNumber = validatedPhoneNumber;
    }
    if (validatedAltPhoneNumber !== undefined) {
      dbUpdates.altPhoneNumber = validatedAltPhoneNumber;
    }

    await ctx.runMutation(internal.moveCustomers.updateMoveCustomerInternal, {
      moveCustomerId: existingMoveCustomer._id,
      updates: dbUpdates,
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_UPDATED_BY_REP",
        companyId,
        userId: user._id,
        body: `**${user.name}** updated customer details for **${existingMoveCustomer.name}**.`,
        moveCustomerId,
        moveId,
      },
    });

    return true;
  },
});

export const getMoveCustomer = query({
  args: {
    moveCustomerId: v.id("moveCustomers"),
  },
  handler: async (ctx, { moveCustomerId }): Promise<Doc<"moveCustomers">> => {
    await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const moveCustomer = await validateDocument(
      ctx.db,
      "moveCustomers",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    if (!moveCustomer) {
      throwConvexError(ErrorMessages.MOVE_CUSTOMER_NOT_FOUND, {
        code: "NOT_FOUND",
        showToUser: true,
      });
    }

    return moveCustomer;
  },
});

export const getMoveCustomerByIdInternal = internalQuery({
  args: { moveCustomerId: v.id("moveCustomers") },
  handler: async (ctx, args): Promise<Doc<"moveCustomers">> => {
    const { moveCustomerId } = args;
    const moveCustomer = await validateDocument(
      ctx.db,
      "moveCustomers",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    return moveCustomer;
  },
});

export const getCustomerAndMoves = query({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    slug: v.string(),
  },
  handler: async (
    ctx,
    { moveCustomerId, slug }
  ): Promise<GetCustomerAndMovesData> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const moveCustomer = await validateDocument(
      ctx.db,
      "moveCustomers",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );
    const company = await ctx.runQuery(
      internal.companies.getCompanyBySlugInternal,
      { slug }
    );
    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const {
      isMover,
      moverId: selfMoverId,
      hourlyRate: selfHourlyRate,
    } = await resolveMoverContext(ctx, identity);

    const baseMoves: Doc<"moves">[] = await ctx.db
      .query("moves")
      .withIndex("by_moveCustomerIdAndCompanyId", (index) =>
        index
          .eq("moveCustomerId", moveCustomerId)
          .eq("companyId", validatedCompany._id)
      )
      .collect();

    if (!isMover || !selfMoverId) {
      return {
        moveCustomer,
        moves: baseMoves,
      };
    }

    const { moves: scopedMoves, assignmentMap } = await scopeMovesToMover(
      ctx,
      baseMoves,
      selfMoverId
    );

    const moves: EnrichedMoveForMover[] = scopedMoves.map((moveRecord) => {
      const assignment = assignmentMap.get(moveRecord._id);
      return {
        ...moveRecord,
        moverWageForMove: assignment
          ? buildMoverWageForMoveDisplay(moveRecord, assignment, selfHourlyRate)
          : undefined,
        hourStatus: (assignment?.hourStatus as HourStatus) ?? undefined,
      };
    });

    return {
      moveCustomer,
      moves,
    };
  },
});


export const getExistingMoveCustomerInternal = internalQuery({
  args: {
    email: v.string(),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"moveCustomers"> | null> => {
    const { email, phoneNumber } = args;

    const existingCustomerByEmail = await ctx.db
      .query("moveCustomers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingCustomerByEmail) {
      return existingCustomerByEmail;
    }

    const existingCustomerByPhone = await ctx.db
      .query("moveCustomers")
      .withIndex("by_phoneNumber", (q) => q.eq("phoneNumber", phoneNumber))
      .first();

    if (existingCustomerByPhone) {
      return existingCustomerByPhone;
    }

    return null;
  },
});

export const createMoveCustomerInternal = internalMutation({
  args: {
    email: v.string(),
    phoneNumber: v.string(),
    name: v.string(),
    altPhoneNumber: v.optional(v.string()),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Id<"moveCustomers">> => {
    const { email, phoneNumber, name, altPhoneNumber, companyId } = args;
    const moveCustomerId = await ctx.db.insert("moveCustomers", {
      email,
      phoneNumber,
      name,
      altPhoneNumber,
      isActive: true,
      updatedAt: Date.now(),
      companyId,
    });
    return moveCustomerId;
  },
});

export const updateUserAsCustomer = mutation({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    companyId: v.id("companies"),
    moveId: v.id("moves"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      altPhoneNumber: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveCustomerId, updates, moveId, companyId } = args;

    const existingMoveCustomer = 
      await ctx.runQuery(internal.moveCustomers.getMoveCustomerByIdInternal, {
        moveCustomerId,
      })
    if (!existingMoveCustomer) {
      throwConvexError(ErrorMessages.MOVE_CUSTOMER_NOT_FOUND, {
        code: "NOT_FOUND",
        showToUser: true,
      });
    }


    if (updates.email && updates.email !== existingMoveCustomer.email) {
      const emailTaken = await ctx.db.query("moveCustomers")
        .withIndex("by_email", (q) => q.eq("email", updates.email!))
        .first();

      if (emailTaken) {
        throwConvexError(ErrorMessages.CUSTOMER_EMAIL_TAKEN, {
          code: "CONFLICT",
          showToUser: true,
        });
      }
    }

    if (
      updates.phoneNumber &&
      updates.phoneNumber !== existingMoveCustomer.phoneNumber
    ) {
      const phoneTaken = await ctx.runQuery(
        internal.moveCustomers.getMoveCustomerByPhoneNumberInternal,
        {
          phoneNumber: updates.phoneNumber!,
        }
      );

      if (phoneTaken) {
        throwConvexError(ErrorMessages.CUSTOMER_PHONE_TAKEN, {
          code: "CONFLICT",
          showToUser: true,
        });
      }
    }

    await ctx.db.patch(moveCustomerId, updates);

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_UPDATED",
        companyId: companyId,
        moveCustomerId: existingMoveCustomer._id,
        body: `**${existingMoveCustomer.name}** updated their details.`,
        moveId,
      },
    });

    return true;
  },
});


export const getMoveCustomerByPhoneNumberInternal = internalQuery({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args): Promise<Doc<"moveCustomers"> | null> => {
    const { phoneNumber } = args;
    return ctx.db
      .query("moveCustomers")
      .withIndex("by_phoneNumber", (q) => q.eq("phoneNumber", phoneNumber))
      .first();
  },
});


export const updateMoveCustomerInternal = internalMutation({
  args: {
    moveCustomerId: v.id("moveCustomers"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      altPhoneNumber: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<void> => {
    const { moveCustomerId, updates } = args;
    await ctx.db.patch(moveCustomerId, updates);
  },
});