import { notFound } from "next/navigation";
import { MoveProvider } from "@/contexts/MoveContext";
import { normalizeMoveId } from "@/frontendUtils/normalizeParams";

const MoveLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ moveId: string }>;
}) => {
  const { moveId: raw } = await params;
  const moveId = normalizeMoveId(raw);
  if (!moveId) {
    notFound();
  }

  return <MoveProvider moveId={moveId}>{children}</MoveProvider>;
};

export default MoveLayout;
