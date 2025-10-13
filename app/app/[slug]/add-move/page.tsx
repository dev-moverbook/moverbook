import AddMovePage from "@/app/app/[slug]/add-move/AddMovePage";

type PageSearchParams = {
  moveCustomerId?: string | string[];
  duplicateFrom?: string | string[];
  fields?: string | string[];
};

function getFirstStringValue(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>;
}) {
  const searchParamsData = await searchParams;

  const moveCustomerId =
    getFirstStringValue(searchParamsData.moveCustomerId) ?? null;

  const duplicateFromId =
    getFirstStringValue(searchParamsData.duplicateFrom) ?? null;

  const rawFields = getFirstStringValue(searchParamsData.fields) ?? "";
  const fieldsToDuplicate =
    rawFields
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean) ?? [];

  return (
    <AddMovePage
      moveCustomerId={moveCustomerId}
      duplicateFromId={duplicateFromId}
      fieldsToDuplicate={fieldsToDuplicate}
    />
  );
}
