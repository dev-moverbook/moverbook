"use client";

import { Plus, X, MessageSquare, Mail, SendHorizontal } from "lucide-react";
import { RefObject } from "react";
import { useMessageContext } from "@/contexts/MessageContext";
import IconButton from "@/components/shared/buttons/IconButton";
import { Textarea } from "@/components/ui/textarea";
import { useMoveContext } from "@/contexts/MoveContext";
import { useCreateMessage } from "@/hooks/messages";
import MessageSubject from "./MessageSubject";
import { Label } from "../ui/label";

interface Props {
  toggleOptions: () => void;
  showOptions: boolean;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

const MessageActions = ({ toggleOptions, showOptions, textareaRef }: Props) => {
  const {
    input,
    setInput,
    method,
    setMethod,
    setSubject,
    setShowOptions,
    setShowScripts,
    setShowVariables,
    subject,
  } = useMessageContext();

  const { moveData } = useMoveContext();
  const {
    createMessage,
    createMessageLoading,
    createMessageError,
    setCreateMessageError,
  } = useCreateMessage();

  const toggleMethod = () => {
    setMethod(method === "sms" ? "email" : "sms");
  };

  const handleSend = async () => {
    setCreateMessageError(null);
    const success = await createMessage({
      moveId: moveData.move._id,
      method: method,
      message: input,
      subject: subject,
    });
    if (success) {
      setInput("");
      setSubject("");
      setShowOptions(false);
      setShowScripts(false);
      setShowVariables(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const hasText = input.trim().length > 0;
  const hasSubject = subject && subject.trim().length > 0;
  const canSend = method === "sms" ? hasText : hasText && hasSubject;

  return (
    <div>
      {createMessageError && (
        <p className="text-red-500 text-center mb-2">{createMessageError}</p>
      )}

      {method === "email" && <MessageSubject />}

      <div className="flex items-end gap-2">
        <IconButton
          onClick={toggleOptions}
          icon={showOptions ? <X /> : <Plus />}
          variant="ghost"
          className="w-8 h-8"
          title="Toggle Options"
        />
        <div className="items-end  w-full ">
          {method === "email" && <Label htmlFor="message-input">Message</Label>}

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setCreateMessageError(null);
            }}
            placeholder={method === "sms" ? "Text message" : "Email message"}
            rows={1}
          />
        </div>

        {canSend ? (
          <IconButton
            icon={<SendHorizontal className="w-4 h-4 text-white" />}
            onClick={handleSend}
            variant="green"
            className="p-2"
            loading={createMessageLoading}
            title="Send"
          />
        ) : (
          <IconButton
            onClick={toggleMethod}
            icon={
              method === "sms" ? (
                <MessageSquare className="text-white" />
              ) : (
                <Mail className="text-white" />
              )
            }
            variant="ghost"
            className="w-8 h-8"
            title="Toggle Method"
          />
        )}
      </div>
    </div>
  );
};

export default MessageActions;
