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

interface PublicMoveIdPageProps {
  initialStep: number;
}

const PublicMoveIdPage = ({ initialStep }: PublicMoveIdPageProps) => {
  const { step, setStep } = useStepper(initialStep, 4);

  return (
    <>
      <PublicMoveNav />
      <PageContainer className="pt-10">
        <PublicMoveCard />
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
