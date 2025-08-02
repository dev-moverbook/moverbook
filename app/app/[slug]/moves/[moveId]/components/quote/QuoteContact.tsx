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
import { Doc } from "@/convex/_generated/dataModel";

interface QuoteContactProps {
  salesRep: Doc<"users"> | null;
  companyContact: CompanyContactSchema;
  moveCustomer: Doc<"moveCustomers">;
}

const QuoteContact = ({
  salesRep,
  companyContact,
  moveCustomer,
}: QuoteContactProps) => {
  return (
    <div>
      <SectionHeader className="mx-auto" title="Contact Information" />
      <SectionContainer>
        <ContactCard salesRep={salesRep} companyContact={companyContact} />
        <CustomerCard moveCustomer={moveCustomer} />
      </SectionContainer>
    </div>
  );
};

export default QuoteContact;
