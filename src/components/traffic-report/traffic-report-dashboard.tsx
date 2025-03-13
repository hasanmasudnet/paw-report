import { useState, useEffect } from "react";
import {
  mockTrafficReportItems,
  brands,
  trackerIds,
  years,
  months,
} from "./mock-data";
import { TrafficReportItem, TrafficReportFilterOptions } from "./types";
import SummaryCard from "./summary-card";
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
    year: "",
    month: "",
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

      // Range filters removed

      // Filter by year
      if (
        filters.year &&
        new Date(item.lastUpdated).getFullYear().toString() !== filters.year
      ) {
        return false;
      }

      // Filter by month
      if (
        filters.month &&
        new Date(item.lastUpdated).getMonth().toString() !== filters.month
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
      year: "",
      month: "",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Traffic Report Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze impressions, clicks, and new deposits across
          different brands and trackers.
        </Typography>
      </Box>

      <Stack spacing={{ xs: 2, md: 3 }}>
        {/* Filter Bar */}
        <FilterBar
          brands={brands}
          trackerIds={trackerIds}
          years={years}
          months={months}
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
              p: { xs: 1.5, sm: 2 },
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 0 },
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
