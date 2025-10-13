import { notFound } from "next/navigation";
import { SlugProvider } from "@/app/contexts/SlugContext";
import SlugClientShell from "./SlugClientShell";
import { use } from "react";
import { normalizeSlug } from "@/app/frontendUtils/normalizeParams";

export default function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug: raw } = use(params);
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
