"use client";

import { RecentMoveMessageSummary } from "@/types/types";
import EmptyList from "@/components/shared/message/EmptyList";
import MessageCard from "@/components/messages/MessageCard";
import { useSlugContext } from "@/contexts/SlugContext";

interface MessagesContentProps {
  messages: RecentMoveMessageSummary[];
}

const MessagesContent: React.FC<MessagesContentProps> = ({ messages }) => {
  const { slug } = useSlugContext();
  if (messages.length === 0) {
    return <EmptyList className="px-0" message={"No Messages found"} />;
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
