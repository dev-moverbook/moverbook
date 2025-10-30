import { notFound } from "next/navigation";
import { MoveProvider } from "@/contexts/MoveContext";
import { normalizeMoveId } from "@/frontendUtils/normalizeParams";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ErrorMessage from "@/components/shared/error/ErrorMessage";
import { auth } from "@clerk/nextjs/server";

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

  const { userId, getToken } = await auth();
  if (!userId) {
    return (
      <ErrorMessage message={"You must be signed in to view this page."} />
    );
  }

  const token = await getToken({ template: "convex" });

  if (!token) {
    return (
      <ErrorMessage message={"You must be signed in to view this page."} />
    );
  }
  const data = await fetchQuery(
    api.moves.getMoveContext,
    { moveId },
    { token }
  );

  return <MoveProvider value={{ moveData: data }}>{children}</MoveProvider>;
};

export default MoveLayout;
