import { InsurancePolicySchema } from "@/types/convex-schemas";
import LocationSection from "../section/LocationSection";
import InventorySection from "../section/InventorySection";
import CostSection from "../section/CostSection";
import InternalNotesSection from "../section/InternalNotes";
import MoveTypeSection from "../section/MoveTypeSection";
import DepositSection from "../section/DepositSection";
import LineItemSection from "../section/MoveLineItemsSection";
import CustomerInfo from "@/app/components/customer/CustomerInfo";
import { useMoveContext } from "@/app/contexts/MoveContext";
import LiabilityCoverageSection from "@/app/components/move/sections/LiabilityCoverageSection";
import { useUpdateMove } from "../../../hooks/useUpdateMove";
import { useCompanyInsurance } from "@/app/hooks/queries/useCompanyInsurance";
import StepStatus from "../shared/StepStatus";
import { hasRequiredMoveFields } from "@/app/frontendUtils/helper";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import LaborSection, {
  LaborFormData,
} from "@/app/components/move/sections/LaborSection";
import { useState } from "react";
import ViewTravelFee from "../section/ViewTravelFee";
import ViewCreditCardFee from "../section/ViewCreditCardFee";

interface LeadStepProps {}

const LeadStep = ({}: LeadStepProps) => {
  const { moveData } = useMoveContext();
  const move = moveData.move;
  const moveCustomer = moveData.moveCustomer;
  const { updateMove, updateMoveError } = useUpdateMove();
  const roundTripDrive = move.roundTripDrive;
  const { data: insurancePolicyOptions } = useCompanyInsurance(move.companyId);

  const handleSelectPolicy = (policy: InsurancePolicySchema) => {
    updateMove({ moveId: move._id, updates: { liabilityCoverage: policy } });
  };

  const [laborData, setLaborData] = useState<LaborFormData>({
    jobType: move.jobType,
    jobTypeRate: move.jobTypeRate,
    trucks: move.trucks,
    movers: move.movers,
    startingMoveTime: move.startingMoveTime,
    endingMoveTime: move.endingMoveTime,
  });

  const handleLaborChange = <K extends keyof LaborFormData>(
    key: K,
    value: (typeof laborData)[K]
  ) => {
    setLaborData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (): Promise<boolean> => {
    const cleanLaborData = {
      ...laborData,
      movers: laborData.movers ?? undefined,
      startingMoveTime: laborData.startingMoveTime ?? undefined,
      endingMoveTime: laborData.endingMoveTime ?? undefined,
    };

    const result = await updateMove({
      moveId: move._id,
      updates: cleanLaborData,
    });
    return result.success;
  };

  const isComplete = hasRequiredMoveFields(move, moveCustomer);
  const leadStatus = isComplete
    ? "Information Complete"
    : "Missing Information";
  const leadStatusIcon = isComplete ? (
    <CheckCircle2 className="w-4 h-4 text-greenCustom" />
  ) : (
    <AlertTriangle className="w-4 h-4 text-yellow-500" />
  );

  return (
    <div className="pb-4">
      <StepStatus
        items={[
          {
            label: "Lead Status",
            value: leadStatus,
            icon: leadStatusIcon,
          },
        ]}
      />
      <CustomerInfo moveCustomer={moveCustomer} showCheckmark={true} />
      <MoveTypeSection />
      <LocationSection />
      <InventorySection />
      <LaborSection
        isAdd={false}
        formData={laborData}
        onChange={handleLaborChange}
        errors={{}}
        setErrors={() => {}}
        isSaving={false}
        updateError={updateMoveError}
        onSave={handleSave}
        roundTripDrive={roundTripDrive}
      />
      <ViewTravelFee />
      <ViewCreditCardFee />
      <LiabilityCoverageSection
        selectedPolicy={move.liabilityCoverage}
        policies={insurancePolicyOptions?.insurancePolicies ?? []}
        onSelect={handleSelectPolicy}
        error={updateMoveError}
      />

      <LineItemSection />
      <DepositSection />

      <CostSection />
      <InternalNotesSection />
    </div>
  );
};

export default LeadStep;
