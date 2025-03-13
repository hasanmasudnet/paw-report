import { RevenueShareItem } from "./types";
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
  Paid,
  TrendingUp,
  Info,
  BarChart,
  Percent,
} from "@mui/icons-material";

interface SummaryCardProps {
  allItems: RevenueShareItem[];
  filteredItems: RevenueShareItem[];
}

export function SummaryCard({ allItems, filteredItems }: SummaryCardProps) {
  // Calculate totals for filtered items with currency conversion
  const calculateTotals = (items: RevenueShareItem[]) => {
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

    items.forEach((item) => {
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
      items.length > 0 ? totalSharePercentage / items.length : 0;

    return {
      totalGrossRevenue,
      totalShareAmount,
      totalNetRevenue,
      avgSharePercentage,
      totalItems: items.length,
    };
  };

  const totals = calculateTotals(filteredItems);
  const allTotals = calculateTotals(allItems);

  // Calculate percentages of filtered vs all
  const percentageOfGrossRevenue =
    allTotals.totalGrossRevenue > 0
      ? (
          (totals.totalGrossRevenue / allTotals.totalGrossRevenue) *
          100
        ).toFixed(1)
      : "0";

  const percentageOfShareAmount =
    allTotals.totalShareAmount > 0
      ? ((totals.totalShareAmount / allTotals.totalShareAmount) * 100).toFixed(
          1,
        )
      : "0";

  const percentageOfNetRevenue =
    allTotals.totalNetRevenue > 0
      ? ((totals.totalNetRevenue / allTotals.totalNetRevenue) * 100).toFixed(1)
      : "0";

  const percentageOfItems =
    allTotals.totalItems > 0
      ? ((totals.totalItems / allTotals.totalItems) * 100).toFixed(1)
      : "0";

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Gross Revenue</Typography>
                <Tooltip title="Total gross revenue before share (converted to USD)">
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
                value={parseFloat(percentageOfGrossRevenue)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfGrossRevenue}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              of total gross revenue
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Share Amount</Typography>
                <Tooltip title="Total revenue share amount (converted to USD)">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<Paid color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(totals.totalShareAmount).toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfShareAmount)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfShareAmount}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Avg. Share: {totals.avgSharePercentage.toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Net Revenue</Typography>
                <Tooltip title="Net revenue after share (converted to USD)">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<TrendingUp color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(totals.totalNetRevenue).toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfNetRevenue)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfNetRevenue}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              of total net revenue
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Report Items</Typography>
                <Tooltip title="Number of items in current view">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<BarChart color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              {totals.totalItems.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfItems)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfItems}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              of total report items
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
