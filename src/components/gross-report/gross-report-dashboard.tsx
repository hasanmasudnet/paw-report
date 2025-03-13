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
import { SummaryCard } from "./summary-card";
import { FilterBar } from "./filter-bar";
import { GrossReportTable } from "./gross-report-table";
import { Box, Container, Typography, Stack, Paper } from "@mui/material";

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Gross Report Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze revenue, deductions, and profits across different
          brands and trackers.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Summary Cards */}
        <SummaryCard allItems={items} filteredItems={filteredItems} />

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

        {/* Gross Report Table */}
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" fontWeight="medium">
              Gross Report Items ({filteredItems.length})
            </Typography>
          </Box>
          <GrossReportTable items={filteredItems} />
        </Paper>
      </Stack>
    </Container>
  );
}

export default GrossReportDashboard;
