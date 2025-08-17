"use client";
import React, { useEffect, useState } from "react";
import PageHeader from "@/app/components/shared/heading/NavigationHeader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ConfirmModal from "@/app/components/shared/ConfirmModal";
import Stepper from "@/app/components/shared/Stepper";
import PageContainer from "@/app/components/shared/containers/PageContainer";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import InventoryStep from "./components/steps/InventoryStep";
import CostStep from "./components/steps/CostStep";
import { CreateMoveInput, useCreateMove } from "./hooks/createMove";
import MoveStep from "./components/steps/MoveStep";
import CustomerStep from "./components/steps/CustomerStep";
import { FrontEndErrorMessages } from "@/types/errors";
import { transformToCreateMoveInput } from "@/app/frontendUtils/transform";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "@/types/enums";

const AddMovePageContent = () => {
  const router = useRouter();
  const search = useSearchParams();
  const moveCustomerId = search.get("moveCustomerId");

  const { setCustomer, setMoveFormData, moveFormData } = useMoveForm();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const { createMove, createMoveLoading, createMoveError, setCreateMoveError } =
    useCreateMove();
  const { slug } = useParams();

  const duplicateFromId = search.get("duplicateFrom");
  const fieldsParam = search.get("fields");
  const fieldsToDuplicate = fieldsParam?.split(",") ?? [];

  const moveToDuplicateResponse = useQuery(
    api.move.getMove,
    duplicateFromId ? { moveId: duplicateFromId as Id<"move"> } : "skip"
  );

  useEffect(() => {
    if (
      moveToDuplicateResponse?.status === ResponseStatus.SUCCESS &&
      fieldsToDuplicate.length > 0
    ) {
      const move = moveToDuplicateResponse.data.move;

      setMoveFormData((prev) => {
        const updated = { ...prev };

        if (fieldsToDuplicate.includes("serviceType")) {
          updated.serviceType = move.serviceType;
        }
        if (fieldsToDuplicate.includes("startingLocation")) {
          updated.locations[0] = {
            ...updated.locations[0],
            ...move.locations.find((l) => l.locationRole === "starting"),
          };
        }
        if (fieldsToDuplicate.includes("endingLocation")) {
          updated.locations[1] = {
            ...updated.locations[1],
            ...move.locations.find((l) => l.locationRole === "ending"),
          };
        }
        if (fieldsToDuplicate.includes("stops")) {
          const stops = move.locations.filter((l) => l.locationRole === "stop");
          updated.locations = [...updated.locations, ...stops];
        }
        if (fieldsToDuplicate.includes("inventory")) {
          updated.moveItems = move.moveItems;
        }
        if (fieldsToDuplicate.includes("movers")) {
          updated.movers = move.movers;
        }
        if (fieldsToDuplicate.includes("trucks")) {
          updated.trucks = move.trucks;
        }
        if (fieldsToDuplicate.includes("rate")) {
          updated.jobType = move.jobType;
          updated.jobTypeRate = move.jobTypeRate;
        }
        if (fieldsToDuplicate.includes("addOns")) {
          updated.moveFees = move.moveFees;
        }
        if (fieldsToDuplicate.includes("liabilityCoverage")) {
          updated.liabilityCoverage = move.liabilityCoverage;
        }

        return updated;
      });
    }
  }, [moveToDuplicateResponse, fieldsToDuplicate, setMoveFormData]);

  const customerResponse = useQuery(
    api.moveCustomers.getMoveCustomer,
    moveCustomerId
      ? { moveCustomerId: moveCustomerId as Id<"moveCustomers"> }
      : "skip"
  );

  useEffect(() => {
    if (customerResponse?.status === ResponseStatus.SUCCESS && moveCustomerId) {
      // 1. Prefill customer info
      const customer = customerResponse.data.moveCustomer;
      setCustomer({
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        altPhoneNumber: customer.altPhoneNumber ?? "",
        referral: customer.referral ?? "",
      });

      // 2. Set moveCustomerId in form data
      setMoveFormData((prev) => ({
        ...prev,
        moveCustomerId: moveCustomerId as Id<"moveCustomers">,
      }));

      // 3. Skip to Step 2
      setCurrentStep(2);
    }
  }, [customerResponse, moveCustomerId, setCustomer, setMoveFormData]);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
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

      let createMoveInput: CreateMoveInput;

      try {
        createMoveInput = transformToCreateMoveInput(moveFormData);
      } catch (err) {
        console.error("Transform failed:", err);
        setCreateMoveError(
          err instanceof Error ? err.message : FrontEndErrorMessages.GENERIC
        );
        return;
      }

      const { success, moveId } = await createMove(createMoveInput);

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
          { label: "Customer" },
          { label: "Move" },
          { label: "Inventory" },
          { label: "Costs" },
        ]}
        onStepClick={(step) => setCurrentStep(step)}
        disabledSteps={!moveFormData.moveCustomerId ? [2, 3, 4] : []}
      />

      {currentStep === 1 && (
        <CustomerStep onNext={handleNext} onCancel={handleBack} />
      )}
      {currentStep === 2 && (
        <MoveStep onNext={handleNext} onBack={handleBack} />
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

export default AddMovePageContent;
