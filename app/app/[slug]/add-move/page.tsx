"use client";
import React, { useEffect, useState } from "react";
import PageHeader from "@/app/components/shared/heading/NavigationHeader";
import { useParams, useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import Stepper from "@/app/components/shared/Stepper";
import PageContainer from "@/app/components/shared/containers/PageContainer";
import { MoveFormProvider, useMoveForm } from "@/app/contexts/MoveFormContext";
import LocationStep from "./components/steps/LocationStep";
import InventoryStep from "./components/steps/InventoryStep";
import CostStep from "./components/steps/CostStep";
import InfoStep from "./components/steps/InfoStep";
import { useCreateMove } from "./hooks/createMove";

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
  const [currentStep, setCurrentStep] = useState<number>(1);

  const { createMove, createMoveLoading, createMoveError, setCreateMoveError } =
    useCreateMove();
  const moveForm = useMoveForm();
  const { slug } = useParams();

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleClose = () => {
    setShowModal(false);
    router.back();
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setShowModal(true);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setCreateMoveError(null);

      if (!moveForm.companyId) {
        setCreateMoveError("Company ID is required");
        return;
      }

      if (!moveForm.salesRep) {
        setCreateMoveError("Sales Rep is required");
        return;
      }

      const { success, moveId } = await createMove({
        companyId: moveForm.companyId,
        status: moveForm.moveStatus,
        salesRep: moveForm.salesRep,
        liabilityCoverage: moveForm.insurancePolicy,
        name: moveForm.name,
        email: moveForm.email,
        phoneNumber: moveForm.phoneNumber,
        altPhoneNumber: moveForm.alternatePhoneNumber,
        notes: moveForm.notes,
        serviceType: moveForm.serviceType,
        referral: moveForm.referralSource,
        moveDate: moveForm.moveDate,
        moveWindow: moveForm.moveWindow,
        arrivalTimes: {
          arrivalWindowStarts: moveForm.startingHour.toString(),
          arrivalWindowEnds: moveForm.endingHour.toString(),
        },
        trucks: moveForm.truckCount,
        movers: moveForm.moversCount,
        startingMoveTime: moveForm.startingHour,
        endingMoveTime: moveForm.endingHour,
        jobType: moveForm.jobType,
        jobTypeRate: moveForm.jobTypeRate,
        deposit: moveForm.deposit,
        moveFees: moveForm.moveFees,
        moveItems: moveForm.moveItems,
        locations: moveForm.locations,
        totalMiles: moveForm.totalMiles,
        officeToOrigin: moveForm.officeToOrigin,
        destinationToOrigin: moveForm.destinationToOrigin,
        roundTripMiles: moveForm.roundTripMiles,
        roundTripDrive: moveForm.roundTripDrive,
        segmentDistances: moveForm.segmentDistances,
        depositMethod: moveForm.depositMethod,
      });

      if (success) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        router.push(`/app/${slug}/moves/${moveId}`);
      }
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Add Move"
        onBack={handleBack}
        onClose={() => setShowModal(true)}
      />
      <Stepper
        currentStep={currentStep}
        steps={[
          { label: "Info" },
          { label: "Location" },
          { label: "Inventory" },
          { label: "Costs" },
        ]}
        onStepClick={(step) => setCurrentStep(step)}
      />
      {currentStep === 1 && (
        <InfoStep onNext={handleNext} onCancel={handleBack} />
      )}
      {currentStep === 2 && (
        <LocationStep onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 3 && (
        <InventoryStep onNext={handleNext} onBack={handleBack} />
      )}
      {currentStep === 4 && (
        <CostStep
          onNext={handleNext}
          onBack={handleBack}
          isSaving={createMoveLoading}
          saveError={createMoveError}
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
