"use client";

import {
  CompanyContactSchema,
  MoveSchema,
  UserSchema,
} from "@/types/convex-schemas";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import SectionHeader from "@/app/components/shared/SectionHeader";
import ContactCard from "../card/ContactCard";
import CustomerCard from "../card/CustomerCard";

interface QuoteContactProps {
  move: MoveSchema;
  salesRep: UserSchema;
  companyContact: CompanyContactSchema;
}

const QuoteContact = ({
  move,
  salesRep,
  companyContact,
}: QuoteContactProps) => {
  return (
    <div>
      <SectionHeader title="Contact Information" />
      <SectionContainer>
        <ContactCard salesRep={salesRep} companyContact={companyContact} />
        <CustomerCard move={move} />
      </SectionContainer>
    </div>
  );
};

export default QuoteContact;
