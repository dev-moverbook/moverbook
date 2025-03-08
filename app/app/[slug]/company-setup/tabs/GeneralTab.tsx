"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponseStatus } from "@/types/enums";
import { FrontEndErrorMessages } from "@/types/errors";
import { useUpdateCompany } from "../hooks/useUpdateCompany";
import { useUpdateCompliance } from "../hooks/useUpdateCompliance";
import { useUpdateWebIntegrations } from "../hooks/useUpdateWebIntegrations";
import { useUpdateCompanyContact } from "../hooks/useUpdateCompanyContact";
import CompanySection from "../sections/CompanySection";
import ComplianceSection from "../sections/ComplianceSection";
import WebIntegrationsSection from "../sections/WebIntegrationsSection";
import CompanyContactSection from "../sections/CompanyContactSection";
import { useUpdateOrganizationLogo } from "../hooks/useUpdateOrganizationLogo";

const GeneralTab = () => {
  const { companyId } = useSlugContext();

  // Fetch company details
  const companyDetailsResponse = useQuery(
    api.companies.getCompanyDetails,
    companyId ? { companyId } : "skip"
  );

  // Hooks for updating sections
  const {
    updateCompany,
    updateCompanyLoading,
    updateCompanyError,
    setUpdateCompanyError,
  } = useUpdateCompany();

  const {
    updateCompliance,
    updateComplianceLoading,
    updateComplianceError,
    setUpdateComplianceError,
  } = useUpdateCompliance();

  const {
    updateWebIntegrations,
    updateWebIntegrationsLoading,
    updateWebIntegrationsError,
    setUpdateWebIntegrationsError,
  } = useUpdateWebIntegrations();

  const {
    updateCompanyContact,
    updateCompanyContactLoading,
    updateCompanyContactError,
    setUpdateCompanyContactError,
  } = useUpdateCompanyContact();

  const { uploadOrganizationLogo, uploadLoading, uploadError } =
    useUpdateOrganizationLogo();

  if (!companyId) return <p className="text-gray-500">No company selected.</p>;

  if (!companyDetailsResponse) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }

  if (companyDetailsResponse.status === ResponseStatus.ERROR) {
    return (
      <div className="text-red-500">
        Error: {companyDetailsResponse.error || FrontEndErrorMessages.GENERIC}
      </div>
    );
  }

  const { company, compliance, webIntegrations, companyContact } =
    companyDetailsResponse.data;

  return (
    <div className="p-4 space-y-6">
      <CompanySection
        company={company}
        updateCompany={updateCompany}
        updateLoading={updateCompanyLoading}
        updateError={updateCompanyError}
        setUpdateError={setUpdateCompanyError}
        uploadOrganizationLogo={uploadOrganizationLogo}
        uploadLoading={uploadLoading}
        uploadError={uploadError}
      />
      <CompanyContactSection
        companyContact={companyContact}
        updateCompanyContact={updateCompanyContact}
        updateLoading={updateCompanyContactLoading}
        updateError={updateCompanyContactError}
        setUpdateError={setUpdateCompanyContactError}
      />
      <ComplianceSection
        compliance={compliance}
        updateCompliance={updateCompliance}
        updateLoading={updateComplianceLoading}
        updateError={updateComplianceError}
        setUpdateError={setUpdateComplianceError}
      />
      <WebIntegrationsSection
        webIntegrations={webIntegrations}
        updateWebIntegrations={updateWebIntegrations}
        updateLoading={updateWebIntegrationsLoading}
        updateError={updateWebIntegrationsError}
        setUpdateError={setUpdateWebIntegrationsError}
      />
    </div>
  );
};

export default GeneralTab;
