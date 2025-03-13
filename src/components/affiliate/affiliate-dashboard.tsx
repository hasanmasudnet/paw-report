import { useState, useEffect } from "react";
import {
  mockAffiliates,
  brands,
  categories,
  dealTypes,
  affiliateCompanies,
} from "./mock-data";
import { Affiliate, FilterOptions } from "./types";
import { SummaryCard } from "./summary-card";
import { FilterBar } from "./filter-bar";
import { AffiliateTable } from "./affiliate-table";
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

function AffiliateDashboard() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>(mockAffiliates);
  const [filteredAffiliates, setFilteredAffiliates] =
    useState<Affiliate[]>(mockAffiliates);
  const [filters, setFilters] = useState<FilterOptions>({
    brand: "",
    category: "",
    dealType: "",
    affiliateUsername: "",
    subAffiliateUsername: "",
    affiliate: "",
  });

  // Apply filters whenever filters state changes
  useEffect(() => {
    // First, filter to only include affiliates with sub-affiliates
    let affiliatesWithSubs = affiliates.filter(
      (affiliate) =>
        affiliate.subAffiliates && affiliate.subAffiliates.length > 0,
    );

    let filtered = [];

    // Special case for sub-affiliate username search
    if (filters.subAffiliateUsername) {
      // Create a deep copy of affiliates that have matching sub-affiliates
      const matchingParents = affiliatesWithSubs
        .filter((affiliate) =>
          affiliate.subAffiliates.some((sub) =>
            sub.username
              .toLowerCase()
              .includes(filters.subAffiliateUsername.toLowerCase()),
          ),
        )
        .map((affiliate) => {
          // Create a copy of the affiliate with only matching sub-affiliates
          return {
            ...affiliate,
            subAffiliates: affiliate.subAffiliates.filter((sub) =>
              sub.username
                .toLowerCase()
                .includes(filters.subAffiliateUsername.toLowerCase()),
            ),
          };
        });

      filtered = matchingParents;
    } else {
      // Standard filtering for all other cases
      filtered = affiliatesWithSubs.filter((affiliate) => {
        // Filter by brand
        if (filters.brand && affiliate.brand !== filters.brand) {
          return false;
        }

        // Filter by category
        if (filters.category && affiliate.category !== filters.category) {
          return false;
        }

        // Filter by deal type
        if (filters.dealType && affiliate.dealType !== filters.dealType) {
          return false;
        }

        // Filter by affiliate username (case insensitive)
        if (
          filters.affiliateUsername &&
          !affiliate.username
            .toLowerCase()
            .includes(filters.affiliateUsername.toLowerCase())
        ) {
          return false;
        }

        // Filter by affiliate company
        if (filters.affiliate && affiliate.affiliate !== filters.affiliate) {
          return false;
        }

        // Filter by revenue range
        if (
          (filters.minRevenue !== undefined &&
            affiliate.grossRevenue < filters.minRevenue) ||
          (filters.maxRevenue !== undefined &&
            affiliate.grossRevenue > filters.maxRevenue)
        ) {
          return false;
        }

        // Filter by commission rate range
        const commissionRate =
          affiliate.grossRevenue > 0
            ? (affiliate.commission / affiliate.grossRevenue) * 100
            : 0;

        if (
          (filters.minCommissionRate !== undefined &&
            commissionRate < filters.minCommissionRate) ||
          (filters.maxCommissionRate !== undefined &&
            commissionRate > filters.maxCommissionRate)
        ) {
          return false;
        }

        return true;
      });
    }

    setFilteredAffiliates(filtered);
  }, [affiliates, filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      brand: "",
      category: "",
      dealType: "",
      affiliateUsername: "",
      subAffiliateUsername: "",
      affiliate: "",
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Affiliate Management Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and manage your affiliate marketing performance across different
          brands, categories, and deal types.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Filter Bar */}
        <FilterBar
          brands={brands}
          categories={categories}
          dealTypes={dealTypes}
          affiliateCompanies={affiliateCompanies}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Summary Cards */}
        <SummaryCard
          affiliates={affiliates}
          filteredAffiliates={filteredAffiliates}
        />

        {/* Affiliate Table */}
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
              Affiliates with Sub-Affiliates ({filteredAffiliates.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDown size={18} />}
              onClick={() => {
                // Prepare data for export - flatten sub-affiliates
                const exportData = filteredAffiliates.flatMap((affiliate) => {
                  // Main affiliate row
                  const mainRow = {
                    type: "Affiliate",
                    username: affiliate.username,
                    brand: affiliate.brand,
                    category: affiliate.category,
                    dealType: affiliate.dealType,
                    affiliate: affiliate.affiliate || "N/A",
                    grossRevenue: affiliate.grossRevenue,
                    commission: affiliate.commission,
                    cpaCommission: affiliate.cpaCommission,
                    profit: affiliate.profit,
                    currency: affiliate.currency,
                    subAffiliateCount: affiliate.subAffiliates?.length || 0,
                  };

                  // Sub-affiliate rows
                  const subRows =
                    affiliate.subAffiliates?.map((sub) => ({
                      type: "Sub-Affiliate",
                      username: sub.username,
                      parentUsername: affiliate.username,
                      brand: sub.brand,
                      category: sub.category,
                      dealType: sub.dealType,
                      affiliate: affiliate.affiliate || "N/A",
                      grossRevenue: sub.grossRevenue,
                      commission: sub.commission,
                      cpaCommission: sub.cpaCommission,
                      profit: sub.profit,
                      currency: sub.currency,
                    })) || [];

                  return [mainRow, ...subRows];
                });

                exportToExcel(exportData, {
                  fileName: "Affiliate_Report",
                  sheetName: "Affiliates",
                });
              }}
            >
              Export Excel
            </Button>
          </Box>
          <AffiliateTable affiliates={filteredAffiliates} />
        </Paper>
      </Stack>
    </Container>
  );
}

export default AffiliateDashboard;
