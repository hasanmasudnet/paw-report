import { useState, useEffect } from "react";
import {
  mockRevenueShareItems,
  brands,
  trackerIds,
  usernames,
  affiliateNames,
} from "./mock-data";
import { RevenueShareItem, RevenueShareFilterOptions } from "./types";
import { SummaryCard } from "./summary-card";
import { FilterBar } from "./filter-bar";
import { RevenueShareTable } from "./revenue-share-table";
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

function RevenueShareDashboard() {
  const [items, setItems] = useState<RevenueShareItem[]>(mockRevenueShareItems);
  const [filteredItems, setFilteredItems] = useState<RevenueShareItem[]>(
    mockRevenueShareItems,
  );
  const [filters, setFilters] = useState<RevenueShareFilterOptions>({
    brand: "",
    trackerId: "",
    username: "",
    affiliate: "",
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

      // Filter by username (case insensitive)
      if (
        filters.username &&
        !item.username.toLowerCase().includes(filters.username.toLowerCase())
      ) {
        return false;
      }

      // Filter by affiliate
      if (filters.affiliate && item.affiliate !== filters.affiliate) {
        return false;
      }

      // Filter by share percentage range
      if (
        (filters.minSharePercentage !== undefined &&
          item.sharePercentage < filters.minSharePercentage) ||
        (filters.maxSharePercentage !== undefined &&
          item.sharePercentage > filters.maxSharePercentage)
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

  const handleFilterChange = (newFilters: RevenueShareFilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      brand: "",
      trackerId: "",
      username: "",
      affiliate: "",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Revenue Share Report
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze revenue sharing across different brands, trackers,
          and affiliates.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Summary Cards */}
        <SummaryCard allItems={items} filteredItems={filteredItems} />

        {/* Filter Bar */}
        <FilterBar
          brands={brands}
          trackerIds={trackerIds}
          usernames={usernames}
          affiliateNames={affiliateNames}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Revenue Share Table */}
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
              Revenue Share Items ({filteredItems.length})
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
                  username: item.username,
                  affiliate: item.affiliate,
                  grossRevenue: item.grossRevenue,
                  sharePercentage: item.sharePercentage + "%",
                  shareAmount: item.shareAmount,
                  netRevenue: item.netRevenue,
                  currency: item.currency,
                  lastUpdated: new Date(item.lastUpdated).toLocaleDateString(),
                }));

                exportToExcel(exportData, {
                  fileName: "Revenue_Share_Report",
                  sheetName: "Revenue Share",
                });
              }}
            >
              Export Excel
            </Button>
          </Box>
          <RevenueShareTable items={filteredItems} />
        </Paper>
      </Stack>
    </Container>
  );
}

export default RevenueShareDashboard;
