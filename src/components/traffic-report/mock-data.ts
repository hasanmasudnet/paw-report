import { TrafficReportItem } from "./types";

// Generate 1500 sample traffic report items
function generateMockData(count: number): TrafficReportItem[] {
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

  // Generate dates for the last 2 years
  const startDate = new Date(2022, 0, 1);
  const endDate = new Date();

  const trafficReportItems: TrafficReportItem[] = [];

  for (let i = 0; i < count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const trackerId = trackerIds[Math.floor(Math.random() * trackerIds.length)];

    // Generate realistic traffic numbers
    const impressions = Math.floor(Math.random() * 100000) + 1000;
    const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.1)); // 1-11% CTR
    const newDeposits = Math.floor(clicks * (0.05 + Math.random() * 0.15)); // 5-20% conversion

    // Generate random date between start and end date
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime()),
    );

    // Format date as ISO string
    const lastUpdated = randomDate.toISOString();

    // Calculate rates
    const ctr = (clicks / impressions) * 100;
    const conversionRate = (newDeposits / clicks) * 100;

    // Create traffic report item
    const trafficReportItem: TrafficReportItem = {
      id: `tr-${i + 1}`,
      brand,
      trackerId,
      impressions,
      clicks,
      newDeposits,
      lastUpdated,
      ctr,
      conversionRate,
    };

    trafficReportItems.push(trafficReportItem);
  }

  return trafficReportItems;
}

export const mockTrafficReportItems: TrafficReportItem[] =
  generateMockData(1500);

// Extract unique values for filters
export const brands = [
  ...new Set(mockTrafficReportItems.map((item) => item.brand)),
];
export const trackerIds = [
  ...new Set(mockTrafficReportItems.map((item) => item.trackerId)),
];

// Extract unique years and months for date filtering
export const years = [
  ...new Set(
    mockTrafficReportItems.map((item) =>
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
