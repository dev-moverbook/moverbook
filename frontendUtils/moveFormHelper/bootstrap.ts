import { MoveFormData } from "@/types/form-types";
import { Id } from "@/convex/_generated/dataModel";

export function applyBootstrapDefaults(
  prev: MoveFormData,
  opts: {
    companyId?: Id<"companies"> | null;
    deposit?: number;
    salesRepId?: Id<"users">;
  }
): MoveFormData {
  let next = prev;
  if (opts.companyId) {
    next = { ...next, companyId: opts.companyId };
  }
  if (opts.deposit !== undefined) {
    next = { ...next, deposit: opts.deposit };
  }
  if (opts.salesRepId) {
    next = { ...next, salesRep: opts.salesRepId };
  }
  return next;
}
