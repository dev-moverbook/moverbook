import React, { useState } from "react";
import ScriptsSection from "../sections/ScriptsSection";
import VariablesSection from "../sections/VariablesSection";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { CommunicationType, ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { useCreateScript } from "../hooks/useCreateScript";
import CreateScriptModal from "../modals/CreateScriptModal";
import { useDeleteScript } from "../hooks/useDeleteScript";
import { Id } from "@/convex/_generated/dataModel";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { ScriptSchema } from "@/types/convex-schemas";
import { useUpdateScript } from "../hooks/useUpdateScript";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";

interface UpdateScriptData {
  title?: string;
  type?: CommunicationType;
  message?: string;
  emailTitle?: string;
}

const ScriptsTab = () => {
  const { companyId } = useSlugContext();

  const { createScript, createLoading, createError, setCreateError } =
    useCreateScript();

  const {
    updateScript,
    updateLoading: updateScriptLoading,
    updateError: updateErrorLoading,
    setUpdateError: setUpdateScriptError,
  } = useUpdateScript();

  const { deleteScript, deleteLoading, deleteError, setDeleteError } =
    useDeleteScript();
  const [deleteScriptId, setDeleteScriptId] = useState<Id<"scripts"> | null>(
    null
  );

  const [isScriptModalOpen, setIsScriptModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [editingScript, setEditingScript] = useState<ScriptSchema | null>(null);

  const scriptsAndVariablesResponse = useQuery(
    api.scripts.getActiveScriptsAndVariablesByCompanyId,
    companyId ? { companyId } : "skip"
  );

  const handleCreateScript = async (
    title: string,
    type: CommunicationType,
    message: string,
    emailTitle?: string
  ): Promise<boolean> => {
    if (!companyId) {
      console.error(FrontEndErrorMessages.COMPANY_NOT_FOUND);
      setCreateError(FrontEndErrorMessages.GENERIC);
      return false;
    }
    return await createScript({ companyId, title, type, message, emailTitle });
  };

  const handleDeleteClick = (scriptId: Id<"scripts">) => {
    setDeleteScriptId(scriptId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteScriptId) {
      setUpdateScriptError(FrontEndErrorMessages.GENERIC);
      return;
    }
    const success = await deleteScript(deleteScriptId);
    if (success) {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteScriptId(null);
    setDeleteError(null);
  };

  const handleEditScript = async (
    scriptId: Id<"scripts">,
    title: string,
    type: CommunicationType,
    message: string,
    emailTitle?: string
  ): Promise<boolean> => {
    if (!scriptId) return false;

    const updates: UpdateScriptData = {
      title,
      type,
      message,
      emailTitle,
    };

    const success = await updateScript(scriptId, updates);
    if (success) {
      setIsScriptModalOpen(false);
      setEditingScript(null);
    }
    return success;
  };

  const handleEditScriptClick = (script: ScriptSchema) => {
    setEditingScript(script);
    setIsScriptModalOpen(true);
  };

  if (!companyId) return <p className="text-gray-500">No company selected.</p>;

  if (!scriptsAndVariablesResponse) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }
  if (scriptsAndVariablesResponse.status === ResponseStatus.ERROR) {
    return <ErrorMessage message={scriptsAndVariablesResponse.error} />;
  }

  const { scripts, variables } = scriptsAndVariablesResponse.data;

  return (
    <div>
      <ScriptsSection
        scripts={scripts}
        setIsScriptModalOpen={setIsScriptModalOpen}
        onDeleteClick={handleDeleteClick}
        onEdit={handleEditScriptClick}
      />
      <VariablesSection variables={variables} />

      <CreateScriptModal
        isOpen={isScriptModalOpen}
        onClose={() => {
          setIsScriptModalOpen(false);
          setEditingScript(null);
        }}
        onCreate={handleCreateScript}
        onEdit={handleEditScript}
        createLoading={editingScript ? updateScriptLoading : createLoading}
        createError={editingScript ? updateErrorLoading : createError}
        variables={variables}
        editingScript={editingScript}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
      />
    </div>
  );
};

export default ScriptsTab;
