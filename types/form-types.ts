export interface ComplianceFormData {
  statePucPermitNumber: string;
  dmvNumber: string;
  usDotNumber: string;
}

export interface WebIntegrationsFormData {
  webform?: string;
  webformEmbeddedCode?: string;
}

export interface CompanyContactFormData {
  email?: string;
  phoneNumber?: string;
  address?: string;
  website?: string;
}

export interface UpdateCompanyData {
  name?: string;
  timeZone?: string;
}
