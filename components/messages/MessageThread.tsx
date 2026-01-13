"use client";

import React, { useEffect, useRef } from "react";
import { useMoveContext } from "@/contexts/MoveContext";
import { useSlugContext } from "@/contexts/SlugContext";
import MessageContainer from "./MessageContainer";
import MessageBubble from "./MessageBubble";
import LoadingInline from "@/components/shared/ui/LoadingInline";
import { formatTimestamp } from "@/frontendUtils/helper";
import { useMessagesByMoveId } from "@/hooks/messages/useMessagesByMoveId";

const MessageThread = () => {
  const { moveData } = useMoveContext();
  const { timeZone } = useSlugContext();

  const result = useMessagesByMoveId(moveData.move._id);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef(0);

  const msgCount = result?.length ?? 0;

  useEffect(() => {
    if (!result) {
      return;
    }
    const behavior: ScrollBehavior =
      prevCountRef.current === 0
        ? "auto"
        : msgCount > prevCountRef.current
          ? "smooth"
          : "auto";

    prevCountRef.current = msgCount;

    const id = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [result, msgCount]);

  let inner: React.ReactNode;

  switch (result) {
    case undefined:
      inner = <LoadingInline />;
      break;

    default: {
      inner =
        result.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground mt-8">
            No messages yet
          </div>
        ) : (
          <>
            {result.map((msg) => (
              <MessageBubble
                key={msg._id}
                text={msg.resolvedMessage}
                subject={msg.resolvedSubject ?? msg.subject}
                time={formatTimestamp(msg._creationTime, timeZone)}
                type={msg.status === "sent" ? "outgoing" : "incoming"}
                method={msg.method as "sms" | "email"}
              />
            ))}

            <div ref={bottomRef} />
          </>
        );
      break;
    }
  }

  return <MessageContainer>{inner}</MessageContainer>;
};

export default MessageThread;
