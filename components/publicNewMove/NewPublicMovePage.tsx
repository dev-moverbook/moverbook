"use client";

import { PublicNewMoveFormProvider } from "@/contexts/PublicNewMoveFormContext";
import PublicNewMovePageContent from "./components/PublicNewMovePageContent";

const NewPublicMovePage = () => {
  return (
    <PublicNewMoveFormProvider>
      <PublicNewMovePageContent />
    </PublicNewMoveFormProvider>
  );
};

export default NewPublicMovePage;
