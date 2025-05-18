"use client";

import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { FrontEndErrorMessages } from "@/types/errors";
import { CommunicationType } from "@/types/enums";
import { ScriptSchema, VariableSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";
import FormActions from "@/app/components/shared/FormActions";
import ToggleTabs from "@/app/components/shared/ToggleTabs";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import VariableInsertButtons from "@/app/components/shared/VariableInsertButtons";
import FieldGroup from "@/app/components/shared/FieldGroup";
import LabeledTextarea from "@/app/components/shared/labeled/LabeledTextarea";

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
  variables: VariableSchema[];
  editingScript: ScriptSchema | null;
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
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<CommunicationType>(CommunicationType.EMAIL);
  const [message, setMessage] = useState<string>("");
  const [emailTitle, setEmailTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [emailTitleError, setEmailTitleError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

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
    setType(CommunicationType.EMAIL);
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

    if (
      type === CommunicationType.EMAIL &&
      (!emailTitle || emailTitle.trim() === "")
    ) {
      setEmailTitleError(FrontEndErrorMessages.EMAIL_TITLE_REQUIRED);
      return;
    }

    if (editingScript) {
      const success = await onEdit(
        editingScript._id,
        title,
        type,
        message,
        emailTitle
      );
      if (success) {
        handleClose();
      }
    } else {
      const success = await onCreate(title, type, message, emailTitle);
      if (success) {
        handleClose();
      }
    }
  };

  const insertVariable = (
    variableName: string,
    target: "message" | "emailTitle"
  ) => {
    const formattedVariable = `{{${variableName}}}`;
    if (target === "message") {
      setMessage((prev) => prev + formattedVariable);
    } else if (target === "emailTitle") {
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
      />

      <ToggleTabs
        label="Type"
        value={type}
        onChange={(val) => {
          setType(val);
          if (val !== CommunicationType.EMAIL) setEmailTitle("");
        }}
        options={[
          { label: "Email", value: CommunicationType.EMAIL },
          { label: "SMS", value: CommunicationType.SMS },
        ]}
      />

      {type === CommunicationType.EMAIL && (
        <div>
          <LabeledInput
            label="Email Subject"
            value={emailTitle}
            onChange={(e) => {
              setEmailTitle(e.target.value);
              setEmailTitleError(null);
            }}
            placeholder="Enter email subject"
            error={emailTitleError}
          />

          <VariableInsertButtons
            variables={variables}
            onInsert={(name) => insertVariable(name, "emailTitle")}
          />
        </div>
      )}

      <div>
        <LabeledTextarea
          label="Message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setMessageError(null);
          }}
          placeholder="Enter script message"
          error={messageError}
        />

        <VariableInsertButtons
          variables={variables}
          onInsert={(name) => insertVariable(name, "message")}
        />
      </div>

      <FormActions
        onSave={handleSubmit}
        onCancel={handleClose}
        isSaving={createLoading}
        saveLabel={editingScript ? "Save Changes" : "Create Script"}
        error={createError}
      />
    </FieldGroup>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>
          {editingScript ? "Edit Script" : "Create Script"}
        </DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>
          {editingScript ? "Edit Script" : "Create Script"}
        </DialogTitle>
        <DialogDescription>Enter in a script</DialogDescription>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default CreateScriptModal;
