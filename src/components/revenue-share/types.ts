export interface RevenueShareItem {
  id: string;
  brand: string;
  trackerId: string;
  username: string;
  affiliate: string;
  grossRevenue: number;
  sharePercentage: number;
  shareAmount: number;
  netRevenue: number;
  currency: string;
  lastUpdated: string;
}

export interface RevenueShareFilterOptions {
  brand: string;
  trackerId: string;
  username: string;
  affiliate: string;
  startDate?: string;
  endDate?: string;
  minSharePercentage?: number;
  maxSharePercentage?: number;
}
