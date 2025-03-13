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
  minImpressions?: number;
  maxImpressions?: number;
  minClicks?: number;
  maxClicks?: number;
  minDeposits?: number;
  maxDeposits?: number;
  startDate?: string;
  endDate?: string;
}
