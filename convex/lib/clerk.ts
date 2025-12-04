import { createClerkClient } from "@clerk/backend";
import { serverEnv } from "../backendUtils/serverEnv";

const { CLERK_SECRET_KEY } = serverEnv();

export const clerkClient = createClerkClient({
  secretKey: CLERK_SECRET_KEY,
});
