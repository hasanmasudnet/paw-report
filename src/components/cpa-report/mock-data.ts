import { CPAReportItem } from "./types";

// Generate 1500 sample CPA report items
function generateMockData(count: number): CPAReportItem[] {
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

  // Generate dates for the last 2 years
  const startDate = new Date(2022, 0, 1);
  const endDate = new Date();

  const cpaReportItems: CPAReportItem[] = [];

  for (let i = 0; i < count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const trackerId = trackerIds[Math.floor(Math.random() * trackerIds.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];

    // Generate realistic CPA count
    const cpaCount = Math.floor(Math.random() * 500) + 1;

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

    // Create CPA report item
    const cpaReportItem: CPAReportItem = {
      id: `cpa-${i + 1}`,
      brand,
      trackerId,
      username,
      cpaCount,
      currency,
      lastUpdated,
    };

    cpaReportItems.push(cpaReportItem);
  }

  return cpaReportItems;
}

export const mockCPAReportItems: CPAReportItem[] = generateMockData(1500);

// Extract unique values for filters
export const brands = [
  ...new Set(mockCPAReportItems.map((item) => item.brand)),
];
export const trackerIds = [
  ...new Set(mockCPAReportItems.map((item) => item.trackerId)),
];
export const usernames = [
  ...new Set(mockCPAReportItems.map((item) => item.username)),
];

// Extract unique years and months
export const years = [
  ...new Set(
    mockCPAReportItems.map((item) =>
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
