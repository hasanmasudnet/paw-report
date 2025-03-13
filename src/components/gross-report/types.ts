export interface GrossReportItem {
  id: string;
  brand: string;
  trackerId: string;
  deduction: number;
  adminFee: number;
  username: string;
  affiliate: string;
  netRevenue: number;
  profit: number;
  currency: string;
  lastUpdated: string;
  affiliateId?: string;
}

export interface GrossReportFilterOptions {
  year: string;
  month: string;
  brand: string;
  trackerId: string;
  username: string;
  affiliateId: string;
  affiliate: string;
}
