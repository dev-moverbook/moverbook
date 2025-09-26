import { ErrorMessages } from "@/types/errors";
import {
  OrganizationMembership,
  User,
  createClerkClient,
  Invitation,
  Organization,
  OrganizationInvitation,
} from "@clerk/backend";
import { UserRole } from "@/types/enums";
import { getBaseUrl } from "@/utils/helper";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error(ErrorMessages.ENV_CLERK_SECRET_KEY_NOT_SET);
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// for admin users
export async function sendClerkInvitation(email: string): Promise<Invitation> {
  const baseUrl = getBaseUrl();
  const redirectUrl = `${baseUrl}/accept-invite`;
  try {
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      ignoreExisting: true,
      redirectUrl,
      publicMetadata: {
        role: UserRole.ADMIN,
      },
    });

    return invitation;
  } catch (error) {
    console.error(ErrorMessages.CLERK_INVITATION_SENT_ERROR, error);
    throw new Error(ErrorMessages.CLERK_INVITATION_SENT_ERROR);
  }
}

export async function createClerkOrganization(
  name: string,
  clerkUserId: string
): Promise<Organization> {
  try {
    const organization = await clerkClient.organizations.createOrganization({
      name,
    });

    await clerkClient.organizations.createOrganizationMembership({
      organizationId: organization.id,
      userId: clerkUserId,
      role: "org:admin",
    });

    return organization;
  } catch (error) {
    console.error(ErrorMessages.CLERK_ORG_CREATE_ERROR, error);
    throw new Error(ErrorMessages.CLERK_ORG_CREATE_ERROR);
  }
}

export async function clerkInviteUserToOrganizationHelper(
  clerkOrgId: string,
  email: string,
  role: string
): Promise<OrganizationInvitation> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(
      `https://api.clerk.com/v1/organizations/${clerkOrgId}/invitations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
        body: JSON.stringify({
          email_address: email,
          role: "org:member",
          public_metadata: {
            role,
          },
          redirect_url: `${baseUrl}/accept-invite`,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to create invitation: ${await response.text()}`);
    }

    return response.json();
  } catch (error) {
    console.error(ErrorMessages.CLERK_ORG_INVITATION_ERROR, error);
    throw new Error(ErrorMessages.CLERK_ORG_INVITATION_ERROR);
  }
}

export async function revokeOrganizationInvitation(
  organization_id: string,
  invitation_id: string
): Promise<OrganizationInvitation> {
  try {
    const response = await fetch(
      `https://api.clerk.com/v1/organizations/${organization_id}/invitations/${invitation_id}/revoke`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to revoke invitation: ${await response.text()}`);
    }

    return response.json();
  } catch (error) {
    console.error("Clerk error inviting user to organization", error);
    throw new Error(ErrorMessages.CLERK_ORG_REVOKE_ERROR);
  }
}

export async function updateOrganizationMembershipHelper(
  clerkOrgId: string,
  clerkUserId: string,
  role: string
): Promise<OrganizationMembership> {
  try {
    const response =
      await clerkClient.organizations.updateOrganizationMembership({
        organizationId: clerkOrgId,
        userId: clerkUserId,
        role,
      });

    return response;
  } catch (error) {
    console.error(ErrorMessages.CLERK_ORG_UPDATE_MEMBERSHIP, error);
    throw new Error(ErrorMessages.CLERK_ORG_UPDATE_MEMBERSHIP);
  }
}

export async function updateUserNameHelper(
  clerkUserId: string,
  fullName: string
): Promise<User> {
  try {
    const [firstName, ...lastNameParts] = fullName.trim().split(" ");
    const lastName = lastNameParts.join(" ") || "";

    const response = await clerkClient.users.updateUser(clerkUserId, {
      firstName,
      lastName,
    });

    return response;
  } catch (error) {
    console.error(error);
    throw new Error(ErrorMessages.CLERK_UPDATE_NAME);
  }
}

export async function updateClerkOrgName(
  clerkOrgId: string,
  name: string
): Promise<Organization> {
  try {
    const updatedOrganization =
      await clerkClient.organizations.updateOrganization(clerkOrgId, {
        name,
      });
    return updatedOrganization;
  } catch (error) {
    console.error(ErrorMessages.CLERK_ORG_UPDATE_NAME, error);
    throw new Error(ErrorMessages.CLERK_ORG_UPDATE_NAME);
  }
}

export async function updateClerkUserPublicMetadata(
  userId: string,
  newMetadata: Record<string, any>
): Promise<void> {
  try {
    const user = await clerkClient.users.getUser(userId);
    const currentMetadata = user.publicMetadata || {};
    const mergedMetadata = { ...currentMetadata, ...newMetadata };

    await clerkClient.users.updateUser(userId, {
      publicMetadata: mergedMetadata,
    });
  } catch (error) {
    console.error(
      `Failed to update public metadata for user ${userId}:`,
      error
    );
    throw new Error(ErrorMessages.CLERK_USER_METADATA_UPDATE_ERROR);
  }
}
