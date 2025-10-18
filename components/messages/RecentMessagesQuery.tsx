"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import { useRecentMessagesByCompanyId } from "@/hooks/messages/useRecentMessagesByCompanyId";
import MessagesContent from "./MessagesContent";

const RecentMessagesQuery = () => {
  const { companyId } = useSlugContext();
  const result = useRecentMessagesByCompanyId(companyId);

  if (!result) {
    return null;
  }

  return <MessagesContent messages={result} />;
};

export default RecentMessagesQuery;
