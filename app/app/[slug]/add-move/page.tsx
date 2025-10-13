import AddMovePage from "@/app/app/[slug]/add-move/AddMovePage";

export default function Page({
  searchParams,
}: {
  searchParams: {
    moveCustomerId?: string;
    duplicateFrom?: string;
    fields?: string;
  };
}) {
  const moveCustomerId = searchParams.moveCustomerId ?? null;
  const duplicateFromId = searchParams.duplicateFrom ?? null;
  const fieldsToDuplicate =
    searchParams.fields
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <AddMovePage
      moveCustomerId={moveCustomerId}
      duplicateFromId={duplicateFromId}
      fieldsToDuplicate={fieldsToDuplicate}
    />
  );
}
