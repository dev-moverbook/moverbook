import ErrorMessage from "@/components/shared/error/ErrorMessage";
import { CustomerIdProvider } from "@/contexts/CustomerIdContext";
import { api } from "@/convex/_generated/api";
import { normalizeCustomerId } from "@/frontendUtils/normalizeParams";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

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
  const moveCustomer = await fetchQuery(
    api.moveCustomers.getCustomerAndMoves,
    { moveCustomerId },
    { token }
  );

  return (
    <CustomerIdProvider moveCustomer={moveCustomer}>
      {children}
    </CustomerIdProvider>
  );
}
