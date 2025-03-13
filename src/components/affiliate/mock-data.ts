import { Affiliate } from "./types";

// Generate 1500 sample affiliates with different combinations
function generateMockData(count: number): Affiliate[] {
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
  const categories = [
    "Sports",
    "Electronics",
    "Fashion",
    "Gaming",
    "Home",
    "Beauty",
    "Fitness",
    "Food",
    "Travel",
    "Education",
  ];
  const dealTypes = ["CPA", "CPS", "CPL", "RevShare", "Hybrid"];
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

  const affiliates: Affiliate[] = [];

  for (let i = 0; i < count; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const dealType = dealTypes[Math.floor(Math.random() * dealTypes.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];

    // Generate realistic revenue numbers
    const grossRevenue = Math.floor(Math.random() * 50000) + 1000;

    // Calculate real commission based on deal type
    let commissionRate;
    switch (dealType) {
      case "CPA":
        commissionRate = 0.08 + Math.random() * 0.07; // 8-15%
        break;
      case "CPS":
        commissionRate = 0.05 + Math.random() * 0.1; // 5-15%
        break;
      case "CPL":
        commissionRate = 0.03 + Math.random() * 0.07; // 3-10%
        break;
      case "RevShare":
        commissionRate = 0.15 + Math.random() * 0.15; // 15-30%
        break;
      case "Hybrid":
        commissionRate = 0.1 + Math.random() * 0.1; // 10-20%
        break;
      default:
        commissionRate = 0.1; // Default 10%
    }

    const commission = Math.round(grossRevenue * commissionRate);
    const cpaCommission = Math.round(commission * 0.5); // CPA commission is typically half of total commission
    const profit = grossRevenue - commission;

    // Generate username
    const usernamePrefix =
      usernamePrefixes[Math.floor(Math.random() * usernamePrefixes.length)];
    const usernameSuffix =
      usernameSuffixes[Math.floor(Math.random() * usernameSuffixes.length)];
    const username = `${usernamePrefix}${usernameSuffix}${Math.floor(Math.random() * 1000)}`;

    // Create affiliate
    const affiliate: Affiliate = {
      id: `aff-${i + 1}`,
      username,
      brand,
      category,
      dealType,
      grossRevenue,
      commission,
      cpaCommission,
      profit,
      currency,
      subAffiliates: [],
    };

    // Add sub-affiliates (20% chance of having 1-5 sub-affiliates)
    if (Math.random() < 0.2) {
      const subAffiliateCount = Math.floor(Math.random() * 5) + 1;

      for (let j = 0; j < subAffiliateCount; j++) {
        const subGrossRevenue =
          Math.floor(Math.random() * (grossRevenue * 0.5)) + 500;
        const subCommissionRate = commissionRate * (0.8 + Math.random() * 0.4); // Slightly different rate
        const subCommission = Math.round(subGrossRevenue * subCommissionRate);
        const subCpaCommission = Math.round(subCommission * 0.5);
        const subProfit = subGrossRevenue - subCommission;

        const subUsernamePrefix =
          usernamePrefixes[Math.floor(Math.random() * usernamePrefixes.length)];
        const subUsernameSuffix =
          usernameSuffixes[Math.floor(Math.random() * usernameSuffixes.length)];
        const subUsername = `${subUsernamePrefix}${subUsernameSuffix}${Math.floor(Math.random() * 1000)}`;

        affiliate.subAffiliates.push({
          id: `sub-${i + 1}-${j + 1}`,
          parentId: affiliate.id,
          username: subUsername,
          brand: affiliate.brand,
          category: affiliate.category,
          dealType: dealTypes[Math.floor(Math.random() * dealTypes.length)],
          grossRevenue: subGrossRevenue,
          commission: subCommission,
          cpaCommission: subCpaCommission,
          profit: subProfit,
          currency: affiliate.currency,
        });
      }
    }

    affiliates.push(affiliate);
  }

  return affiliates;
}

export const mockAffiliates: Affiliate[] = generateMockData(1500);

// Extract unique values for filters
export const brands = [...new Set(mockAffiliates.map((a) => a.brand))];
export const categories = [...new Set(mockAffiliates.map((a) => a.category))];
export const dealTypes = [...new Set(mockAffiliates.map((a) => a.dealType))];
