import { notFound } from "next/navigation";
import { use } from "react";
import { normalizeUserId } from "@/app/frontendUtils/normalizeParams";
import { UserIdProvider } from "@/app/contexts/UserIdContext";

export default function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId: raw } = use(params);
  const userId = normalizeUserId(raw);
  if (!userId) {
    notFound();
  }

  return <UserIdProvider userId={userId}>{children}</UserIdProvider>;
}
