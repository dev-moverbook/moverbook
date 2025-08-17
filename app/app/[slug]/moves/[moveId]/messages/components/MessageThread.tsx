// app/app/[slug]/moves/[moveId]/messages/components/MessageThread.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useMoveContext } from "@/app/contexts/MoveContext";
import { useSlugContext } from "@/app/contexts/SlugContext";
import MessageContainer from "./MessageContainer";
import MessageBubble from "./MessageBubble";
import LoadingInline from "@/app/components/shared/ui/LoadingInline";
import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { formatTimestamp } from "@/app/frontendUtils/helper";
import { QueryStatus } from "@/types/enums";
import { useMessagesByMoveId } from "@/app/hooks/queries/useMessagesByMoveId";

const MessageThread = () => {
  const { moveData } = useMoveContext();
  const { timeZone } = useSlugContext();

  const result = useMessagesByMoveId(moveData.move._id);

  // Bottom sentinel to scroll into view
  const bottomRef = useRef<HTMLDivElement | null>(null);
  // Track previous message count to decide smooth vs instant scroll
  const prevCountRef = useRef(0);

  const msgCount =
    result.status === QueryStatus.SUCCESS ? result.messages.length : 0;

  useEffect(() => {
    if (result.status !== QueryStatus.SUCCESS) return;

    const behavior: ScrollBehavior =
      prevCountRef.current === 0
        ? "auto" // first paint: jump to bottom without animation
        : msgCount > prevCountRef.current
          ? "smooth" // a new message arrived: smooth scroll
          : "auto"; // same count or fewer: just ensure we're at bottom

    prevCountRef.current = msgCount;

    // Let the DOM paint before scrolling
    const id = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior,
        block: "end",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [result.status, msgCount]);

  let inner: React.ReactNode;

  switch (result.status) {
    case QueryStatus.LOADING:
      inner = <LoadingInline />;
      break;

    case QueryStatus.ERROR:
      inner = (
        <ErrorComponent
          message={result.errorMessage ?? "Failed to load messages"}
        />
      );
      break;

    case QueryStatus.SUCCESS: {
      const messages = result.messages; // already oldest -> newest
      inner =
        messages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground mt-8">
            No messages yet
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                text={msg.resolvedMessage}
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
