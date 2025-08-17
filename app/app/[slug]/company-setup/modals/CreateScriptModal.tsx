"use client";

import React, { useEffect, useState } from "react";
import { FrontEndErrorMessages } from "@/types/errors";
import { CommunicationType } from "@/types/types";
import { Doc, Id } from "@/convex/_generated/dataModel";
import FormActions from "@/app/components/shared/FormActions";
import ToggleTabs from "@/app/components/shared/ToggleTabs";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import LabeledTextarea from "@/app/components/shared/labeled/LabeledTextarea";
import VariableInsertButtons from "@/app/components/shared/VariableInsertButtons";
import FieldGroup from "@/app/components/shared/FieldGroup";
import ResponsiveModal from "@/app/components/shared/modal/ResponsiveModal";
import FormActionContainer from "@/app/components/shared/containers/FormActionContainer";

interface CreateScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    title: string,
    type: CommunicationType,
    message: string,
    emailTitle?: string
  ) => Promise<boolean>;
  onEdit: (
    scriptId: Id<"scripts">,
    title: string,
    type: CommunicationType,
    message: string,
    emailTitle?: string
  ) => Promise<boolean>;
  createLoading: boolean;
  createError: string | null;
  variables: Doc<"variables">[];
  editingScript: Doc<"scripts"> | null;
}

const CreateScriptModal: React.FC<CreateScriptModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  createLoading,
  createError,
  variables,
  editingScript,
}) => {
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<CommunicationType>("sms");
  const [message, setMessage] = useState<string>("");
  const [emailTitle, setEmailTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [emailTitleError, setEmailTitleError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  const isDisabled =
    title.trim() === "" ||
    message.trim() === "" ||
    (type === "email" && emailTitle.trim() === "");

  useEffect(() => {
    if (editingScript) {
      setTitle(editingScript.title);
      setType(editingScript.type);
      setMessage(editingScript.message);
      setEmailTitle(editingScript.emailTitle || "");
    } else {
      resetState();
    }
  }, [editingScript]);

  const resetState = () => {
    setTitle("");
    setType("sms");
    setMessage("");
    setEmailTitle("");
    setTitleError(null);
    setEmailTitleError(null);
    setMessageError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError(FrontEndErrorMessages.SCRIPT_TITLE_REQUIRED);
      return;
    }

    if (!message.trim()) {
      setMessageError(FrontEndErrorMessages.SCRIPT_MESSAGE_REQUIRED);
      return;
    }

    if (type === "email" && (!emailTitle || emailTitle.trim() === "")) {
      setEmailTitleError(FrontEndErrorMessages.EMAIL_TITLE_REQUIRED);
      return;
    }

    const success = editingScript
      ? await onEdit(editingScript._id, title, type, message, emailTitle)
      : await onCreate(title, type, message, emailTitle);

    if (success) handleClose();
  };

  const insertVariable = (
    variableName: string,
    target: "message" | "emailTitle"
  ) => {
    const formattedVariable = `{{${variableName}}}`;
    if (target === "message") {
      setMessage((prev) => prev + formattedVariable);
    } else {
      setEmailTitle((prev) => prev + formattedVariable);
    }
  };

  const formContent = (
    <FieldGroup>
      <LabeledInput
        label="Script Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setTitleError(null);
        }}
        placeholder="Enter script title"
        error={titleError}
        noPlaceholderError={true}
      />

      <ToggleTabs
        label="Type"
        value={type}
        onChange={(val) => {
          setType(val);
          if (val !== "email") setEmailTitle("");
        }}
        options={[
          { label: "SMS", value: "sms" },
          { label: "Email", value: "email" },
        ]}
      />

      {type === "email" && (
        <div className="space-y-2">
          <LabeledInput
            label="Email Subject"
            value={emailTitle}
            onChange={(e) => {
              setEmailTitle(e.target.value);
              setEmailTitleError(null);
            }}
            placeholder="Enter email subject"
            error={emailTitleError}
            noPlaceholderError={true}
          />
          <VariableInsertButtons
            variables={variables}
            onInsert={(name) => insertVariable(name, "emailTitle")}
          />
        </div>
      )}

      <div className="space-y-2">
        <LabeledTextarea
          label="Message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setMessageError(null);
          }}
          placeholder="Enter script message"
          error={messageError}
          noPlaceholderError={true}
        />
        <VariableInsertButtons
          variables={variables}
          onInsert={(name) => insertVariable(name, "message")}
        />
      </div>
      <FormActionContainer className="mt-10">
        <FormActions
          onSave={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          onCancel={handleClose}
          isSaving={createLoading}
          error={createError}
          saveLabel={editingScript ? "Save Changes" : "Create Script"}
          disabled={isDisabled}
        />
      </FormActionContainer>
    </FieldGroup>
  );

  const titleText = editingScript ? "Edit Script" : "Create Script";
  const description = editingScript
    ? "Modify the communication script and variables."
    : "Create a reusable script template for email or SMS, using variables to personalize your message.";

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title={titleText}
      description={description}
      heightVh={80}
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default CreateScriptModal;
