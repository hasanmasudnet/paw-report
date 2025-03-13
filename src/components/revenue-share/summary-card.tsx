import React from "react";
import { RevenueShareItem } from "./types";
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
  allItems: RevenueShareItem[];
  filteredItems: RevenueShareItem[];
}

function SummaryCard({ allItems, filteredItems }: SummaryCardProps) {
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
    let totalShareAmount = 0;
    let totalNetRevenue = 0;
    let totalSharePercentage = 0;

    // Calculate totals for filtered items
    filteredItems.forEach((item) => {
      // Convert to USD for consistent calculations
      const exchangeRate =
        exchangeRates[item.currency as keyof typeof exchangeRates] || 1;

      totalGrossRevenue += item.grossRevenue * exchangeRate;
      totalShareAmount += item.shareAmount * exchangeRate;
      totalNetRevenue += item.netRevenue * exchangeRate;
      totalSharePercentage += item.sharePercentage;
    });

    // Calculate average share percentage
    const avgSharePercentage =
      filteredItems.length > 0
        ? totalSharePercentage / filteredItems.length
        : 0;

    // Calculate percentage of total (comparing filtered to all items)
    let percentageOfTotal = 0;
    let totalAllGrossRevenue = 0;

    allItems.forEach((item) => {
      const exchangeRate =
        exchangeRates[item.currency as keyof typeof exchangeRates] || 1;
      totalAllGrossRevenue += item.grossRevenue * exchangeRate;
    });

    if (totalAllGrossRevenue > 0) {
      percentageOfTotal = (totalGrossRevenue / totalAllGrossRevenue) * 100;
    }

    return {
      totalGrossRevenue,
      totalShareAmount,
      totalNetRevenue,
      avgSharePercentage,
      percentageOfTotal,
      itemCount: filteredItems.length,
      totalItemCount: allItems.length,
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
              <Typography variant="subtitle1">Gross Revenue</Typography>
              <Tooltip title="Total gross revenue before revenue sharing (converted to USD)">
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
              <Typography variant="subtitle1">Share Amount</Typography>
              <Tooltip title="Total amount shared with affiliates (converted to USD)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(metrics.totalShareAmount).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Avg. Share: {metrics.avgSharePercentage.toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Net Revenue</Typography>
              <Tooltip title="Net revenue after revenue sharing (converted to USD)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(metrics.totalNetRevenue).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Retention Rate:{" "}
              {metrics.totalGrossRevenue > 0
                ? (
                    (metrics.totalNetRevenue / metrics.totalGrossRevenue) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Info color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Report Summary</Typography>
              <Tooltip title="Number of items in the current filtered view vs. total">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {metrics.itemCount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              of {metrics.totalItemCount.toLocaleString()} total items (
              {metrics.totalItemCount > 0
                ? ((metrics.itemCount / metrics.totalItemCount) * 100).toFixed(
                    1,
                  )
                : 0}
              %)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SummaryCard;
