"use client";
import React, { useState } from "react";
import PageHeader from "@/app/components/shared/heading/NavigationHeader";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import Stepper from "@/app/components/shared/Stepper";
import PersonalDetails from "./components/PersonalDetails";
import PageContainer from "@/app/components/shared/containers/PageContainer";
import { MoveFormProvider } from "@/app/contexts/MoveFormContext";
import Location from "./components/Location";
import Inventory from "./components/Inventory";
import JobDetails from "./components/JobDetails";
import { useSlugContext } from "@/app/contexts/SlugContext";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import { useUser } from "@clerk/nextjs";

const AddMovePage = () => {
  return (
    <MoveFormProvider>
      <AddMovePageContent />
    </MoveFormProvider>
  );
};

const AddMovePageContent = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { companyId } = useSlugContext();
  const { user } = useUser();

  const handleClose = () => {
    setShowModal(false);
    router.back();
  };

  if (!companyId || !user) {
    return <ErrorMessage message="Company not found" />;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Add Move"
        onBack={() => {}}
        onClose={() => setShowModal(true)}
      />
      <Stepper
        currentStep={currentStep}
        steps={[
          { label: "Personal Details" },
          { label: "Location" },
          { label: "Inventory" },
          { label: "Job Details" },
        ]}
        onStepClick={(step) => setCurrentStep(step)}
      />
      {currentStep === 1 && (
        <PersonalDetails
          onNext={() => setCurrentStep(currentStep + 1)}
          onCancel={() => setShowModal(true)}
          companyId={companyId}
        />
      )}
      {currentStep === 2 && (
        <Location
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
        />
      )}
      {currentStep === 3 && (
        <Inventory
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
          companyId={companyId}
        />
      )}
      {currentStep === 4 && (
        <JobDetails
          companyId={companyId}
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
          user={user}
        />
      )}

      <ConfirmModal
        title="Are you sure you want to leave?"
        description="You have unsaved changes. If you leave, your changes will be lost."
        onClose={() => setShowModal(false)}
        isOpen={showModal}
        onConfirm={handleClose}
        deleteLoading={false}
        deleteError={null}
      />
    </PageContainer>
  );
};

export default AddMovePage;
