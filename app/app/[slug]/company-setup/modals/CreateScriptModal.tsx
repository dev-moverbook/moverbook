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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { FrontEndErrorMessages } from "@/types/errors";
import { CommunicationType } from "@/types/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScriptSchema, VariableSchema } from "@/types/convex-schemas";
import { Id } from "@/convex/_generated/dataModel";

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
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium">Script Title</Label>
        <Input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(null);
          }}
          placeholder="Enter script title"
        />
        {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
      </div>

      <div>
        <Label className="block text-sm font-medium">Type</Label>
        <Select
          value={type}
          onValueChange={(value) => {
            setType(value as CommunicationType);
            if (value !== CommunicationType.EMAIL) {
              setEmailTitle("");
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CommunicationType.EMAIL}>Email</SelectItem>
            <SelectItem value={CommunicationType.SMS}>SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === CommunicationType.EMAIL && (
        <div>
          <Label className="block text-sm font-medium">Email Subject</Label>
          <Input
            type="text"
            value={emailTitle}
            onChange={(e) => {
              setEmailTitle(e.target.value);
              setEmailTitleError(null);
            }}
            placeholder="Enter email subject"
          />
          {emailTitleError && (
            <p className="text-red-500 text-sm">{emailTitleError}</p>
          )}

          {/* Variable Buttons for Email Title */}
          <div className="flex flex-wrap gap-2 mt-2">
            {variables.map((variable) => (
              <Button
                key={variable._id}
                variant="outline"
                size="sm"
                onClick={() => insertVariable(variable.name, "emailTitle")}
              >
                {variable.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label className="">Message</Label>
        <Textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setMessageError(null);
          }}
          placeholder="Enter script message"
        />
        {messageError && <p className="text-red-500 text-sm">{messageError}</p>}

        {/* Variable Buttons for Message */}
        <div className="flex flex-wrap gap-2 mt-2">
          {variables.map((variable) => (
            <Button
              key={variable._id}
              variant="outline"
              size="sm"
              onClick={() => insertVariable(variable.name, "message")}
            >
              {variable.name}
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={createLoading}
        className="w-full"
      >
        {createLoading
          ? "Saving..."
          : editingScript
            ? "Save Changes"
            : "Create Script"}
      </Button>

      {createError && <p className="text-red-500 text-sm">{createError}</p>}
    </div>
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
