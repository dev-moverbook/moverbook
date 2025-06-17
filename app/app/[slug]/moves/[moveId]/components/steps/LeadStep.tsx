import InfoSection from "../section/InfoSection";
import { MoveSchema } from "@/types/convex-schemas";
import LocationSection from "../section/LocationSection";
import InventorySection from "../section/InventorySection";
import CostSection from "../section/CostSection";
import InternalNotesSection from "../section/InternalNotes";
import MoveTypeSection from "../section/MoveTypeSection";
import DepositSection from "../section/DepositSection";
import LiabilityCoverageSection from "../section/LiabilityCoverageSection";
import LineItemSection from "../section/LineItemSection";
import TrucksAndMoversSection from "../section/TrucksAndMoversSection";

interface LeadStepProps {
  move: MoveSchema;
}

const LeadStep = ({ move }: LeadStepProps) => {
  return (
    <>
      <InfoSection move={move} />
      <MoveTypeSection move={move} />
      <LocationSection move={move} />
      <InventorySection move={move} />
      {/* <TrucksAndMoversSection move={move} /> */}
      <LiabilityCoverageSection move={move} />
      <LineItemSection move={move} />
      <DepositSection move={move} />
      <InternalNotesSection move={move} />
      <CostSection move={move} />
    </>
  );
};

export default LeadStep;
