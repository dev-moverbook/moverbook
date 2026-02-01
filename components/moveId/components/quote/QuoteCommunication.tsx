"use client";

import { useEffect, useMemo, useState } from "react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import { Doc } from "@/convex/_generated/dataModel";
import TripleFormAction from "@/components/shared/buttons/TripleFormAction";
import { Button } from "@/components/ui/button";
import { useMarkAsBooked, useSendPresetScript } from "@/hooks/messages";
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
import { stripeDarkAppearance } from "@/frontendUtils/stripeTheme";
import PaymentSkeleton from "@/components/shared/skeleton/PaymentSkeleton";

interface QuoteConfirmationProps {
  move: Doc<"moves">;
}

const QuoteCommunication = ({ move }: QuoteConfirmationProps) => {
  const [activeLoading, setActiveLoading] = useState<"email" | "sms" | null>(null);
  const [moveCustomerStripeProfile, setMoveCustomerStripeProfile] =
    useState<Doc<"moveCustomerStripeProfiles"> | null>(null);
  const [setupClientSecret, setSetupClientSecret] = useState<string | null>(null);

  const {
    ensureMoveCustomerStripeProfile,
    loading: ensureProfileLoading,
    error: ensureProfileError,
    setError: setEnsureProfileError,
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

  const { markAsBooked, isLoading: isMarkingBookedLoading, error, setError } = useMarkAsBooked();

  const isAnyLoading = 
    !!activeLoading || 
    ensureProfileLoading || 
    isMarkingBookedLoading || 
    setupLoading || 
    paymentLoading;

  useEffect(() => {
    if (
      moveCustomerStripeProfile &&
      !setupClientSecret &&
      !setupLoading &&
      !setupError
    ) {
      const fetchSecret = async () => {
        try {
          const { clientSecret } = await createSetupIntent(move._id);
          setSetupClientSecret(clientSecret);
        } catch (err) {
          console.error("Failed to create SetupIntent:", err);
        }
      };
      fetchSecret();
    }
  }, [moveCustomerStripeProfile, setupClientSecret, createSetupIntent, setupLoading, setupError, move._id]);

  const handleEnsureProfile = async () => {
    setSendPresetScriptError(null);
    setError(null);
    const profile = await ensureMoveCustomerStripeProfile(move._id);
    setMoveCustomerStripeProfile(profile);
  };

  const handleMarkAsBooked = async () => {
    setEnsureProfileError(null);
    setSendPresetScriptError(null);
    await markAsBooked({ moveId: move._id });
  };

  const handleSend = async (type: "email" | "sms") => {
    setActiveLoading(type);
    setError(null);
    setEnsureProfileError(null);
    await sendPresetScript({
      moveId: move._id,
      preSetTypes: type === "email" ? PresSetScripts.EMAIL_QUOTE : PresSetScripts.SMS_QUOTE,
    });
    setActiveLoading(null);
  };

  const cardInfo = getDefaultPaymentMethodInfo(moveCustomerStripeProfile);

  const stripePromise = useMemo(() => {
    return getStripePromise(moveCustomerStripeProfile?.stripeConnectedAccountId);
  }, [moveCustomerStripeProfile?.stripeConnectedAccountId]);

  const showCreditPayment =
    move.deposit &&
    move.deposit > 0 &&
    move.paymentMethod?.kind === "credit_card";

  if (move.depositPaid) {
    return <PaymentSuccess message="Payment Success!" />;
  }

  if (moveCustomerStripeProfile && move.deposit && move.deposit > 0) {
    return (
      <div>
        <Button
          variant="link"
          className="px-0 text-white mb-4 flex items-center gap-2 no-underline hover:no-underline"
          disabled={isAnyLoading}
          onClick={() => {
            setMoveCustomerStripeProfile(null);
            setSetupClientSecret(null);
          }}
        >
          <ArrowLeft size={16} className="shrink-0" />
          <span>Back</span>
        </Button>

        {!setupClientSecret ? (
          <PaymentSkeleton />
        ) : (
          <Elements 
            stripe={stripePromise}
            options={{ 
              clientSecret: setupClientSecret, 
              appearance: stripeDarkAppearance 
            }}
            key={moveCustomerStripeProfile.stripeConnectedAccountId}
          >
            <StripePaymentForm
              amount={move.deposit}
              cardInfo={cardInfo}
              createPaymentIntent={async ({
                useSavedPaymentMethod,
                manualPaymentMethodId,
              }) => {
                await createPaymentIntent(move._id, "deposit", {
                  useSavedPaymentMethod,
                  manualPaymentMethodId,
                });
              }}
              error={error || setupError || paymentError}
              isLoading={isAnyLoading}
            />
          </Elements>
        )}
      </div>
    );
  }

  return (
    <SectionContainer >
      <TripleFormAction
        error={sendPresetScriptError || error || ensureProfileError}
      >
        <Button
          variant="ghost"
          onClick={() => handleSend("email")}
          isLoading={activeLoading === "email"}
          disabled={isAnyLoading && activeLoading !== "email"}
          className="w-full"
        >
          Email
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleSend("sms")}
          isLoading={activeLoading === "sms"}
          disabled={isAnyLoading && activeLoading !== "sms"}
          className="w-full"
        >
          Text
        </Button>

        {showCreditPayment ? (
          <Button
            onClick={handleEnsureProfile}
            isLoading={ensureProfileLoading}
            disabled={isAnyLoading && !ensureProfileLoading}
            className="w-full"
          >
            Payment
          </Button>
        ) : (
          <Button
            onClick={handleMarkAsBooked}
            isLoading={isMarkingBookedLoading}
            disabled={isAnyLoading && !isMarkingBookedLoading}
            className="w-full"
          >
            Mark as Booked
          </Button>
        )}
      </TripleFormAction>
    </SectionContainer>
  );
};

export default QuoteCommunication;