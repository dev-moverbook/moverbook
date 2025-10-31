import { notFound } from "next/navigation";
import { normalizeUserId } from "@/frontendUtils/normalizeParams";
import { UserIdProvider } from "@/contexts/UserIdContext";

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

  return <UserIdProvider userId={userIdParams}>{children}</UserIdProvider>;
}
