import PublicMoveIdPage from "@/components/publicMoveId/PublicMoveIdPage";

const stepMap: Record<string, number> = {
  quote: 1,
  documents: 2,
  move: 3,
  payment: 4,
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;

  const initialStep =
    step && stepMap[step.toLowerCase()] ? stepMap[step.toLowerCase()] : 1;

  return <PublicMoveIdPage initialStep={initialStep} />;
}
