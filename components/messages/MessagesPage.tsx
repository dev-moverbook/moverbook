"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import SectionHeaderWithAction from "@/components/shared/section/SectionHeaderWithAction";
import ErrorMessage from "@/components/shared/error/ErrorMessage";
import RecentMessagesQuery from "./RecentMessagesQuery";
import SectionContainer from "../shared/containers/SectionContainer";

const MessagesPage = () => {
  const { isCompanyContactComplete, isStripeComplete } = useSlugContext();
  const isAddMoveDisabled = !isCompanyContactComplete || !isStripeComplete;

  if (isAddMoveDisabled) {
    return (
      <ErrorMessage message="You must complete your company contact and Stripe setup to access the messages." />
    );
  }

  return (
    <>
      <SectionHeaderWithAction title="Messages" />
      <SectionContainer>
        <RecentMessagesQuery />
      </SectionContainer>
    </>
  );
};

export default MessagesPage;
