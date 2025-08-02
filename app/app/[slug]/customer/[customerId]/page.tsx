import { Id } from "@/convex/_generated/dataModel";
import CustomerPageClient from "./CustomerPageClient";

const CustomerPage = async ({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) => {
  const { customerId } = await params; // ✅ correct: await the params Promise
  return <CustomerPageClient customerId={customerId as Id<"moveCustomers">} />;
};

export default CustomerPage;
