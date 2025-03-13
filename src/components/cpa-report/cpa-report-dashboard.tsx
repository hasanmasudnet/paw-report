import { useState, useEffect } from "react";
import {
  mockCPAReportItems,
  brands,
  trackerIds,
  usernames,
  years,
  months,
} from "./mock-data";
import { CPAReportItem, CPAReportFilterOptions } from "./types";
import { SummaryCard } from "./summary-card";
import { FilterBar } from "./filter-bar";
import { CPAReportTable } from "./cpa-report-table";
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

function CPAReportDashboard() {
  const [items, setItems] = useState<CPAReportItem[]>(mockCPAReportItems);
  const [filteredItems, setFilteredItems] =
    useState<CPAReportItem[]>(mockCPAReportItems);
  const [filters, setFilters] = useState<CPAReportFilterOptions>({
    brand: "",
    trackerId: "",
    username: "",
    affiliate: "",
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

      // Filter by username
      if (filters.username && item.username !== filters.username) {
        return false;
      }

      // Filter by affiliate
      if (filters.affiliate) {
        // Note: Since the CPAReportItem doesn't have an affiliate field in the current model,
        // we would need to add this field to the model or create a mapping.
        // For now, we'll skip this filter since it's not in the data model
        // This would be implemented when the data model is updated
      }

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

  const handleFilterChange = (newFilters: CPAReportFilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      brand: "",
      trackerId: "",
      username: "",
      affiliate: "",
      year: "",
      month: "",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          CPA Report Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze CPA counts across different brands, trackers, and
          users.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Filter Bar */}
        <FilterBar
          brands={brands}
          trackerIds={trackerIds}
          usernames={usernames}
          years={years}
          months={months}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Summary Cards */}
        <SummaryCard allItems={items} filteredItems={filteredItems} />

        {/* CPA Report Table */}
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
              CPA Report Items ({filteredItems.length})
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
                  cpaCount: item.cpaCount,
                  estimatedValue: item.cpaCount * 100, // Assuming $100 per CPA
                  currency: item.currency,
                  lastUpdated: new Date(item.lastUpdated).toLocaleDateString(),
                }));

                exportToExcel(exportData, {
                  fileName: "CPA_Report",
                  sheetName: "CPA Data",
                });
              }}
            >
              Export Excel
            </Button>
          </Box>
          <CPAReportTable items={filteredItems} />
        </Paper>
      </Stack>
    </Container>
  );
}

export default CPAReportDashboard;
