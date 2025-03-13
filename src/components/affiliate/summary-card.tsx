import { Affiliate } from "./types";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  AttachMoney,
  Group,
  Paid,
  TrendingUp,
  Info,
} from "@mui/icons-material";

interface SummaryCardProps {
  affiliates: Affiliate[];
  filteredAffiliates: Affiliate[];
}

export function SummaryCard({
  affiliates,
  filteredAffiliates,
}: SummaryCardProps) {
  // Calculate totals for filtered affiliates with currency conversion
  const calculateTotals = (affiliatesList: Affiliate[]) => {
    // Define exchange rates to USD (simplified for demo)
    const exchangeRates = {
      USD: 1,
      EUR: 1.09,
      GBP: 1.28,
      CAD: 0.73,
      AUD: 0.66,
    };

    let totalGrossRevenue = 0;
    let totalCommission = 0;
    let totalCpaCommission = 0;
    let totalProfit = 0;
    let totalSubAffiliates = 0;
    let totalAffiliateCount = affiliatesList.length;
    let totalSubAffiliateCount = 0;

    // Track metrics by deal type
    const dealTypeMetrics = {
      CPA: { revenue: 0, commission: 0, count: 0 },
      CPS: { revenue: 0, commission: 0, count: 0 },
      CPL: { revenue: 0, commission: 0, count: 0 },
      RevShare: { revenue: 0, commission: 0, count: 0 },
      Hybrid: { revenue: 0, commission: 0, count: 0 },
    };

    affiliatesList.forEach((affiliate) => {
      // Convert to USD for consistent calculations
      const exchangeRate =
        exchangeRates[affiliate.currency as keyof typeof exchangeRates] || 1;

      const revenueInUSD = affiliate.grossRevenue * exchangeRate;
      const commissionInUSD = affiliate.commission * exchangeRate;
      const cpaCommissionInUSD = affiliate.cpaCommission * exchangeRate;
      const profitInUSD = affiliate.profit * exchangeRate;

      totalGrossRevenue += revenueInUSD;
      totalCommission += commissionInUSD;
      totalCpaCommission += cpaCommissionInUSD;
      totalProfit += profitInUSD;

      // Track by deal type
      if (affiliate.dealType in dealTypeMetrics) {
        dealTypeMetrics[
          affiliate.dealType as keyof typeof dealTypeMetrics
        ].revenue += revenueInUSD;
        dealTypeMetrics[
          affiliate.dealType as keyof typeof dealTypeMetrics
        ].commission += commissionInUSD;
        dealTypeMetrics[
          affiliate.dealType as keyof typeof dealTypeMetrics
        ].count += 1;
      }

      // Add sub-affiliate values
      if (affiliate.subAffiliates && affiliate.subAffiliates.length > 0) {
        totalSubAffiliateCount += affiliate.subAffiliates.length;

        affiliate.subAffiliates.forEach((sub) => {
          const subExchangeRate =
            exchangeRates[sub.currency as keyof typeof exchangeRates] || 1;

          const subRevenueInUSD = sub.grossRevenue * subExchangeRate;
          const subCommissionInUSD = sub.commission * subExchangeRate;
          const subCpaCommissionInUSD = sub.cpaCommission * subExchangeRate;
          const subProfitInUSD = sub.profit * subExchangeRate;

          totalGrossRevenue += subRevenueInUSD;
          totalCommission += subCommissionInUSD;
          totalCpaCommission += subCpaCommissionInUSD;
          totalProfit += subProfitInUSD;

          // Track by deal type
          if (sub.dealType in dealTypeMetrics) {
            dealTypeMetrics[
              sub.dealType as keyof typeof dealTypeMetrics
            ].revenue += subRevenueInUSD;
            dealTypeMetrics[
              sub.dealType as keyof typeof dealTypeMetrics
            ].commission += subCommissionInUSD;
            dealTypeMetrics[
              sub.dealType as keyof typeof dealTypeMetrics
            ].count += 1;
          }
        });
      }
    });

    // Calculate average commission rate
    const avgCommissionRate =
      totalGrossRevenue > 0 ? (totalCommission / totalGrossRevenue) * 100 : 0;

    // Calculate most profitable deal type
    let mostProfitableDealType = "None";
    let highestCommissionRate = 0;

    Object.entries(dealTypeMetrics).forEach(([dealType, metrics]) => {
      if (metrics.revenue > 0) {
        const commissionRate = (metrics.commission / metrics.revenue) * 100;
        if (commissionRate > highestCommissionRate) {
          highestCommissionRate = commissionRate;
          mostProfitableDealType = dealType;
        }
      }
    });

    return {
      totalGrossRevenue,
      totalCommission,
      totalCpaCommission,
      totalProfit,
      totalAffiliates: totalAffiliateCount,
      totalSubAffiliates: totalSubAffiliateCount,
      avgCommissionRate,
      mostProfitableDealType,
      highestCommissionRate,
      dealTypeMetrics,
    };
  };

  const totals = calculateTotals(filteredAffiliates);
  const allTotals = calculateTotals(affiliates);

  // Calculate percentages of filtered vs all
  const percentageOfRevenue =
    allTotals.totalGrossRevenue > 0
      ? (
          (totals.totalGrossRevenue / allTotals.totalGrossRevenue) *
          100
        ).toFixed(1)
      : "0";

  const percentageOfProfit =
    allTotals.totalProfit > 0
      ? ((totals.totalProfit / allTotals.totalProfit) * 100).toFixed(1)
      : "0";

  const percentageOfAffiliates =
    allTotals.totalAffiliates > 0
      ? ((totals.totalAffiliates / allTotals.totalAffiliates) * 100).toFixed(1)
      : "0";

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Total Gross Revenue</Typography>
                <Tooltip title="Total revenue generated by all affiliates and sub-affiliates (converted to USD)">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<AttachMoney color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(totals.totalGrossRevenue).toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfRevenue)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfRevenue}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              of total revenue across all affiliates
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Commission Metrics</Typography>
                <Tooltip title="Total commission paid and average commission rate">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<Paid color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(totals.totalCommission).toLocaleString()}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Average commission rate:</span>
                <span>{totals.avgCommissionRate.toFixed(2)}%</span>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Best performing deal type:</span>
                <span>
                  {totals.mostProfitableDealType} (
                  {totals.highestCommissionRate.toFixed(1)}%)
                </span>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Total Profit</Typography>
                <Tooltip title="Net profit after commissions (converted to USD)">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<TrendingUp color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(totals.totalProfit).toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfProfit)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfProfit}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              of total profit across all affiliates
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Affiliates</Typography>
                <Tooltip title="Number of affiliates and sub-affiliates in current view">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<Group color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              {totals.totalAffiliates.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfAffiliates)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfAffiliates}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              With {totals.totalSubAffiliates.toLocaleString()} sub-affiliates
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
