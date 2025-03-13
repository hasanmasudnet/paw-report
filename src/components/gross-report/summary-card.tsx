import React from "react";
import { GrossReportItem } from "./types";
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
  allItems: GrossReportItem[];
  filteredItems: GrossReportItem[];
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

    let totalNetRevenue = 0;
    let totalProfit = 0;
    let totalDeductions = 0;
    let totalAdminFees = 0;

    // Calculate totals for filtered items
    filteredItems.forEach((item) => {
      // Convert to USD for consistent calculations
      const exchangeRate =
        exchangeRates[item.currency as keyof typeof exchangeRates] || 1;

      totalNetRevenue += item.netRevenue * exchangeRate;
      totalProfit += item.profit * exchangeRate;
      totalDeductions += item.deduction * exchangeRate;
      totalAdminFees += item.adminFee * exchangeRate;
    });

    // Calculate percentage of total (comparing filtered to all items)
    let percentageOfTotal = 0;
    let totalAllNetRevenue = 0;

    allItems.forEach((item) => {
      const exchangeRate =
        exchangeRates[item.currency as keyof typeof exchangeRates] || 1;
      totalAllNetRevenue += item.netRevenue * exchangeRate;
    });

    if (totalAllNetRevenue > 0) {
      percentageOfTotal = (totalNetRevenue / totalAllNetRevenue) * 100;
    }

    // Calculate profit margin
    const profitMargin =
      totalNetRevenue > 0 ? (totalProfit / totalNetRevenue) * 100 : 0;

    return {
      totalNetRevenue,
      totalProfit,
      totalDeductions,
      totalAdminFees,
      percentageOfTotal,
      profitMargin,
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
              <Typography variant="subtitle1">Net Revenue</Typography>
              <Tooltip title="Total net revenue after deductions (converted to USD)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(metrics.totalNetRevenue).toLocaleString()}
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
              <Typography variant="subtitle1">Total Profit</Typography>
              <Tooltip title="Total profit across all items (converted to USD)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(metrics.totalProfit).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Profit Margin: {metrics.profitMargin.toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Deductions & Fees</Typography>
              <Tooltip title="Total deductions and admin fees (converted to USD)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              $
              {Math.round(
                metrics.totalDeductions + metrics.totalAdminFees,
              ).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin Fees: ${Math.round(metrics.totalAdminFees).toLocaleString()}
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
