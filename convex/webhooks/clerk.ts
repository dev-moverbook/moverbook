import { GenericActionCtx } from "convex/server";
import { OrganizationInvitationJSON, UserJSON } from "@clerk/backend";
import { ErrorMessages } from "@/types/errors";
import { internal } from "../_generated/api";
import { ClerkRoles, InvitationStatus } from "@/types/enums";
import { validateDocExists, validateUser } from "../backendUtils/validate";
import { updateClerkUserPublicMetadata } from "../backendUtils/clerk";

export const handleOrganizationInvitationAccepted = async (
  ctx: GenericActionCtx<any>,
  data: OrganizationInvitationJSON
) => {
  try {
    const invitation = await ctx.runMutation(
      internal.invitations.updateInvitationByClerkId,
      {
        clerkInvitationId: data.id,
        status: InvitationStatus.ACCEPTED,
      }
    );
    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByEmailInternal, {
        email: data.email_address,
      })
    );

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
        role: data.public_metadata.role,
      }),
    ]);
  } catch (err) {
    console.error("Error handling organizationInvitation.accepted:", err);
    throw new Error(ErrorMessages.CLERK_WEBHOOK_ORG_INV_ACCEPTED);
  }
};

export const handleUserCreated = async (
  ctx: GenericActionCtx<any>,
  data: UserJSON
) => {
  try {
    const customer = await ctx.runQuery(
      internal.customers.viewCustomerByEmail,
      {
        email: data.email_addresses[0].email_address,
      }
    );
    if (!customer) {
      await ctx.runMutation(internal.users.createUser, {
        clerkUserId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      });
    } else {
      await ctx.runMutation(internal.users.createUser, {
        clerkUserId: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        role: ClerkRoles.ADMIN,
        customerId: customer._id,
        imageUrl: data.image_url,
      });
    }
  } catch (err) {
    console.error("Error handling user.created:", err);
    throw new Error(ErrorMessages.CLERK_WEBHOOK_USER_CREATED);
  }
};
