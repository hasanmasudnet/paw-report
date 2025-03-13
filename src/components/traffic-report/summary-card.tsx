import { TrafficReportItem } from "./types";
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
  Visibility,
  TouchApp,
  AddCircle,
  Info,
  BarChart,
} from "@mui/icons-material";

interface SummaryCardProps {
  allItems: TrafficReportItem[];
  filteredItems: TrafficReportItem[];
}

export function SummaryCard({ allItems, filteredItems }: SummaryCardProps) {
  // Calculate totals for filtered items
  const calculateTotals = (items: TrafficReportItem[]) => {
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalDeposits = 0;

    items.forEach((item) => {
      totalImpressions += item.impressions;
      totalClicks += item.clicks;
      totalDeposits += item.newDeposits;
    });

    // Calculate average rates
    const avgCTR =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgConversionRate =
      totalClicks > 0 ? (totalDeposits / totalClicks) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      totalDeposits,
      avgCTR,
      avgConversionRate,
      totalItems: items.length,
    };
  };

  const totals = calculateTotals(filteredItems);
  const allTotals = calculateTotals(allItems);

  // Calculate percentages of filtered vs all
  const percentageOfImpressions =
    allTotals.totalImpressions > 0
      ? ((totals.totalImpressions / allTotals.totalImpressions) * 100).toFixed(
          1,
        )
      : "0";

  const percentageOfClicks =
    allTotals.totalClicks > 0
      ? ((totals.totalClicks / allTotals.totalClicks) * 100).toFixed(1)
      : "0";

  const percentageOfDeposits =
    allTotals.totalDeposits > 0
      ? ((totals.totalDeposits / allTotals.totalDeposits) * 100).toFixed(1)
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
                <Typography variant="subtitle1">Impressions</Typography>
                <Tooltip title="Total number of ad impressions">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<Visibility color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              {totals.totalImpressions.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfImpressions)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfImpressions}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              of total impressions
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Clicks</Typography>
                <Tooltip title="Total number of clicks on ads">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<TouchApp color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              {totals.totalClicks.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfClicks)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfClicks}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              CTR: {totals.avgCTR.toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">New Deposits</Typography>
                <Tooltip title="Total number of new deposits">
                  <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                </Tooltip>
              </Box>
            }
            avatar={<AddCircle color="primary" />}
            sx={{ pb: 1 }}
          />
          <CardContent>
            <Typography variant="h4" component="div" fontWeight="bold">
              {totals.totalDeposits.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 0.5 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentageOfDeposits)}
                sx={{ flexGrow: 1, mr: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary">
                {percentageOfDeposits}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Conversion Rate: {totals.avgConversionRate.toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2}>
          <CardHeader
            title={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Performance</Typography>
                <Tooltip title="Overall traffic performance metrics">
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
              of total traffic items
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
