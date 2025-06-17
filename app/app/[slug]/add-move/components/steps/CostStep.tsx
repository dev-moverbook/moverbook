import FormActions from "@/app/components/shared/FormActions";
import React from "react";
import TrucksAndMovers from "../sections/TrucksAndMovers";
import Deposit from "../sections/Deposit";
import InternalNotes from "../sections/InternalNotes";
import Header2 from "@/app/components/shared/heading/Header2";
import FormContainer from "@/app/components/shared/containers/FormContainer";
import LineItems from "../sections/LineItems";
import LiabilityCoverage from "../sections/LiabilityCoverage";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import CostSummary from "../sections/CostSummary";
import { InsurancePolicySchema } from "@/types/convex-schemas";

interface CostStepProps {
  onNext: () => void;
  onBack: () => void;
  isSaving?: boolean;
  saveError?: string | null;
}

const CostStep = ({ onNext, onBack, isSaving, saveError }: CostStepProps) => {
  const {
    isCostSectionComplete,
    isTruckAndMoverCompleted,
    truckCount,
    moversCount,
    startingHour,
    endingHour,
    jobType,
    jobTypeRate,
    jobTypeRateError,
    setTruckCount,
    setMoversCount,
    setStartingHour,
    setEndingHour,
    setJobType,
    setJobTypeRate,
    setJobTypeRateError,

    insurancePolicyOptions,
    insurancePolicy,
    setInsurancePolicy,
    isLiabilityCoverageComplete,

    moveFees,
    addMoveFee,
    updateMoveFee,
    deleteMoveFee,
    moveFeeOptions,
    isLoading,
    errorMessage,
  } = useMoveForm();

  const handleSelectPolicy = (policy: InsurancePolicySchema) => {
    setInsurancePolicy(policy);
  };

  return (
    <FormContainer>
      <Header2 isCompleted={isCostSectionComplete}>Costs</Header2>

      <TrucksAndMovers
        truckCount={truckCount}
        moversCount={moversCount}
        startingHour={startingHour}
        endingHour={endingHour}
        jobType={jobType}
        jobTypeRate={jobTypeRate}
        jobTypeRateError={jobTypeRateError}
        isCompleted={isTruckAndMoverCompleted}
        isEditing={true}
        onChange={{
          setTruckCount,
          setMoversCount,
          setStartingHour,
          setEndingHour,
          setJobType,
          setJobTypeRate,
          setJobTypeRateError,
        }}
      />

      <LineItems
        moveFees={moveFees}
        addMoveFee={addMoveFee}
        updateMoveFee={updateMoveFee}
        deleteMoveFee={deleteMoveFee}
        moveFeeOptions={moveFeeOptions}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />

      <LiabilityCoverage
        insurancePolicyOptions={insurancePolicyOptions}
        insurancePolicy={insurancePolicy}
        onSelectPolicy={handleSelectPolicy}
        isLiabilityCoverageComplete={isLiabilityCoverageComplete}
      />

      <Deposit />
      <InternalNotes />
      <CostSummary />

      <FormActions
        onSave={onNext}
        onCancel={onBack}
        isSaving={isSaving}
        saveLabel="Complete"
        cancelLabel="Back"
        error={saveError}
      />
    </FormContainer>
  );
};

export default CostStep;
