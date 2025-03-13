import { GrossReportItem } from "./types";

// Generate 1500 sample gross report items
function generateMockData(count: number): GrossReportItem[] {
  const brands = [
    "Nike",
    "Apple",
    "Zara",
    "Microsoft",
    "Amazon",
    "Samsung",
    "Adidas",
    "H&M",
    "Sony",
    "Google",
  ];

  const trackerIds = [
    "TR-001",
    "TR-002",
    "TR-003",
    "TR-004",
    "TR-005",
    "TR-006",
    "TR-007",
    "TR-008",
    "TR-009",
    "TR-010",
  ];

  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"];

  const usernamePrefixes = [
    "Top",
    "Best",
    "Super",
    "Mega",
    "Ultra",
    "Pro",
    "Master",
    "Elite",
    "Prime",
    "Alpha",
  ];

  const usernameSuffixes = [
    "Marketer",
    "Influencer",
    "Affiliate",
    "Promoter",
    "Seller",
    "Partner",
    "Agent",
    "Guru",
    "Expert",
    "Star",
  ];

  const affiliates = [
    "AffiliateOne",
    "MarketingPros",
    "DigitalPartners",
    "ClickMasters",
    "ConversionKings",
    "TrafficExperts",
    "LeadGenerators",
    "SalesBoost",
    "PromotionPros",
    "ReferralGurus",
  ];

  const affiliateIds = [
    "AFF-001",
    "AFF-002",
    "AFF-003",
    "AFF-004",
    "AFF-005",
    "AFF-006",
    "AFF-007",
    "AFF-008",
    "AFF-009",
    "AFF-010",
  ];

  // Generate dates for the last 2 years
  const startDate = new Date(2022, 0, 1);
  const endDate = new Date();

  const grossReportItems: GrossReportItem[] = [];

  for (let i = 0; i < count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const trackerId = trackerIds[Math.floor(Math.random() * trackerIds.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const affiliateId =
      affiliateIds[Math.floor(Math.random() * affiliateIds.length)];

    // Generate realistic revenue numbers
    const grossRevenue = Math.floor(Math.random() * 50000) + 1000;

    // Calculate deductions and fees
    const deduction = Math.round(grossRevenue * (0.05 + Math.random() * 0.1)); // 5-15% deduction
    const adminFee = Math.round(grossRevenue * (0.02 + Math.random() * 0.03)); // 2-5% admin fee

    // Calculate net revenue and profit
    const netRevenue = grossRevenue - deduction - adminFee;
    const profit = Math.round(netRevenue * (0.3 + Math.random() * 0.4)); // 30-70% profit margin

    // Generate random date between start and end date
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    );

    // Format date as ISO string
    const lastUpdated = randomDate.toISOString();

    // Generate username
    const usernamePrefix =
      usernamePrefixes[Math.floor(Math.random() * usernamePrefixes.length)];
    const usernameSuffix =
      usernameSuffixes[Math.floor(Math.random() * usernameSuffixes.length)];
    const username = `${usernamePrefix}${usernameSuffix}${Math.floor(Math.random() * 1000)}`;

    // Assign affiliate
    const affiliate = affiliates[Math.floor(Math.random() * affiliates.length)];

    // Create gross report item
    const grossReportItem: GrossReportItem = {
      id: `gr-${i + 1}`,
      brand,
      trackerId,
      deduction,
      adminFee,
      username,
      affiliate,
      netRevenue,
      profit,
      currency,
      lastUpdated,
      affiliateId,
    };

    grossReportItems.push(grossReportItem);
  }

  return grossReportItems;
}

export const mockGrossReportItems: GrossReportItem[] = generateMockData(1500);

// Extract unique values for filters
export const brands = [
  ...new Set(mockGrossReportItems.map((item) => item.brand)),
];
export const trackerIds = [
  ...new Set(mockGrossReportItems.map((item) => item.trackerId)),
];
export const usernames = [
  ...new Set(mockGrossReportItems.map((item) => item.username)),
];
export const affiliateIds = [
  ...new Set(mockGrossReportItems.map((item) => item.affiliateId)),
];
export const affiliateNames = [
  ...new Set(mockGrossReportItems.map((item) => item.affiliate)),
];

// Extract unique years and months
export const years = [
  ...new Set(
    mockGrossReportItems.map((item) =>
      new Date(item.lastUpdated).getFullYear().toString(),
    ),
  ),
];
export const months = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];
