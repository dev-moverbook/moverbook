"use client";

import { useSlugContext } from "@/contexts/SlugContext";
import { useUpdateCompany } from "@/hooks/companies";
import { useUpdateCompliance } from "@/hooks/compliances";
import { useUpdateWebIntegrations } from "@/hooks/webIntegrations";
import { useUpdateCompanyContact } from "@/hooks/companyContacts";
import CompanySection from "../sections/CompanySection";
import ComplianceSection from "../sections/ComplianceSection";
import WebIntegrationsSection from "../sections/WebIntegrationsSection";
import CompanyContactSection from "../sections/CompanyContactSection";
import { useUpdateOrganizationLogo } from "@/hooks/companies";
import VerticalSectionGroup from "@/components/shared/section/VerticalSectionGroup";
import { useGetCompanyDetails } from "@/hooks/companies";

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

  switch (result) {
    case undefined:
      content = null;
      break;

    default: {
      const { company, compliance, webIntegrations, companyContact } = result;

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
