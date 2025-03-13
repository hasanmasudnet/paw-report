import { useState, useEffect } from "react";
import { mockTrafficReportItems, brands, trackerIds } from "./mock-data";
import { TrafficReportItem, TrafficReportFilterOptions } from "./types";
import { SummaryCard } from "./summary-card";
import { FilterBar } from "./filter-bar";
import { TrafficReportTable } from "./traffic-report-table";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Button,
} from "@mui/material";
import { FileDown } from "lucide-react";
import { exportToExcel } from "@/utils/excel-export";

function TrafficReportDashboard() {
  const [items, setItems] = useState<TrafficReportItem[]>(
    mockTrafficReportItems,
  );
  const [filteredItems, setFilteredItems] = useState<TrafficReportItem[]>(
    mockTrafficReportItems,
  );
  const [filters, setFilters] = useState<TrafficReportFilterOptions>({
    brand: "",
    trackerId: "",
  });

  // Apply filters whenever filters state changes
  useEffect(() => {
    const filtered = items.filter((item) => {
      // Filter by brand
      if (filters.brand && item.brand !== filters.brand) {
        return false;
      }

      // Filter by tracker ID
      if (filters.trackerId && item.trackerId !== filters.trackerId) {
        return false;
      }

      // Filter by impressions range
      if (
        (filters.minImpressions !== undefined &&
          item.impressions < filters.minImpressions) ||
        (filters.maxImpressions !== undefined &&
          item.impressions > filters.maxImpressions)
      ) {
        return false;
      }

      // Filter by clicks range
      if (
        (filters.minClicks !== undefined && item.clicks < filters.minClicks) ||
        (filters.maxClicks !== undefined && item.clicks > filters.maxClicks)
      ) {
        return false;
      }

      // Filter by deposits range
      if (
        (filters.minDeposits !== undefined &&
          item.newDeposits < filters.minDeposits) ||
        (filters.maxDeposits !== undefined &&
          item.newDeposits > filters.maxDeposits)
      ) {
        return false;
      }

      // Filter by date range
      const itemDate = new Date(item.lastUpdated);
      if (filters.startDate && new Date(filters.startDate) > itemDate) {
        return false;
      }
      if (filters.endDate && new Date(filters.endDate) < itemDate) {
        return false;
      }

      return true;
    });

    setFilteredItems(filtered);
  }, [items, filters]);

  const handleFilterChange = (newFilters: TrafficReportFilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      brand: "",
      trackerId: "",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Traffic Report Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze impressions, clicks, and new deposits across
          different brands and trackers.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Filter Bar */}
        <FilterBar
          brands={brands}
          trackerIds={trackerIds}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Summary Cards */}
        <SummaryCard allItems={items} filteredItems={filteredItems} />

        {/* Traffic Report Table */}
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="medium">
              Traffic Report Items ({filteredItems.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDown size={18} />}
              onClick={() => {
                // Prepare data for export
                const exportData = filteredItems.map((item) => ({
                  brand: item.brand,
                  trackerId: item.trackerId,
                  impressions: item.impressions,
                  clicks: item.clicks,
                  ctr: (item.ctr || 0).toFixed(2) + "%",
                  newDeposits: item.newDeposits,
                  conversionRate: (item.conversionRate || 0).toFixed(2) + "%",
                  lastUpdated: new Date(item.lastUpdated).toLocaleDateString(),
                }));

                exportToExcel(exportData, {
                  fileName: "Traffic_Report",
                  sheetName: "Traffic Data",
                });
              }}
            >
              Export Excel
            </Button>
          </Box>
          <TrafficReportTable items={filteredItems} />
        </Paper>
      </Stack>
    </Container>
  );
}

export default TrafficReportDashboard;
