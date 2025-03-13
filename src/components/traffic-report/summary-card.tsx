import React from "react";
import { TrafficReportItem } from "./types";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  Visibility,
  TouchApp,
  PersonAdd,
  Info,
} from "@mui/icons-material";

interface SummaryCardProps {
  allItems: TrafficReportItem[];
  filteredItems: TrafficReportItem[];
}

function SummaryCard({ allItems, filteredItems }: SummaryCardProps) {
  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalNewDeposits = 0;

    // Calculate totals for filtered items
    filteredItems.forEach((item) => {
      totalImpressions += item.impressions;
      totalClicks += item.clicks;
      totalNewDeposits += item.newDeposits;
    });

    // Calculate percentage of total (comparing filtered to all items)
    let percentageOfTotal = 0;
    let totalAllImpressions = 0;

    allItems.forEach((item) => {
      totalAllImpressions += item.impressions;
    });

    if (totalAllImpressions > 0) {
      percentageOfTotal = (totalImpressions / totalAllImpressions) * 100;
    }

    // Calculate rates
    const ctr =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate =
      totalClicks > 0 ? (totalNewDeposits / totalClicks) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      totalNewDeposits,
      percentageOfTotal,
      ctr,
      conversionRate,
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
              <Visibility color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Total Impressions</Typography>
              <Tooltip title="Total number of ad impressions across all trackers">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {metrics.totalImpressions.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {metrics.percentageOfTotal.toFixed(1)}% of total impressions
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TouchApp color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Total Clicks</Typography>
              <Tooltip title="Total number of clicks across all trackers">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {metrics.totalClicks.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              CTR: {metrics.ctr.toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PersonAdd color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">New Deposits</Typography>
              <Tooltip title="Total number of new deposits from clicks">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {metrics.totalNewDeposits.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Conversion Rate: {metrics.conversionRate.toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
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
