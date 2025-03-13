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
  startDate?: string;
  endDate?: string;
}
