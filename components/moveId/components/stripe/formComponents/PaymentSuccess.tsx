"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import { CheckCircle2 } from "lucide-react";

interface PaymentSuccessProps {
  message?: string;
}

const PaymentSuccess = ({
  message = "Payment Success!",
}: PaymentSuccessProps) => {
  return (
    <SectionContainer showBorder={false}>
      <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <CheckCircle2 className="text-green-500 h-8 w-8" />
          <p className="text-green-500 font-bold tracking-tight">{message}</p>
        </div>
      </div>
    </SectionContainer>
  );
};

export default PaymentSuccess;
