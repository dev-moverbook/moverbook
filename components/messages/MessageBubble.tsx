"use client";

import  { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CommunicationType, MessageSentType } from "@/types/types";
import { linkifyText } from "@/utils/tsxHelper";
import { Mail, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  time: string | null;
  type: MessageSentType;
  method: CommunicationType;
  subject?: string | null;
  maxCollapsedHeight?: number; 
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  time,
  type,
  method,
  subject,
  maxCollapsedHeight = 200,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isIncoming = type === "incoming";
  const Icon = method === "sms" ? MessageSquare : Mail;

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxCollapsedHeight);
    }
  }, [text, maxCollapsedHeight]);

  return (
    <div
      className={cn(
        "relative min-w-36 max-w-xs md:max-w-sm rounded-xl p-3 text-sm shadow mb-4",
        isIncoming
          ? "self-start bg-white text-black rounded-bl-none"
          : "self-end bg-green-100 text-black rounded-br-none"
      )}
    >
      {method === "email" && subject && (
        <div className="mb-2 pb-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500">Subject:</span>
          <p className="font-semibold leading-snug">{subject}</p>
        </div>
      )}

      <div
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? "none" : `${maxCollapsedHeight}px`,
        }}
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          !isExpanded && isOverflowing && "mask-fade-bottom" // Add a fade effect
        )}
      >
        <p className="mb-6 whitespace-pre-wrap break-words">
          {linkifyText(text)}
        </p>
      </div>

      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 mt-2 text-xs font-bold text-blue-600 mb-4 hover:underline"
        >
          {isExpanded ? (
            <>Show less <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Show more <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}

      <div className="absolute bottom-1 right-2 flex items-center gap-1 text-xs text-gray-500">
        {time && <span>{time}</span>}
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default MessageBubble;