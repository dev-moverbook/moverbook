import { useEffect } from "react";
import { MoveFormData } from "@/types/form-types";

export function useCreditCardFee(
  creditCardFee: { rate: number } | undefined,
  setMoveFormData: React.Dispatch<React.SetStateAction<MoveFormData>>
) {
  useEffect(() => {
    if (!creditCardFee) {
      return;
    }
    setMoveFormData((prev) => ({ ...prev, creditCardFee: creditCardFee.rate }));
  }, [creditCardFee, setMoveFormData]);
}
