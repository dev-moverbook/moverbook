import React from "react";
import MoveCustomerCard from "@/app/components/customer/CustomerCard";
import { Doc } from "@/convex/_generated/dataModel";
import { useSlugContext } from "@/app/contexts/SlugContext";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";
import FormActions from "@/app/components/shared/FormActions";
import { useRouter } from "next/navigation";

interface Props {
  customer: Doc<"moveCustomers">;
  onUse: () => void;
  className?: string;
}

const ExistingCustomerNotice: React.FC<Props> = ({
  customer,
  onUse,

  className = "",
}) => {
  const { slug } = useSlugContext();
  const router = useRouter();

  const handleView = () => {
    router.push(`/app/${slug}/customer/${customer._id}`);
  };
  return (
    <div className={`   ${className}`}>
      <div className=" font-medium px-4">
        <p className="font-bold text-red-600">Existing customer found</p>
        <p className="text-grayCustom2">
          You can use this customer, or change the phone number and email to
          create a new one.
        </p>
      </div>
      <MoveCustomerCard
        moveCustomer={customer}
        className="px-4 md:px-0 border-none"
      />
      <FormActionContainer className="pt-10">
        <FormActions
          onSave={(e) => {
            e.preventDefault();
            onUse();
          }}
          onCancel={handleView}
          disabled={false}
          isSaving={false}
          saveLabel="Select"
          cancelLabel="View Customer"
          error={""}
        />
      </FormActionContainer>
    </div>
  );
};

export default ExistingCustomerNotice;
