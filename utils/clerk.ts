import { ErrorMessage, ErrorMessages } from "@/types/errors";
import { createClerkClient } from "@clerk/backend";
import { Invitation, Organization } from "@clerk/nextjs/server";
import { getBaseUrl } from "./helper";
import { ClerkRoles, UserRole } from "@/types/enums";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error(ErrorMessage.Clerk.Env.Secret);
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function sendClerkInvitation(email: string): Promise<Invitation> {
  const baseUrl = getBaseUrl();
  const redirectUrl = `${baseUrl}/accept-invite`;
  try {
    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      ignoreExisting: true,
      redirectUrl,
    });

    return invitation;
  } catch (error) {
    console.error(ErrorMessage.Clerk.Sdk.InvitationFailed, error);
    throw new Error(ErrorMessage.Clerk.Sdk.InvitationFailed);
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
      role: ClerkRoles.ADMIN,
    });

    return organization;
  } catch (error) {
    console.error(ErrorMessages.CLERK_ORG_CREATE_ERROR, error);
    throw new Error(ErrorMessages.CLERK_ORG_CREATE_ERROR);
  }
}
