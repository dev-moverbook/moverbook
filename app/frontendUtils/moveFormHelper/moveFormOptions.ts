import { SelectOption } from "@/types/types";
import { Doc } from "@/convex/_generated/dataModel";

export function buildSalesRepOptions(
  salesReps?: Doc<"users">[] | null,
  currentUser?: Doc<"users"> | null
): SelectOption[] {
  const base =
    salesReps?.map((rep) => ({
      label: rep.name,
      value: rep._id,
    })) ?? [];

  if (currentUser && !base.some((opt) => opt.value === currentUser._id)) {
    base.push({ label: currentUser.name, value: currentUser._id });
  }

  return base;
}
