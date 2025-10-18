"use client";

import { useRef, useEffect, useState } from "react";
import MessageSubject from "./MessageSubject";
import MessageActions from "./MessageActions";
import MessageOptions from "./MessageOptions";
import MessageScripts from "./MessageScripts";
import MessageVariables from "./MessageVariables";
import { MessageProvider, useMessageContext } from "@/contexts/MessageContext";
import { MessageVariablesTarget } from "@/types/types";

const MessageInputBarInner = () => {
  const {
    showOptions,
    showScripts,
    showVariables,
    input,
    method,
    setMethod,
    setShowOptions,
    setShowScripts,
    setShowVariables,
  } = useMessageContext();

  const [variableTarget, setVariableTarget] =
    useState<MessageVariablesTarget | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
    setShowScripts(false);
    setShowVariables(false);
  };

  const toggleMethod = () => {
    setMethod(method === "sms" ? "email" : "sms");
    setShowOptions(false);
    setShowScripts(false);
    setShowVariables(false);
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [input]);

  return (
    <div className=" bg-black text-white border-t border-grayCustom z-10 w-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="w-full  px-4 pb-4 pt-2">
          {method === "email" && <MessageSubject />}

          <MessageActions
            toggleOptions={toggleOptions}
            showOptions={showOptions || showScripts || showVariables}
            textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
          />

          {showOptions && !showScripts && !showVariables && (
            <MessageOptions
              toggleMethod={toggleMethod}
              showScripts={() => {
                setShowScripts(true);
                setShowVariables(false);
              }}
              showVariables={(target) => {
                setVariableTarget(target);
                setShowVariables(true);
                setShowScripts(false);
              }}
            />
          )}

          {showScripts && <MessageScripts />}
          {showVariables && (
            <MessageVariables target={variableTarget ?? "body"} />
          )}
        </div>
      </div>
    </div>
  );
};

const MessageInputBar = () => (
  <MessageProvider>
    <MessageInputBarInner />
  </MessageProvider>
);

export default MessageInputBar;
