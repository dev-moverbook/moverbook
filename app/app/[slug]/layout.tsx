import { notFound } from "next/navigation";
import { SlugProvider } from "@/contexts/SlugContext";
import SlugClientShell from "../../../components/shell/SlugClientShell";
import { normalizeSlug } from "@/frontendUtils/normalizeParams";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import ErrorMessage from "@/components/shared/error/ErrorMessage";

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
  const company = await fetchQuery(
    api.companies.getCompanyIdBySlug,
    { slug },
    { token }
  );

  return (
    <SlugProvider initialSlug={slug} company={company}>
      <SlugClientShell>{children}</SlugClientShell>
    </SlugProvider>
  );
}
