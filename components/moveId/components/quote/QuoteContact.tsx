"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/SectionHeader";
import ContactCard from "../card/ContactCard";
import CustomerCard from "../card/CustomerCard";
import { useMoveContext } from "@/contexts/MoveContext";

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
