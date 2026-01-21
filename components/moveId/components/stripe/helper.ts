import { Doc } from "@/convex/_generated/dataModel";
import { CompleteCardInfo } from "@/types/types";

export function getDefaultPaymentMethodInfo(
  moveCustomerStripeProfile?: Doc<"moveCustomerStripeProfiles"> | null
): CompleteCardInfo | null {
  if (
    !moveCustomerStripeProfile?.defaultPaymentMethodId ||
    !moveCustomerStripeProfile.cardBrand ||
    !moveCustomerStripeProfile.cardLast4 ||
    !moveCustomerStripeProfile.cardExpMonth ||
    !moveCustomerStripeProfile.cardExpYear
  ) {
    return null;
  }

  return {
    paymentMethodId: moveCustomerStripeProfile.defaultPaymentMethodId,
    brand: moveCustomerStripeProfile.cardBrand,
    last4: moveCustomerStripeProfile.cardLast4,
    expMonth: moveCustomerStripeProfile.cardExpMonth,
    expYear: moveCustomerStripeProfile.cardExpYear,
  };
}
