import { GrossReportItem } from "./types";
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
  Receipt,
} from "@mui/icons-material";

interface SummaryCardProps {
  allItems: GrossReportItem[];
  filteredItems: GrossReportItem[];
}

export function SummaryCard({ allItems, filteredItems }: SummaryCardProps) {
  // Calculate totals for filtered items with currency conversion
  const calculateTotals = (items: GrossReportItem[]) => {
    // Define exchange rates to USD (simplified for demo)
    const exchangeRates = {
      USD: 1,
      EUR: 1.09,
      GBP: 1.28,
      CAD: 0.73,
      AUD: 0.66,
    };

    let totalNetRevenue = 0;
    let totalDeduction = 0;
    let totalAdminFee = 0;
    let totalProfit = 0;

    items.forEach((item) => {
      // Convert to USD for consistent calculations
      const exchangeRate =
        exchangeRates[item.currency as keyof typeof exchangeRates] || 1;

      totalNetRevenue += item.netRevenue * exchangeRate;
      totalDeduction += item.deduction * exchangeRate;
      totalAdminFee += item.adminFee * exchangeRate;
      totalProfit += item.profit * exchangeRate;
    });

    // Calculate average profit margin
    const avgProfitMargin =
      totalNetRevenue > 0 ? (totalProfit / totalNetRevenue) * 100 : 0;

    return {
      totalNetRevenue,
      totalDeduction,
      totalAdminFee,
      totalProfit,
      avgProfitMargin,
      totalItems: items.length,
    };
  };

  const totals = calculateTotals(filteredItems);
  const allTotals = calculateTotals(allItems);

  // Calculate percentages of filtered vs all
  const percentageOfRevenue =
    allTotals.totalNetRevenue > 0
      ? ((totals.totalNetRevenue / allTotals.totalNetRevenue) * 100).toFixed(1)
      : "0";

  const percentageOfProfit =
    allTotals.totalProfit > 0
      ? ((totals.totalProfit / allTotals.totalProfit) * 100).toFixed(1)
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
                <Typography variant="subtitle1">Net Revenue</Typography>
                <Tooltip title="Total net revenue after deductions and fees (converted to USD)">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<AttachMoney color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(totals.totalNetRevenue).toLocaleString()}
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
                <Typography variant="subtitle1">Deductions & Fees</Typography>
                <Tooltip title="Total deductions and admin fees (converted to USD)">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<Receipt color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              $
              {Math.round(
                totals.totalDeduction + totals.totalAdminFee,
              ).toLocaleString()}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Deductions:</span>
                <span>
                  ${Math.round(totals.totalDeduction).toLocaleString()}
                </span>
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>Admin Fees:</span>
                <span>
                  ${Math.round(totals.totalAdminFee).toLocaleString()}
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
                <Tooltip title="Net profit (converted to USD)">
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
              Avg. Profit Margin: {totals.avgProfitMargin.toFixed(1)}%
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
            avatar={<Paid color="primary" />}
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
