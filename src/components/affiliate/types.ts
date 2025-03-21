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
  affiliate?: string; // Affiliate company name
  lastUpdated?: string; // Date of last update
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
  lastUpdated?: string; // Date of last update
}

export interface FilterOptions {
  brand: string;
  category: string;
  dealType: string;
  affiliateUsername: string;
  subAffiliateUsername: string;
  affiliate?: string;
  year?: string;
  month?: string;
}

export interface DealTypeMetrics {
  revenue: number;
  commission: number;
  count: number;
}
