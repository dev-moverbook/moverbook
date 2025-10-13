"use client";
import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import { QueryStatus } from "@/types/enums";
import { useRecentMessagesByCompanyId } from "@/app/hooks/queries/messages/useRecentMessagesByCompanyId";
import CenteredContainer from "@/app/components/shared/CenteredContainer";
import MessagesContent from "./MessagesContent";
import SectionContainer from "@/app/components/shared/SectionContainer";

const MessagesPage = () => {
  const { companyId } = useSlugContext();
  const result = useRecentMessagesByCompanyId(companyId);

  let content: React.ReactNode = null;

  switch (result) {
    case undefined:
      content = null;
      break;

    default:
      content = <MessagesContent messages={result} />;
      break;
  }

  return (
    <SectionContainer isLast>
      <CenteredContainer className="px-0 md:px-0">{content}</CenteredContainer>
    </SectionContainer>
  );
};

export default MessagesPage;
