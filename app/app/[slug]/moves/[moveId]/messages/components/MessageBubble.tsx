import { cn } from "@/lib/utils";
import { CommunicationType, MessageSentType } from "@/types/types";
import { Mail, MessageSquare } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  time: string | null; // already formatted like "2:00pm"
  type: MessageSentType;
  method: CommunicationType;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  time,
  type,
  method,
}) => {
  const isIncoming = type === "incoming";
  const Icon = method === "sms" ? MessageSquare : Mail;

  return (
    <div
      className={cn(
        "max-w-xs md:max-w-sm p-3 rounded-xl min-w-36 relative text-sm shadow",
        isIncoming
          ? "bg-white text-black self-start rounded-bl-none"
          : "bg-green-100 text-black self-end rounded-br-none"
      )}
    >
      <p className="mb-5">{text}</p>
      <div className="absolute bottom-1 right-2 flex items-center text-xs text-gray-500 gap-1">
        <span>{time}</span>
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
};

export default MessageBubble;
