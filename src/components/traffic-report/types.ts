export interface TrafficReportItem {
  id: string;
  brand: string;
  trackerId: string;
  impressions: number;
  clicks: number;
  newDeposits: number;
  lastUpdated: string;
  ctr?: number; // Click-through rate (calculated)
  conversionRate?: number; // Conversion rate (calculated)
}

export interface TrafficReportFilterOptions {
  brand: string;
  trackerId: string;
  year?: string;
  month?: string;
  startDate?: string;
  endDate?: string;
}
