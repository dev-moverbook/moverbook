import { OrganizationInvitationJSON, UserJSON } from "@clerk/backend";
import { ErrorMessages } from "@/types/errors";
import { internal } from "../_generated/api";
import { ClerkRoles, InvitationStatus } from "@/types/enums";
import { validateDocExists, validateUser } from "../backendUtils/validate";
import { updateClerkUserPublicMetadata } from "../functions/clerk";
import { ActionCtx } from "../_generated/server";
import { throwConvexError } from "../backendUtils/errors";

export const handleOrganizationInvitationAccepted = async (
  ctx: ActionCtx,
  data: OrganizationInvitationJSON
) => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 500;

  const retry = async <T>(
    fn: () => Promise<T>,
    retries: number
  ): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0) {
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
        return retry(fn, retries - 1);
      }
      throw err;
    }
  };

  try {
    const invitation = await ctx.runMutation(
      internal.invitations.updateInvitationByClerkId,
      {
        clerkInvitationId: data.id,
        status: InvitationStatus.ACCEPTED,
      }
    );

    const user = await retry(async () => {
      const fetchedUser = await ctx.runQuery(
        internal.users.getUserByEmailInternal,
        {
          email: data.email_address,
        }
      );
      return validateUser(fetchedUser);
    }, MAX_RETRIES);

    if (!user.clerkUserId) {
      throwConvexError("user does not have clerk id", {
        code: "BAD_REQUEST",
      });
    }

    const company = await ctx.runQuery(
      internal.companies.getCompanyClerkOrgIdInternal,
      {
        clerkOrgId: data.organization_id,
      }
    );

    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );

    await Promise.all([
      ctx.runMutation(internal.users.updateUserInternal, {
        userId: user._id,
        updates: {
          role: data.public_metadata.role as ClerkRoles,
          hourlyRate: invitation.hourlyRate || null,
          companyId: validatedCompany._id,
        },
      }),
      updateClerkUserPublicMetadata(user.clerkUserId, {
        role: data.public_metadata.role as string,
        convexId: user._id,
        convexOrgId: validatedCompany._id,
      }),
    ]);
  } catch (err) {
    console.error("Error handling organizationInvitation.accepted:", err);
    throw new Error(ErrorMessages.CLERK_WEBHOOK_ORG_INV_ACCEPTED);
  }
};

export const handleUserCreated = async (ctx: ActionCtx, data: UserJSON) => {
  try {
    const customer = await ctx.runQuery(
      internal.customers.viewCustomerByEmail,
      {
        email: data.email_addresses[0].email_address,
      }
    );
    if (!customer) {
      const userId = await ctx.runMutation(internal.users.createUser, {
        clerkUserId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      });
      await updateClerkUserPublicMetadata(data.id, {
        convexId: userId,
      });
    } else {
      const userId = await ctx.runMutation(internal.users.createUser, {
        clerkUserId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        role: ClerkRoles.ADMIN,
        customerId: customer._id,
        imageUrl: data.image_url,
      });

      await updateClerkUserPublicMetadata(data.id, {
        convexId: userId,
        role: ClerkRoles.ADMIN,
      });
    }
  } catch (err) {
    console.error("Error handling user.created:", err);
    throw new Error(ErrorMessages.CLERK_WEBHOOK_USER_CREATED);
  }
};
