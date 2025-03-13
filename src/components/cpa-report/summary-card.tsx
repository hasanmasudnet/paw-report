import React from "react";
import { CPAReportItem } from "./types";
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
  allItems: CPAReportItem[];
  filteredItems: CPAReportItem[];
}

function SummaryCard({ allItems, filteredItems }: SummaryCardProps) {
  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    let totalCPACount = 0;
    let totalEstimatedValue = 0;
    const averageCPAValue = 100; // Assuming $100 per CPA

    // Calculate totals for filtered items
    filteredItems.forEach((item) => {
      totalCPACount += item.cpaCount;
      totalEstimatedValue += item.cpaCount * averageCPAValue;
    });

    // Calculate percentage of total (comparing filtered to all items)
    let percentageOfTotal = 0;
    let totalAllCPACount = 0;

    allItems.forEach((item) => {
      totalAllCPACount += item.cpaCount;
    });

    if (totalAllCPACount > 0) {
      percentageOfTotal = (totalCPACount / totalAllCPACount) * 100;
    }

    // Calculate average CPA per item
    const avgCPAPerItem =
      filteredItems.length > 0 ? totalCPACount / filteredItems.length : 0;

    return {
      totalCPACount,
      totalEstimatedValue,
      percentageOfTotal,
      avgCPAPerItem,
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
              <PersonAdd color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Total CPA Count</Typography>
              <Tooltip title="Total number of CPAs across all trackers">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {metrics.totalCPACount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {metrics.percentageOfTotal.toFixed(1)}% of total CPAs
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TouchApp color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Estimated Value</Typography>
              <Tooltip title="Estimated monetary value of all CPAs (at $100 per CPA)">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${metrics.totalEstimatedValue.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Avg. ${(metrics.avgCPAPerItem * 100).toFixed(0)} per item
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Visibility color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Average Per Item</Typography>
              <Tooltip title="Average number of CPAs per tracker/item">
                <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
              </Tooltip>
            </Box>
            <Typography variant="h4" component="div" fontWeight="bold">
              {metrics.avgCPAPerItem.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              CPAs per tracker item
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
