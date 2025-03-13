export interface Affiliate {
  id: string;
  username: string;
  brand: string;
  category: string;
  dealType: string; // CPA, CPS, CPL, RevShare, Hybrid
  grossRevenue: number;
  commission: number;
  cpaCommission: number;
  profit: number;
  currency: string; // USD, EUR, GBP, CAD, AUD
  subAffiliates: SubAffiliate[];
}

export interface SubAffiliate {
  id: string;
  parentId: string;
  username: string;
  brand: string;
  category: string;
  dealType: string;
  grossRevenue: number;
  commission: number;
  cpaCommission: number;
  profit: number;
  currency: string;
}

export interface FilterOptions {
  brand: string;
  category: string;
  dealType: string;
  affiliateUsername: string;
  subAffiliateUsername: string;
  minRevenue?: number;
  maxRevenue?: number;
  minCommissionRate?: number;
  maxCommissionRate?: number;
}

export interface DealTypeMetrics {
  revenue: number;
  commission: number;
  count: number;
}
