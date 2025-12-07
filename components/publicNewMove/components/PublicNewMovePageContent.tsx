"use client";

import PageContainer from "@/components/shared/containers/PageContainer";
import PageHeader from "@/components/shared/heading/NavigationHeader";
import { useRouter } from "next/navigation";
import PublicNewMoveSteps from "./steps/PublicNewMoveSteps";
import { usePublicNewMoveForm } from "@/contexts/PublicNewMoveFormContext";
import MoveSubmittedSuccess from "./MoveSubmittedSuccess";
import { useStepper } from "@/components/add-move/hooks/useStepper";
import NewMoveFormActions from "./formActions/NewMoveFormActions";

const PublicNewMovePageContent = () => {
  const router = useRouter();
  const { isMoveSubmitted } = usePublicNewMoveForm();

  const stepper = useStepper(1, 2);

  const handleClose = () => router.back();
  const handleBack = () => router.back();

  if (isMoveSubmitted) {
    return (
      <PageContainer>
        <MoveSubmittedSuccess />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="New Move" onBack={handleBack} onClose={handleClose} />

      <PublicNewMoveSteps stepper={stepper} />
      <NewMoveFormActions stepper={stepper} />
    </PageContainer>
  );
};

export default PublicNewMovePageContent;
