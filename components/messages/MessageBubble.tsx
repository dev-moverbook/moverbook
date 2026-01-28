import { cn } from "@/lib/utils";
import { CommunicationType, MessageSentType } from "@/types/types";
import { linkifyText } from "@/utils/tsxHelper";
import { Mail, MessageSquare } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  time: string | null;
  type: MessageSentType;
  method: CommunicationType;
  subject?: string | null;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  time,
  type,
  method,
  subject,
}) => {
  const isIncoming = type === "incoming";
  const Icon = method === "sms" ? MessageSquare : Mail;

  return (
    <div
      className={cn(
        "relative min-w-36 max-w-xs md:max-w-sm rounded-xl p-3 text-sm shadow",
        isIncoming
          ? "self-start bg-white text-black rounded-bl-none"
          : "self-end bg-green-100 text-black rounded-br-none"
      )}
    >
      {/* EMAIL SUBJECT */}
      {method === "email" && subject && (
        <div className="mb-2 pb-2 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500">Subject:</span>
          <p className="font-semibold leading-snug">{subject}</p>
        </div>
      )}

      {/* MESSAGE BODY */}
      <p className="mb-5 whitespace-pre-wrap break-words">
        {linkifyText(text)}
      </p>

      {/* FOOTER */}
      <div className="absolute bottom-1 right-2 flex items-center gap-1 text-xs text-gray-500">
        {time && <span>{time}</span>}
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default MessageBubble;
