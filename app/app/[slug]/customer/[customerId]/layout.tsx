import { CustomerIdProvider } from "@/app/contexts/CustomerIdContext";
import { normalizeCustomerId } from "@/app/frontendUtils/normalizeParams";
import { notFound } from "next/navigation";
import { use } from "react";

export default function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ customerId: string }>;
}) {
  const { customerId: raw } = use(params);
  const customerId = normalizeCustomerId(raw);
  if (!customerId) {
    notFound();
  }
  return (
    <CustomerIdProvider customerId={customerId}>{children}</CustomerIdProvider>
  );
}
