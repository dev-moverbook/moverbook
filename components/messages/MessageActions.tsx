"use client";

import { Plus, X, MessageSquare, Mail, SendHorizontal } from "lucide-react";
import { RefObject } from "react";
import { useMessageContext } from "@/contexts/MessageContext";
import IconButton from "@/components/shared/IconButton";
import { Textarea } from "@/components/ui/textarea";
import { useMoveContext } from "@/contexts/MoveContext";
import { useCreateMessage } from "@/hooks/messages";

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
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div>
      {createMessageError && (
        <p className=" text-red-500 text-center ">{createMessageError}</p>
      )}

      <div className="flex items-end gap-2">
        <IconButton
          onClick={toggleOptions}
          icon={showOptions ? <X /> : <Plus />}
          variant="ghost"
          className="w-8 h-8"
          title="Toggle Options"
        />

        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setCreateMessageError(null);
          }}
          className="  flex-1 bg-transparent border  text-white outline-none  border-grayCustom resize-none overflow-y-auto  "
          placeholder={
            method === "sms" ? "Type text message..." : "Type email message..."
          }
          rows={1}
        />

        {input.trim() ? (
          <IconButton
            icon={<SendHorizontal className="w-5 h-5 text-white" />}
            onClick={handleSend}
            variant="green"
            className="w-8 h-8 p-4"
            loading={createMessageLoading}
            title="Send"
          />
        ) : (
          <IconButton
            onClick={toggleMethod}
            icon={
              method === "sms" ? (
                <MessageSquare className="text-white " />
              ) : (
                <Mail className="text-white " />
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
