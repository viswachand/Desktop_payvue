export interface AdminConfig {
  id?: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyPostalCode: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyFax?: string;
  taxRate: number;
  createdAt?: string;
  updatedAt?: string;
}
