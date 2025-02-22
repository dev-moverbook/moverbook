import { ErrorMessage } from "@/types/errors";
import { createClerkClient } from "@clerk/backend";
import { Invitation } from "@clerk/nextjs/server";
import { getBaseUrl } from "./helper";

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
