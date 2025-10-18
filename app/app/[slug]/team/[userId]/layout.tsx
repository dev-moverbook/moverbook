import { notFound } from "next/navigation";
import { normalizeUserId } from "@/frontendUtils/normalizeParams";
import { UserIdProvider } from "@/contexts/UserIdContext";
import ErrorMessage from "@/components/shared/error/ErrorMessage";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

export default async function UserIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId: raw } = await params;
  const userIdParams = normalizeUserId(raw);

  if (!userIdParams) {
    notFound();
  }

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
  const user = await fetchQuery(
    api.users.getUserById,
    { userId: userIdParams },
    { token }
  );

  return (
    <UserIdProvider userId={userIdParams} user={user}>
      {children}
    </UserIdProvider>
  );
}
