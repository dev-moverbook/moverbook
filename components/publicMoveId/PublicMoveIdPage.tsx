"use client";

import { useStepper } from "../add-move/hooks/useStepper";
import QuotesStep from "./components/quote/PublicQuotesStep";
import PublicMoveStepper from "./components/PublicMoveStepper";
import DocumentsStep from "./components/documents/DocumentsStep";
import MoveStep from "./components/move/MoveStep";
import PaymentStep from "./components/payment/PaymentStep";
import PageContainer from "../shared/containers/PageContainer";
import PublicMoveNav from "./components/header/PublicMoveNav";
import PublicMoveCard from "./components/header/PublicMoveCard";
import ChangeResponseNotification from "./components/notification/ChangeResponseNotification";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { findUnacknowledgedResolvedChangeRequest } from "@/frontendUtils/helper";

interface PublicMoveIdPageProps {
  initialStep: number;
}

const PublicMoveIdPage = ({ initialStep }: PublicMoveIdPageProps) => {
  const { step, setStep } = useStepper(initialStep, 4);

  const { move } = usePublicMoveIdContext();
  const { changeRequests } = move;

  const unacknowledgedChangeRequest =
    findUnacknowledgedResolvedChangeRequest(changeRequests);

  return (
    <>
      <PublicMoveNav />
      <PageContainer className="pt-10">
        <PublicMoveCard />
        {unacknowledgedChangeRequest && (
          <ChangeResponseNotification
            changeRequest={unacknowledgedChangeRequest}
          />
        )}
        <PublicMoveStepper step={step} setStep={setStep} />

        {step === 1 && <QuotesStep />}
        {step === 2 && <DocumentsStep />}
        {step === 3 && <MoveStep />}
        {step === 4 && <PaymentStep />}
      </PageContainer>
    </>
  );
};

export default PublicMoveIdPage;
