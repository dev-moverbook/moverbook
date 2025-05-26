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
import MoveDetails from "./components/MoveDetails";
import JobDetails from "./components/JobDetails";
import { useSlugContext } from "@/app/contexts/SlugContext";
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

  const handleClose = () => {
    setShowModal(false);
    router.back();
  };

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
          { label: "Move Details" },
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
        <MoveDetails
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
        />
      )}
      {currentStep === 4 && (
        <JobDetails
          onNext={() => setCurrentStep(currentStep + 1)}
          onBack={() => setCurrentStep(currentStep - 1)}
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
