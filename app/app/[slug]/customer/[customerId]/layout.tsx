import { notFound } from "next/navigation";
import { normalizeCustomerId } from "@/frontendUtils/normalizeParams";
import { CustomerIdProvider } from "@/contexts/CustomerIdContext";

export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ customerId: string }>;
}) {
  const { customerId: raw } = await params;
  const moveCustomerId = normalizeCustomerId(raw);

  if (!moveCustomerId) {
    notFound();
  }

  return (
    <CustomerIdProvider moveCustomerId={moveCustomerId}>
      {children}
    </CustomerIdProvider>
  );
}
