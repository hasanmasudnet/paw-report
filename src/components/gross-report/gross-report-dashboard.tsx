import { useState, useEffect } from "react";
import {
  mockGrossReportItems,
  brands,
  trackerIds,
  usernames,
  affiliateIds,
  affiliateNames,
  years,
  months,
} from "./mock-data";
import { GrossReportItem, GrossReportFilterOptions } from "./types";
import SummaryCard from "./summary-card";
import { FilterBar } from "./filter-bar";
import { GrossReportTable } from "./gross-report-table";
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

function GrossReportDashboard() {
  const [items, setItems] = useState<GrossReportItem[]>(mockGrossReportItems);
  const [filteredItems, setFilteredItems] =
    useState<GrossReportItem[]>(mockGrossReportItems);
  const [filters, setFilters] = useState<GrossReportFilterOptions>({
    year: "",
    month: "",
    brand: "",
    trackerId: "",
    username: "",
    affiliateId: "",
    affiliate: "",
  });

  // Apply filters whenever filters state changes
  useEffect(() => {
    const filtered = items.filter((item) => {
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

      // Filter by affiliate ID
      if (filters.affiliateId && item.affiliateId !== filters.affiliateId) {
        return false;
      }

      // Filter by affiliate name
      if (filters.affiliate && item.affiliate !== filters.affiliate) {
        return false;
      }

      return true;
    });

    setFilteredItems(filtered);
  }, [items, filters]);

  const handleFilterChange = (newFilters: GrossReportFilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      year: "",
      month: "",
      brand: "",
      trackerId: "",
      username: "",
      affiliateId: "",
      affiliate: "",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Gross Report Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze revenue, deductions, and profits across different
          brands and trackers.
        </Typography>
      </Box>

      <Stack spacing={{ xs: 2, md: 3 }}>
        {/* Filter Bar */}
        <FilterBar
          years={years}
          months={months}
          brands={brands}
          trackerIds={trackerIds}
          usernames={usernames}
          affiliateIds={affiliateIds}
          affiliateNames={affiliateNames}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Summary Cards */}
        <SummaryCard allItems={items} filteredItems={filteredItems} />

        {/* Gross Report Table */}
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
              Gross Report Items ({filteredItems.length})
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
                  deduction: item.deduction,
                  adminFee: item.adminFee,
                  username: item.username,
                  affiliate: item.affiliate,
                  netRevenue: item.netRevenue,
                  profit: item.profit,
                  currency: item.currency,
                  lastUpdated: new Date(item.lastUpdated).toLocaleDateString(),
                  affiliateId: item.affiliateId || "N/A",
                }));

                exportToExcel(exportData, {
                  fileName: "Gross_Report",
                  sheetName: "Gross Report",
                });
              }}
            >
              Export Excel
            </Button>
          </Box>
          <GrossReportTable items={filteredItems} />
        </Paper>
      </Stack>
    </Container>
  );
}

export default GrossReportDashboard;
