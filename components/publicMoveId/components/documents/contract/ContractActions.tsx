"use client";

import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import { Id } from "@/convex/_generated/dataModel";
import { useCustomerSignContract } from "@/hooks/contracts";

interface ContractActionsProps {
  signatureDataUrl: string | null;
  contractId: Id<"contracts">;
}

const ContractActions = ({
  signatureDataUrl,
  contractId,
}: ContractActionsProps) => {
  const {
    customerSignContract,
    customerSignContractError,
    customerSignContractLoading,
  } = useCustomerSignContract();

  const handleSubmit = async () => {
    if (signatureDataUrl) {
      await customerSignContract(contractId, {
        customerSignature: signatureDataUrl,
      });
    }
  };
  return (
    <SingleFormAction
      submitLabel="Submit"
      onSubmit={handleSubmit}
      isSubmitting={customerSignContractLoading}
      error={customerSignContractError}
      disabled={!signatureDataUrl}
    />
  );
};

export default ContractActions;
