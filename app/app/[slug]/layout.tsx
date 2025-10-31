import { notFound } from "next/navigation";
import { SlugProvider } from "@/contexts/SlugContext";
import SlugClientShell from "../../../components/shell/SlugClientShell";
import { normalizeSlug } from "@/frontendUtils/normalizeParams";

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug: raw } = await params;
  const slug = normalizeSlug(raw);
  if (!slug) {
    notFound();
  }

  return (
    <SlugProvider initialSlug={slug}>
      <SlugClientShell>{children}</SlugClientShell>
    </SlugProvider>
  );
}
