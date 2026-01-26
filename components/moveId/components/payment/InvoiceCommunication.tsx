"use client";

import { useMemo, useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import { Doc } from "@/convex/_generated/dataModel";
import TripleFormAction from "@/components/shared/buttons/TripleFormAction";
import { Button } from "@/components/ui/button";
import { useMarkAsComplete, useSendPresetScript } from "@/hooks/messages";
import { PresSetScripts } from "@/types/enums";
import {
  useEnsureMoveCustomerStripeProfiel,
  useStripePaymentIntent,
  useStripeSetupIntent,
} from "@/hooks/stripe";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "../stripe/StripePaymentForm";
import { getStripePromise } from "@/frontendUtils/stripe";
import { getDefaultPaymentMethodInfo } from "../stripe/helper";
import { ArrowLeft } from "lucide-react";
import PaymentSuccess from "../stripe/formComponents/PaymentSuccess";

interface InvoiceCommunicationProps {
  move: Doc<"moves">;
  invoice: Doc<"invoices"> | null;
  amount: number;
}

const InvoiceCommunication = ({
  move,
  invoice,
  amount,
}: InvoiceCommunicationProps) => {
  const [activeLoading, setActiveLoading] = useState<"email" | "sms" | null>(
    null
  );
  const [moveCustomerStripeProfile, setMoveCustomerStripeProfile] =
    useState<Doc<"moveCustomerStripeProfiles"> | null>(null);

  const {
    ensureMoveCustomerStripeProfile,
    loading: ensureMoveCustomerStripeProfileLoading,
    error: ensureMoveCustomerStripeProfileError,
    setError: setEnsureMoveCustomerStripeProfileError,
  } = useEnsureMoveCustomerStripeProfiel();

  const { sendPresetScript, sendPresetScriptError, setSendPresetScriptError } =
    useSendPresetScript();

  const {
    createPaymentIntent,
    loading: paymentLoading,
    error: paymentError,
  } = useStripePaymentIntent();
  const {
    createSetupIntent,
    loading: setupLoading,
    error: setupError,
  } = useStripeSetupIntent();

  const { markAsComplete, isLoading, error, setError } = useMarkAsComplete();

  const handleEnsureMoveCustomerStripeProfile = async () => {
    setSendPresetScriptError(null);
    setError(null);
    const moveCustomerStripeProfile = await ensureMoveCustomerStripeProfile(
      move._id
    );
    setMoveCustomerStripeProfile(moveCustomerStripeProfile);
  };
  const handleMarkAsComplete = async () => {
    setEnsureMoveCustomerStripeProfileError(null);
    setSendPresetScriptError(null);
    await markAsComplete({
      moveId: move._id,
    });
  };
  const cardInfo = getDefaultPaymentMethodInfo(moveCustomerStripeProfile);

  const stripePromise = useMemo(() => {
    return getStripePromise(
      moveCustomerStripeProfile?.stripeConnectedAccountId
    );
  }, [moveCustomerStripeProfile?.stripeConnectedAccountId]);

  const handleSend = async (type: "email" | "sms") => {
    setActiveLoading(type);
    setError(null);
    setEnsureMoveCustomerStripeProfileError(null);
    await sendPresetScript({
      moveId: move._id,
      preSetTypes:
        type === "email"
          ? PresSetScripts.EMAIL_INVOICE
          : PresSetScripts.SMS_INVOICE,
    });
    setActiveLoading(null);
  };

  const showCreditPayment = move.paymentMethod?.kind === "credit_card";

  if (move.invoicePaid) {
    return <PaymentSuccess message="Payment Success!" />;
  }

  if (moveCustomerStripeProfile) {
    return (
      <div>
        <Button
          variant="link"
          className="px-0 text-white mb-4 flex items-center gap-2 no-underline hover:no-underline"
          onClick={() => setMoveCustomerStripeProfile(null)}
        >
          <ArrowLeft size={16} className="shrink-0" />
          <span>Back</span>
        </Button>
        <Elements stripe={stripePromise}>
          <StripePaymentForm
            amount={amount}
            cardInfo={cardInfo}
            createSetupIntent={() => createSetupIntent(move._id)}
            createPaymentIntent={async ({
              useSavedPaymentMethod,
              manualPaymentMethodId,
            }) => {
              await createPaymentIntent(move._id, "final_payment", {
                useSavedPaymentMethod,
                manualPaymentMethodId,
              });
            }}
            error={error || setupError || paymentError}
            isLoading={setupLoading || paymentLoading}
          />
        </Elements>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }
  return (
    <SectionContainer showBorder={false}>
      <TripleFormAction
        error={
          sendPresetScriptError || error || ensureMoveCustomerStripeProfileError
        }
        className="mt-0"
      >
        <Button
          variant="ghost"
          onClick={() => handleSend("email")}
          isLoading={activeLoading === "email"}
          className="w-full"
        >
          Email Invoice
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleSend("sms")}
          isLoading={activeLoading === "sms"}
          className="w-full"
        >
          Text Invoice
        </Button>

        {showCreditPayment ? (
          <Button
            onClick={() => handleEnsureMoveCustomerStripeProfile()}
            isLoading={ensureMoveCustomerStripeProfileLoading}
            className="w-full "
          >
            Payment
          </Button>
        ) : (
          <Button
            onClick={() => handleMarkAsComplete()}
            isLoading={isLoading}
            className="w-full "
          >
            Mark as Complete
          </Button>
        )}
      </TripleFormAction>
    </SectionContainer>
  );
};

export default InvoiceCommunication;
