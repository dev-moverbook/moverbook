import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { MoveFormData } from "@/types/form-types";

interface InsurancePolicy {
  _id: Id<"insurancePolicies">;
  _creationTime: number;
  isActive: boolean;
  name: string;
  companyId: Id<"companies">;
  coverageAmount: number;
  coverageType: number;
  isDefault: boolean;
  premium: number;
}

export function useDefaultInsurancePolicy(
  insurancePolicyOptions: InsurancePolicy[] | undefined,
  setMoveFormData: React.Dispatch<React.SetStateAction<any>>
) {
  useEffect(() => {
    if (!insurancePolicyOptions || insurancePolicyOptions.length === 0) {
      return;
    }

    setMoveFormData((prev: MoveFormData) => {
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
