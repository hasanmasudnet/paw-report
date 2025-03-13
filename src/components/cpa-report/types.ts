export interface CPAReportItem {
  id: string;
  brand: string;
  trackerId: string;
  username: string;
  cpaCount: number;
  currency: string;
  lastUpdated: string;
}

export interface CPAReportFilterOptions {
  brand: string;
  trackerId: string;
  username: string;
  affiliate?: string;
  year?: string;
  month?: string;
  startDate?: string;
  endDate?: string;
}
