"use client";

import { useSlugContext } from "@/app/contexts/SlugContext";
import { useUpdateCompany } from "../hooks/useUpdateCompany";
import { useUpdateCompliance } from "../hooks/useUpdateCompliance";
import { useUpdateWebIntegrations } from "../hooks/useUpdateWebIntegrations";
import { useUpdateCompanyContact } from "../hooks/useUpdateCompanyContact";
import CompanySection from "../sections/CompanySection";
import ComplianceSection from "../sections/ComplianceSection";
import WebIntegrationsSection from "../sections/WebIntegrationsSection";
import CompanyContactSection from "../sections/CompanyContactSection";
import { useUpdateOrganizationLogo } from "../hooks/useUpdateOrganizationLogo";
import VerticalSectionGroup from "@/app/components/shared/VerticalSectionGroup";
import ErrorMessage from "@/app/components/shared/error/ErrorMessage";
import { useGetCompanyDetails } from "@/app/hooks/queries/companies/useGetCompanyDetails";
import { QueryStatus } from "@/types/enums";

const GeneralTab = () => {
  const { companyId } = useSlugContext();

  const result = useGetCompanyDetails(companyId);

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

  let content: React.ReactNode;

  switch (result.status) {
    case QueryStatus.LOADING:
      content = null;
      break;

    case QueryStatus.ERROR:
      content = <ErrorMessage message={result.errorMessage} />;
      break;

    case QueryStatus.SUCCESS: {
      const { company, compliance, webIntegrations, companyContact } =
        result.data;

      content = (
        <>
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
        </>
      );
      break;
    }
  }

  return <VerticalSectionGroup>{content}</VerticalSectionGroup>;
};

export default GeneralTab;
