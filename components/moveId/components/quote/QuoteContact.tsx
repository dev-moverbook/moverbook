"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import ContactCard from "../card/ContactCard";
import CustomerCard from "../card/CustomerCard";
import { Doc } from "@/convex/_generated/dataModel";
import { CustomerUser } from "@/types/types";

interface QuoteContactProps {
  companyContact: Doc<"companyContacts">;
  moveCustomer: CustomerUser;
  salesRepUser: Doc<"users"> | null;
}

const QuoteContact = ({
  companyContact,
  moveCustomer,
  salesRepUser,
}: QuoteContactProps) => {
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
