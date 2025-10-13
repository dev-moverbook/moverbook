import React from "react";
import { RecentMoveMessageSummary } from "@/types/types";
import EmptyList from "@/app/components/shared/message/EmptyList";
import MessageCard from "@/app/components/messages/MessageCard";
import { useSlugContext } from "@/app/contexts/SlugContext";

interface MessagesContentProps {
  messages: RecentMoveMessageSummary[];
}

const MessagesContent: React.FC<MessagesContentProps> = ({ messages }) => {
  const { slug } = useSlugContext();
  if (messages.length === 0) {
    return <EmptyList message={"No Messages found"} />;
  }

  return (
    <div>
      {messages.map((message) => (
        <MessageCard
          key={message.moveId}
          recentMoveMessageSummary={message}
          slug={slug}
        />
      ))}
    </div>
  );
};

export default MessagesContent;
