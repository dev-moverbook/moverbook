import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import ErrorMessage from "@/components/shared/error/ErrorMessage";
import StripePage from "@/components/stripe/StripePage";

export default async function Page() {
  const { userId, getToken } = await auth();
  if (!userId) {
    return (
      <ErrorMessage message={"You must be signed in to view this page."} />
    );
  }

  const token = await getToken({ template: "convex" });

  if (!token) {
    return (
      <ErrorMessage message={"You must be signed in to view this page."} />
    );
  }
  const connectedAccount = await fetchQuery(
    api.connectedAccount.getStripeConnection,
    {},
    { token }
  );

  return (
    <main className="min-h-100vh">
      <StripePage connectedAccount={connectedAccount} />
    </main>
  );
}
