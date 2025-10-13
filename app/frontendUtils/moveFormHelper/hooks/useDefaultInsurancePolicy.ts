import { useEffect } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { MoveFormData } from "@/types/form-types";

export function useDefaultInsurancePolicy(
  insurancePolicyOptions: Doc<"insurancePolicies">[] | undefined,
  setMoveFormData: React.Dispatch<React.SetStateAction<MoveFormData>>
) {
  useEffect(() => {
    if (!insurancePolicyOptions || insurancePolicyOptions.length === 0) {
      return;
    }

    setMoveFormData((prev) => {
      if (prev.liabilityCoverage?._id) {
        return prev;
      }

      const defaultPolicy =
        insurancePolicyOptions.find((policy) => policy.isDefault) ||
        insurancePolicyOptions.find((policy) => policy.isActive);

      if (!defaultPolicy) {
        return prev;
      }

      return {
        ...prev,
        liabilityCoverage: defaultPolicy,
      };
    });
  }, [insurancePolicyOptions, setMoveFormData]);
}
