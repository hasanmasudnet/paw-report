import { CPAReportItem } from "./types";
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
import { AttachMoney, Paid, Info, BarChart } from "@mui/icons-material";

interface SummaryCardProps {
  allItems: CPAReportItem[];
  filteredItems: CPAReportItem[];
}

export function SummaryCard({ allItems, filteredItems }: SummaryCardProps) {
  // Calculate totals for filtered items with currency conversion
  const calculateTotals = (items: CPAReportItem[]) => {
    // Define exchange rates to USD (simplified for demo)
    const exchangeRates = {
      USD: 1,
      EUR: 1.09,
      GBP: 1.28,
      CAD: 0.73,
      AUD: 0.66,
    };

    let totalCPACount = 0;
    let totalUSDValue = 0;
    const avgCPAValue = 100; // Assuming average CPA value of $100 for simplicity

    items.forEach((item) => {
      // Convert to USD for consistent calculations
      const exchangeRate =
        exchangeRates[item.currency as keyof typeof exchangeRates] || 1;

      totalCPACount += item.cpaCount;
      totalUSDValue += item.cpaCount * avgCPAValue * exchangeRate;
    });

    return {
      totalCPACount,
      totalUSDValue,
      avgCPAValue,
      totalItems: items.length,
    };
  };

  const totals = calculateTotals(filteredItems);
  const allTotals = calculateTotals(allItems);

  // Calculate percentages of filtered vs all
  const percentageOfCPAs =
    allTotals.totalCPACount > 0
      ? ((totals.totalCPACount / allTotals.totalCPACount) * 100).toFixed(1)
      : "0";

  const percentageOfValue =
    allTotals.totalUSDValue > 0
      ? ((totals.totalUSDValue / allTotals.totalUSDValue) * 100).toFixed(1)
      : "0";

  const percentageOfItems =
    allTotals.totalItems > 0
      ? ((totals.totalItems / allTotals.totalItems) * 100).toFixed(1)
      : "0";

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Total CPA Count</Typography>
                <Tooltip title="Total number of CPAs across all filtered items">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<BarChart color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              {totals.totalCPACount.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfCPAs)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfCPAs}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              of total CPAs
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Estimated Value</Typography>
                <Tooltip title="Estimated total value of CPAs (converted to USD)">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<AttachMoney color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              ${Math.round(totals.totalUSDValue).toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfValue)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfValue}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Avg. CPA Value: ${totals.avgCPAValue}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
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
