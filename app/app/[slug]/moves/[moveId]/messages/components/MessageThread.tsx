import React from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import MessageContainer from "./MessageContainer";
import MessageBubble from "./MessageBubble";
import { formatTimestamp } from "@/app/frontendUtils/helper";
import { useMessagesByMoveId } from "@/app/hooks/queries/useMessagesByMoveId";
import LoadingInline from "@/app/components/shared/ui/LoadingInline";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useSlugContext } from "@/app/contexts/SlugContext";

const MessageThread = () => {
  const { moveData } = useMoveContext();
  const { timeZone } = useSlugContext();
  const { messages, isLoading, isError, errorMessage } = useMessagesByMoveId(
    moveData.move._id
  );

  if (messages.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground mt-8">
        No messages yet
      </div>
    );
  }
  console.log(messages);

  return (
    <MessageContainer>
      {isLoading && <LoadingInline />}
      {isError && (
        <ErrorComponent message={errorMessage ?? "Failed to load messages"} />
      )}
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          text={msg.resolvedMessage}
          time={formatTimestamp(msg._creationTime, timeZone)}
          type={msg.status === "sent" ? "outgoing" : "incoming"}
          method={msg.method as "sms" | "email"}
        />
      ))}
    </MessageContainer>
  );
};

export default MessageThread;
