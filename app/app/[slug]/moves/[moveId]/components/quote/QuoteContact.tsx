"use client";

import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ContactCard from "../card/ContactCard";
import CustomerCard from "../card/CustomerCard";
import { useMoveContext } from "@/app/contexts/MoveContext";

const QuoteContact = () => {
  const { moveData } = useMoveContext();
  const { companyContact, moveCustomer, salesRepUser } = moveData;
  return (
    <div>
      <SectionHeader className="mx-auto" title="Contact Information" />
      <SectionContainer>
        <ContactCard salesRep={salesRepUser} companyContact={companyContact} />
        <CustomerCard moveCustomer={moveCustomer} />
      </SectionContainer>
    </div>
  );
};

export default QuoteContact;
