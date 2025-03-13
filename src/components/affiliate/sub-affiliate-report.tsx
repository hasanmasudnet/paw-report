import * as React from "react";
import { useState, useEffect } from "react";
import { mockAffiliates, brands, dealTypes, years, months } from "./mock-data";
import { Affiliate, SubAffiliate, FilterOptions } from "./types";
import { FilterBar } from "./filter-bar";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  TablePagination,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Button,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Group,
  Paid,
  Info,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { FileDown } from "lucide-react";
import { exportToExcel } from "@/utils/excel-export";

function SubAffiliateReport() {
  // Group sub-affiliates by parent
  const groupSubAffiliatesByParent = () => {
    const groupedData: Affiliate[] = [];

    mockAffiliates.forEach((affiliate) => {
      if (affiliate.subAffiliates && affiliate.subAffiliates.length > 0) {
        groupedData.push({
          ...affiliate,
          isParent: true,
        });
      }
    });

    return groupedData;
  };

  const groupedAffiliates = groupSubAffiliatesByParent();
  const [affiliates, setAffiliates] = useState<Affiliate[]>(groupedAffiliates);
  const [filteredAffiliates, setFilteredAffiliates] =
    useState<Affiliate[]>(groupedAffiliates);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("grossRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<FilterOptions>({
    brand: "",
    dealType: "",
    affiliateUsername: "",
    subAffiliateUsername: "",
    year: "",
    month: "",
  });

  // Apply filters whenever filters state changes
  useEffect(() => {
    let filtered = [...affiliates];

    // Filter by brand, deal type, etc.
    filtered = filtered.filter((affiliate) => {
      // Filter by brand
      if (filters.brand && affiliate.brand !== filters.brand) {
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

      // Filter by year
      if (
        filters.year &&
        affiliate.lastUpdated &&
        new Date(affiliate.lastUpdated).getFullYear().toString() !==
          filters.year
      ) {
        return false;
      }

      // Filter by month
      if (
        filters.month &&
        affiliate.lastUpdated &&
        new Date(affiliate.lastUpdated).getMonth().toString() !== filters.month
      ) {
        return false;
      }

      return true;
    });

    // Special handling for sub-affiliate username filter
    if (filters.subAffiliateUsername) {
      filtered = filtered
        .map((affiliate) => {
          if (
            !affiliate.subAffiliates ||
            affiliate.subAffiliates.length === 0
          ) {
            return null;
          }

          const matchingSubAffiliates = affiliate.subAffiliates.filter((sub) =>
            sub.username
              .toLowerCase()
              .includes(filters.subAffiliateUsername.toLowerCase()),
          );

          if (matchingSubAffiliates.length === 0) {
            return null;
          }

          return {
            ...affiliate,
            subAffiliates: matchingSubAffiliates,
          };
        })
        .filter(Boolean) as Affiliate[];
    }

    setFilteredAffiliates(filtered);
  }, [affiliates, filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      brand: "",
      dealType: "",
      affiliateUsername: "",
      subAffiliateUsername: "",
      year: "",
      month: "",
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending for new sort field
    }
  };

  const toggleRowExpanded = (affiliateId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [affiliateId]: !prev[affiliateId],
    }));
  };

  // Format currency
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get color based on performance
  const getPerformanceColor = (value: number) => {
    if (value > 10000) return "success.main";
    if (value < 3000) return "error.main";
    return "text.primary";
  };

  // Get color for commission rate
  const getCommissionRateColor = (revenue: number, commission: number) => {
    if (revenue === 0) return "text.secondary";

    const rate = (commission / revenue) * 100;
    if (rate > 20) return "error.main";
    if (rate < 5) return "success.main";
    return "text.primary";
  };

  // Get chip color for deal type
  const getDealTypeChipColor = (dealType: string) => {
    switch (dealType) {
      case "CPA":
        return { bg: "#e3f2fd", color: "#1976d2" };
      case "CPS":
        return { bg: "#e8f5e9", color: "#2e7d32" };
      case "CPL":
        return { bg: "#fff8e1", color: "#f57c00" };
      case "RevShare":
        return { bg: "#f3e5f5", color: "#9c27b0" };
      case "Hybrid":
        return { bg: "#e1f5fe", color: "#0288d1" };
      default:
        return { bg: "#f5f5f5", color: "#757575" };
    }
  };

  // Calculate commission rate
  const calculateCommissionRate = (revenue: number, commission: number) => {
    if (revenue === 0) return 0;
    return (commission / revenue) * 100;
  };

  // Sort affiliates
  const sortedAffiliates = [...filteredAffiliates].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "username":
        comparison = a.username.localeCompare(b.username);
        break;
      case "brand":
        comparison = a.brand.localeCompare(b.brand);
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      case "dealType":
        comparison = a.dealType.localeCompare(b.dealType);
        break;
      case "grossRevenue":
        comparison = a.grossRevenue - b.grossRevenue;
        break;
      case "commission":
        comparison = a.commission - b.commission;
        break;
      case "cpaCommission":
        comparison = a.cpaCommission - b.cpaCommission;
        break;
      case "profit":
        comparison = a.profit - b.profit;
        break;
      case "subAffiliateCount":
        comparison =
          (a.subAffiliates?.length || 0) - (b.subAffiliates?.length || 0);
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Paginate affiliates
  const paginatedAffiliates = sortedAffiliates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Find max values for visual indicators
  const maxValues = {
    maxRevenue: Math.max(
      ...filteredAffiliates.map((aff) => aff.grossRevenue),
      1,
    ),
    maxCommission: Math.max(
      ...filteredAffiliates.map((aff) => aff.commission),
      1,
    ),
    maxProfit: Math.max(...filteredAffiliates.map((aff) => aff.profit), 1),
  };

  // Calculate summary metrics
  const calculateSummaryMetrics = () => {
    // Define exchange rates to USD (simplified for demo)
    const exchangeRates = {
      USD: 1,
      EUR: 1.09,
      GBP: 1.28,
      CAD: 0.73,
      AUD: 0.66,
    };

    let totalGrossRevenue = 0;
    let totalCommission = 0;
    let totalCpaCommission = 0;
    let totalProfit = 0;
    let totalSubAffiliateCount = 0;

    // Track metrics by deal type
    const dealTypeMetrics = {
      CPA: { revenue: 0, commission: 0, count: 0 },
      CPS: { revenue: 0, commission: 0, count: 0 },
      CPL: { revenue: 0, commission: 0, count: 0 },
      RevShare: { revenue: 0, commission: 0, count: 0 },
      Hybrid: { revenue: 0, commission: 0, count: 0 },
    };

    filteredAffiliates.forEach((affiliate) => {
      // Convert to USD for consistent calculations
      const exchangeRate =
        exchangeRates[affiliate.currency as keyof typeof exchangeRates] || 1;

      // Add parent affiliate metrics
      totalGrossRevenue += affiliate.grossRevenue * exchangeRate;
      totalCommission += affiliate.commission * exchangeRate;
      totalCpaCommission += affiliate.cpaCommission * exchangeRate;
      totalProfit += affiliate.profit * exchangeRate;

      // Count sub-affiliates
      if (affiliate.subAffiliates) {
        totalSubAffiliateCount += affiliate.subAffiliates.length;

        // Add sub-affiliate metrics to deal type tracking
        affiliate.subAffiliates.forEach((sub) => {
          if (sub.dealType in dealTypeMetrics) {
            const subExchangeRate =
              exchangeRates[sub.currency as keyof typeof exchangeRates] || 1;

            dealTypeMetrics[
              sub.dealType as keyof typeof dealTypeMetrics
            ].revenue += sub.grossRevenue * subExchangeRate;
            dealTypeMetrics[
              sub.dealType as keyof typeof dealTypeMetrics
            ].commission += sub.commission * subExchangeRate;
            dealTypeMetrics[
              sub.dealType as keyof typeof dealTypeMetrics
            ].count += 1;
          }
        });
      }
    });

    // Calculate average commission rate
    const avgCommissionRate =
      totalGrossRevenue > 0 ? (totalCommission / totalGrossRevenue) * 100 : 0;

    // Calculate most profitable deal type
    let mostProfitableDealType = "None";
    let highestCommissionRate = 0;

    Object.entries(dealTypeMetrics).forEach(([dealType, metrics]) => {
      if (metrics.revenue > 0) {
        const commissionRate = (metrics.commission / metrics.revenue) * 100;
        if (commissionRate > highestCommissionRate) {
          highestCommissionRate = commissionRate;
          mostProfitableDealType = dealType;
        }
      }
    });

    return {
      totalGrossRevenue,
      totalCommission,
      totalCpaCommission,
      totalProfit,
      totalCount: filteredAffiliates.length,
      totalSubAffiliateCount,
      avgCommissionRate,
      mostProfitableDealType,
      highestCommissionRate,
    };
  };

  const summaryMetrics = calculateSummaryMetrics();

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Sub-Affiliate Report
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze performance of all sub-affiliates across your
          network.
        </Typography>
      </Box>

      <Stack spacing={{ xs: 2, md: 3 }}>
        {/* Filter Bar */}
        <FilterBar
          brands={brands}
          dealTypes={dealTypes}
          years={years}
          months={months}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Summary Cards */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AttachMoney color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Total Revenue</Typography>
                  <Tooltip title="Total revenue generated by all sub-affiliates (converted to USD)">
                    <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                  </Tooltip>
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  $
                  {Math.round(
                    summaryMetrics.totalGrossRevenue,
                  ).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg. Commission Rate:{" "}
                  {summaryMetrics.avgCommissionRate.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Paid color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Total Commission</Typography>
                  <Tooltip title="Total commission paid to sub-affiliates (converted to USD)">
                    <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                  </Tooltip>
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  ${Math.round(summaryMetrics.totalCommission).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Best Deal Type: {summaryMetrics.mostProfitableDealType} (
                  {summaryMetrics.highestCommissionRate.toFixed(1)}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Total Profit</Typography>
                  <Tooltip title="Net profit from sub-affiliates (converted to USD)">
                    <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                  </Tooltip>
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  ${Math.round(summaryMetrics.totalProfit).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  CPA Commission: $
                  {Math.round(
                    summaryMetrics.totalCpaCommission,
                  ).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Group color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Sub-Affiliates</Typography>
                  <Tooltip title="Number of sub-affiliates and parent affiliates">
                    <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                  </Tooltip>
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {summaryMetrics.totalSubAffiliateCount.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Under {summaryMetrics.totalCount} parent affiliates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sub-Affiliate Table */}
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
              Sub-Affiliates ({summaryMetrics.totalSubAffiliateCount})
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
                    grossRevenue: affiliate.grossRevenue,
                    commission: affiliate.commission,
                    commissionRate:
                      calculateCommissionRate(
                        affiliate.grossRevenue,
                        affiliate.commission,
                      ).toFixed(1) + "%",
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
                      grossRevenue: sub.grossRevenue,
                      commission: sub.commission,
                      commissionRate:
                        calculateCommissionRate(
                          sub.grossRevenue,
                          sub.commission,
                        ).toFixed(1) + "%",
                      profit: sub.profit,
                      currency: sub.currency,
                    })) || [];

                  return [mainRow, ...subRows];
                });

                exportToExcel(exportData, {
                  fileName: "Sub_Affiliate_Report",
                  sheetName: "Sub-Affiliates",
                });
              }}
            >
              Export Excel
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            elevation={1}
            sx={{ borderRadius: 2, overflowX: "auto" }}
          >
            <Table aria-label="sub-affiliate table">
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell width={50} />
                  <TableCell
                    onClick={() => handleSort("username")}
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Affiliate
                      {sortField === "username" && (
                        <TrendingUp
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("brand")}
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Brand
                      {sortField === "brand" && (
                        <TrendingUp
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("category")}
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Category
                      {sortField === "category" && (
                        <TrendingUp
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("dealType")}
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Deal Type
                      {sortField === "dealType" && (
                        <TrendingUp
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={() => handleSort("grossRevenue")}
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      Gross Revenue
                      {sortField === "grossRevenue" && (
                        <TrendingUp
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={() => handleSort("commission")}
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      Commission
                      {sortField === "commission" && (
                        <TrendingUp
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={() => handleSort("profit")}
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      Profit
                      {sortField === "profit" && (
                        <TrendingUp
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("subAffiliateCount")}
                    sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Sub-Affiliates
                      {sortField === "subAffiliateCount" && (
                        <TrendingUp
                          fontSize="small"
                          sx={{
                            ml: 0.5,
                            transform:
                              sortDirection === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAffiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No affiliates with sub-affiliates found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAffiliates.map((affiliate) => {
                    const isExpanded = expandedRows[affiliate.id] || false;
                    return (
                      <React.Fragment key={affiliate.id}>
                        <TableRow hover>
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => toggleRowExpanded(affiliate.id)}
                              disabled={!affiliate.subAffiliates?.length}
                              sx={{
                                opacity: affiliate.subAffiliates?.length
                                  ? 1
                                  : 0.3,
                              }}
                            >
                              {isExpanded ? (
                                <KeyboardArrowUp />
                              ) : (
                                <KeyboardArrowDown />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="medium">
                              {affiliate.username}
                            </Typography>
                            {affiliate.affiliate && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {affiliate.affiliate}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{affiliate.brand}</TableCell>
                          <TableCell>{affiliate.category}</TableCell>
                          <TableCell>
                            <Chip
                              label={affiliate.dealType}
                              size="small"
                              sx={{
                                bgcolor: getDealTypeChipColor(
                                  affiliate.dealType,
                                ).bg,
                                color: getDealTypeChipColor(affiliate.dealType)
                                  .color,
                                fontWeight: "medium",
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box>
                              <Typography
                                color={getPerformanceColor(
                                  affiliate.grossRevenue,
                                )}
                                fontWeight="medium"
                              >
                                {formatCurrency(
                                  affiliate.grossRevenue,
                                  affiliate.currency,
                                )}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (affiliate.grossRevenue /
                                    maxValues.maxRevenue) *
                                  100
                                }
                                sx={{
                                  height: 4,
                                  borderRadius: 2,
                                  mt: 0.5,
                                  bgcolor: "rgba(0,0,0,0.05)",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: getPerformanceColor(
                                      affiliate.grossRevenue,
                                    ),
                                  },
                                }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box>
                              <Typography
                                color={getCommissionRateColor(
                                  affiliate.grossRevenue,
                                  affiliate.commission,
                                )}
                                fontWeight="medium"
                              >
                                {formatCurrency(
                                  affiliate.commission,
                                  affiliate.currency,
                                )}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                  mt: 0.5,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color={getCommissionRateColor(
                                    affiliate.grossRevenue,
                                    affiliate.commission,
                                  )}
                                >
                                  {calculateCommissionRate(
                                    affiliate.grossRevenue,
                                    affiliate.commission,
                                  ).toFixed(1)}
                                  %
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Typography
                                color={getPerformanceColor(affiliate.profit)}
                                fontWeight="medium"
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {affiliate.profit >
                                affiliate.grossRevenue * 0.5 ? (
                                  <TrendingUp
                                    fontSize="small"
                                    sx={{ mr: 0.5, color: "success.main" }}
                                  />
                                ) : affiliate.profit <
                                  affiliate.grossRevenue * 0.3 ? (
                                  <TrendingDown
                                    fontSize="small"
                                    sx={{ mr: 0.5, color: "error.main" }}
                                  />
                                ) : null}
                                {formatCurrency(
                                  affiliate.profit,
                                  affiliate.currency,
                                )}
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (affiliate.profit / maxValues.maxProfit) * 100
                              }
                              sx={{
                                height: 4,
                                borderRadius: 2,
                                mt: 0.5,
                                bgcolor: "rgba(0,0,0,0.05)",
                                "& .MuiLinearProgress-bar": {
                                  bgcolor: getPerformanceColor(
                                    affiliate.profit,
                                  ),
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={affiliate.subAffiliates?.length || 0}
                              size="small"
                              color={
                                affiliate.subAffiliates?.length
                                  ? "primary"
                                  : "default"
                              }
                              sx={{ fontWeight: "medium" }}
                            />
                          </TableCell>
                          <TableCell>{affiliate.currency}</TableCell>
                        </TableRow>

                        {/* Sub-Affiliates Collapsible Section */}
                        {affiliate.subAffiliates && (
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={10}
                            >
                              <Collapse
                                in={isExpanded}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box sx={{ margin: 2 }}>
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    component="div"
                                    sx={{ fontWeight: "bold", mb: 2 }}
                                  >
                                    Sub-Affiliates (
                                    {affiliate.subAffiliates.length})
                                  </Typography>
                                  <Table
                                    size="small"
                                    aria-label="sub-affiliates"
                                    sx={{
                                      bgcolor: "action.hover",
                                      borderRadius: 1,
                                    }}
                                  >
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Deal Type</TableCell>
                                        <TableCell align="right">
                                          Gross Revenue
                                        </TableCell>
                                        <TableCell align="right">
                                          Commission
                                        </TableCell>
                                        <TableCell align="right">
                                          CPA Commission
                                        </TableCell>
                                        <TableCell align="right">
                                          Profit
                                        </TableCell>
                                        <TableCell>Currency</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {affiliate.subAffiliates.map(
                                        (subAffiliate) => (
                                          <TableRow key={subAffiliate.id}>
                                            <TableCell
                                              component="th"
                                              scope="row"
                                            >
                                              {subAffiliate.username}
                                            </TableCell>
                                            <TableCell>
                                              {subAffiliate.brand}
                                            </TableCell>
                                            <TableCell>
                                              {subAffiliate.category}
                                            </TableCell>
                                            <TableCell>
                                              <Chip
                                                label={subAffiliate.dealType}
                                                size="small"
                                                sx={{
                                                  bgcolor: getDealTypeChipColor(
                                                    subAffiliate.dealType,
                                                  ).bg,
                                                  color: getDealTypeChipColor(
                                                    subAffiliate.dealType,
                                                  ).color,
                                                  fontWeight: "medium",
                                                }}
                                              />
                                            </TableCell>
                                            <TableCell align="right">
                                              {formatCurrency(
                                                subAffiliate.grossRevenue,
                                                subAffiliate.currency,
                                              )}
                                            </TableCell>
                                            <TableCell align="right">
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "flex-end",
                                                }}
                                              >
                                                {formatCurrency(
                                                  subAffiliate.commission,
                                                  subAffiliate.currency,
                                                )}
                                                <Typography
                                                  variant="caption"
                                                  color={getCommissionRateColor(
                                                    subAffiliate.grossRevenue,
                                                    subAffiliate.commission,
                                                  )}
                                                >
                                                  {calculateCommissionRate(
                                                    subAffiliate.grossRevenue,
                                                    subAffiliate.commission,
                                                  ).toFixed(1)}
                                                  %
                                                </Typography>
                                              </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                              {formatCurrency(
                                                subAffiliate.cpaCommission,
                                                subAffiliate.currency,
                                              )}
                                            </TableCell>
                                            <TableCell align="right">
                                              {formatCurrency(
                                                subAffiliate.profit,
                                                subAffiliate.currency,
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {subAffiliate.currency}
                                            </TableCell>
                                          </TableRow>
                                        ),
                                      )}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredAffiliates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Stack>
    </Container>
  );
}

export default SubAffiliateReport;
