import { notFound } from "next/navigation";
import {
  normalizeMoveId,
  normalizeSlug,
} from "@/frontendUtils/normalizeParams";
import { PublicMoveIdProvider } from "@/contexts/PublicMovIdContext";

export default async function PublicMoveIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; moveId: string }>;
}) {
  const { slug: raw, moveId: rawMoveId } = await params;
  const slug = normalizeSlug(raw);
  const moveId = normalizeMoveId(rawMoveId);
  if (!slug || !moveId) {
    notFound();
  }

  return (
    <PublicMoveIdProvider initialMoveId={moveId}>
      {children}
    </PublicMoveIdProvider>
  );
}
