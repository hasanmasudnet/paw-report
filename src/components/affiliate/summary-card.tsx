import React from "react";
import { Affiliate } from "./types";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";
import { AttachMoney, TrendingUp, Paid, Info } from "@mui/icons-material";

interface SummaryCardProps {
  affiliates: Affiliate[];
  filteredAffiliates: Affiliate[];
}

export function SummaryCard({
  affiliates,
  filteredAffiliates,
}: SummaryCardProps) {
  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
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
    let subAffiliateCount = 0;

    // Calculate totals for filtered affiliates
    filteredAffiliates.forEach((affiliate) => {
      // Convert to USD for consistent calculations
      const exchangeRate =
        exchangeRates[affiliate.currency as keyof typeof exchangeRates] || 1;

      totalGrossRevenue += affiliate.grossRevenue * exchangeRate;
      totalCommission += affiliate.commission * exchangeRate;
      totalCpaCommission += affiliate.cpaCommission * exchangeRate;
      totalProfit += affiliate.profit * exchangeRate;
      subAffiliateCount += affiliate.subAffiliates?.length || 0;
    });

    // Calculate percentage of total (comparing filtered to all affiliates)
    let percentageOfTotal = 0;
    let totalAllGrossRevenue = 0;

    affiliates.forEach((affiliate) => {
      const exchangeRate =
        exchangeRates[affiliate.currency as keyof typeof exchangeRates] || 1;
      totalAllGrossRevenue += affiliate.grossRevenue * exchangeRate;
    });

    if (totalAllGrossRevenue > 0) {
      percentageOfTotal = (totalGrossRevenue / totalAllGrossRevenue) * 100;
    }

    // Calculate average commission rate
    const avgCommissionRate =
      totalGrossRevenue > 0 ? (totalCommission / totalGrossRevenue) * 100 : 0;

    return {
      totalGrossRevenue,
      totalCommission,
      totalCpaCommission,
      totalProfit,
      percentageOfTotal,
      avgCommissionRate,
      affiliateCount: filteredAffiliates.length,
      subAffiliateCount,
      totalAffiliateCount: affiliates.length,
    };
  };

  const metrics = calculateSummaryMetrics();

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AttachMoney color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Total Revenue</Typography>
              <Tooltip title="Total gross revenue across all affiliates (converted to USD)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(metrics.totalGrossRevenue).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {metrics.percentageOfTotal.toFixed(1)}% of total revenue
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Paid color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Total Commission</Typography>
              <Tooltip title="Total commission paid to affiliates (converted to USD)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(metrics.totalCommission).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Avg. Rate: {metrics.avgCommissionRate.toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Total Profit</Typography>
              <Tooltip title="Net profit from affiliates (converted to USD)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(metrics.totalProfit).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              CPA Commission: $
              {Math.round(metrics.totalCpaCommission).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Info color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Affiliates</Typography>
              <Tooltip title="Number of affiliates and sub-affiliates">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {metrics.affiliateCount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              With {metrics.subAffiliateCount} sub-affiliates
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SummaryCard;
