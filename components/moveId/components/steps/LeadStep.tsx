"use client";

import LocationSection from "../section/LocationSection";
import CostSection from "../section/CostSection";
import InternalNotesSection from "../section/InternalNotes";
import DepositSection from "../section/DepositSection";
import LineItemSection from "../section/MoveLineItemsSection";
import ViewTravelFee from "../section/ViewTravelFee";
import ViewCreditCardFee from "../section/ViewCreditCardFee";
import ViewInventory from "../section/ViewInventory";
import ViewLaborFee from "../section/ViewLaborFee";
import ViewCustomer from "../section/ViewCustomer";
import ViewLiabilityFee from "../section/ViewLiabilityFee";
import ViewLeadStep from "../section/ViewLeadStep";
import ViewPaymentType from "../section/ViewPaymentType";
import ViewMoveType from "../section/ViewMoveType";
import { useSlugContext } from "@/contexts/SlugContext";
import { canCreateMove } from "@/frontendUtils/permissions";
import InventoryMoverSection from "../section/InventoryMoverSection";

const LeadStep = () => {
  const { user } = useSlugContext();
  const canCreateMoverUser = canCreateMove(user.role);

  return (
    <div className="pb-20">
      <ViewLeadStep />
      <ViewCustomer />
      <ViewMoveType />
      <LocationSection />
      {canCreateMoverUser ? <ViewInventory /> : <InventoryMoverSection />}
      {canCreateMoverUser && (
        <>
          <ViewLaborFee />
          <ViewTravelFee />
          <ViewCreditCardFee />
          <ViewLiabilityFee />
          <LineItemSection />
          <DepositSection />
          <ViewPaymentType />
          <CostSection />
          <InternalNotesSection />
        </>
      )}
    </div>
  );
};

export default LeadStep;
