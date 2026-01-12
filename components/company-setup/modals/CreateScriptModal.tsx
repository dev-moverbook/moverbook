"use client";

import { useEffect, useState, useMemo } from "react";
import { FrontEndErrorMessages } from "@/types/errors";
import { CommunicationType } from "@/types/types";
import { Doc, Id } from "@/convex/_generated/dataModel";
import FormActions from "@/components/shared/buttons/FormActions";
import ToggleTabs from "@/components/shared/tab/ToggleTabs";
import LabeledInput from "@/components/shared/labeled/LabeledInput";
import LabeledTextarea from "@/components/shared/labeled/LabeledTextarea";
import VariableInsertButtons from "@/components/shared/buttons/VariableInsertButtons";
import FieldGroup from "@/components/shared/field/FieldGroup";
import ResponsiveModal from "@/components/shared/modal/ResponsiveModal";
import FormActionContainer from "@/components/shared/containers/FormActionContainer";

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
  editingScript: Doc<"scripts"> | null;
}

const CreateScriptModal: React.FC<CreateScriptModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onEdit,
  createLoading,
  createError,
  editingScript,
}) => {
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<CommunicationType>("sms");
  const [message, setMessage] = useState<string>("");
  const [emailTitle, setEmailTitle] = useState<string>("");

  const [titleError, setTitleError] = useState<string | null>(null);
  const [emailTitleError, setEmailTitleError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingScript) {
        setTitle(editingScript.title);
        setType(editingScript.type);
        setMessage(editingScript.message);
        setEmailTitle(editingScript.emailTitle || "");
      } else {
        setTitle("");
        setType("sms");
        setMessage("");
        setEmailTitle("");
      }
      setTitleError(null);
      setEmailTitleError(null);
      setMessageError(null);
    }
  }, [editingScript, isOpen]);

  const handleClose = () => {
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
    if (type === "email" && !emailTitle.trim()) {
      setEmailTitleError(FrontEndErrorMessages.EMAIL_TITLE_REQUIRED);
      return;
    }

    const success = editingScript
      ? await onEdit(
          editingScript._id,
          title.trim(),
          type,
          message,
          emailTitle || undefined
        )
      : await onCreate(title.trim(), type, message, emailTitle || undefined);

    if (success) {
      handleClose();
    }
  };

  const insertVariable = (
    variableName: string,
    target: "message" | "emailTitle"
  ) => {
    const formatted = `{{${variableName}}}`;
    if (target === "message") {
      setMessage((prev) => prev + formatted);
    } else {
      setEmailTitle((prev) => prev + formatted);
    }
  };

  const hasChanges = useMemo(() => {
    if (!editingScript) {
      return true;
    }

    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();
    const trimmedEmailTitle = emailTitle.trim();

    return (
      trimmedTitle !== editingScript.title ||
      type !== editingScript.type ||
      trimmedMessage !== editingScript.message ||
      trimmedEmailTitle !== (editingScript.emailTitle || "")
    );
  }, [title, type, message, emailTitle, editingScript]);

  const isValid =
    title.trim() !== "" &&
    message.trim() !== "" &&
    (type !== "email" || emailTitle.trim() !== "");

  const canSave = isValid && (editingScript ? hasChanges : true);

  const titleText = editingScript ? "Edit Script" : "Create Script";
  const description = editingScript
    ? "Modify the communication script and variables."
    : "Create a reusable script template for email or SMS, using variables to personalize your message.";

  const saveLabel = editingScript
    ? createLoading
      ? "Saving..."
      : "Save Changes"
    : createLoading
      ? "Creating..."
      : "Create Script";

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
          setType(val as CommunicationType);
          if (val !== "email") setEmailTitle("");
          setEmailTitleError(null);
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
          saveLabel={saveLabel}
          disabled={!canSave}
        />
      </FormActionContainer>
    </FieldGroup>
  );

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
