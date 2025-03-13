import { useState, useEffect } from "react";
import {
  mockAffiliates,
  brands,
  categories,
  dealTypes,
  affiliateCompanies,
} from "./mock-data";
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
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Group,
  Paid,
  Info,
} from "@mui/icons-material";
import { FileDown } from "lucide-react";
import { exportToExcel } from "@/utils/excel-export";

function SubAffiliateReport() {
  // Extract all sub-affiliates from the mock data
  const extractSubAffiliates = () => {
    const allSubAffiliates: (SubAffiliate & {
      parentUsername: string;
      parentAffiliate: string;
    })[] = [];

    mockAffiliates.forEach((affiliate) => {
      if (affiliate.subAffiliates && affiliate.subAffiliates.length > 0) {
        affiliate.subAffiliates.forEach((sub) => {
          allSubAffiliates.push({
            ...sub,
            parentUsername: affiliate.username,
            parentAffiliate: affiliate.affiliate || "N/A",
          });
        });
      }
    });

    return allSubAffiliates;
  };

  const allSubAffiliates = extractSubAffiliates();
  const [subAffiliates, setSubAffiliates] = useState(allSubAffiliates);
  const [filteredSubAffiliates, setFilteredSubAffiliates] =
    useState(allSubAffiliates);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("grossRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
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
    let filtered = subAffiliates.filter((subAffiliate) => {
      // Filter by brand
      if (filters.brand && subAffiliate.brand !== filters.brand) {
        return false;
      }

      // Filter by category
      if (filters.category && subAffiliate.category !== filters.category) {
        return false;
      }

      // Filter by deal type
      if (filters.dealType && subAffiliate.dealType !== filters.dealType) {
        return false;
      }

      // Filter by parent affiliate username (case insensitive)
      if (
        filters.affiliateUsername &&
        !subAffiliate.parentUsername
          .toLowerCase()
          .includes(filters.affiliateUsername.toLowerCase())
      ) {
        return false;
      }

      // Filter by sub-affiliate username (case insensitive)
      if (
        filters.subAffiliateUsername &&
        !subAffiliate.username
          .toLowerCase()
          .includes(filters.subAffiliateUsername.toLowerCase())
      ) {
        return false;
      }

      // Filter by affiliate company
      if (
        filters.affiliate &&
        subAffiliate.parentAffiliate !== filters.affiliate
      ) {
        return false;
      }

      // Filter by revenue range
      if (
        (filters.minRevenue !== undefined &&
          subAffiliate.grossRevenue < filters.minRevenue) ||
        (filters.maxRevenue !== undefined &&
          subAffiliate.grossRevenue > filters.maxRevenue)
      ) {
        return false;
      }

      // Filter by commission rate range
      const commissionRate =
        subAffiliate.grossRevenue > 0
          ? (subAffiliate.commission / subAffiliate.grossRevenue) * 100
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

    setFilteredSubAffiliates(filtered);
  }, [subAffiliates, filters]);

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

  // Sort and paginate sub-affiliates
  const sortedSubAffiliates = [...filteredSubAffiliates].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case "username":
        comparison = a.username.localeCompare(b.username);
        break;
      case "parentUsername":
        comparison = a.parentUsername.localeCompare(b.parentUsername);
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
      case "parentAffiliate":
        comparison = a.parentAffiliate.localeCompare(b.parentAffiliate);
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const paginatedSubAffiliates = sortedSubAffiliates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Find max values for visual indicators
  const maxValues = {
    maxRevenue: Math.max(
      ...filteredSubAffiliates.map((sub) => sub.grossRevenue),
      1,
    ),
    maxCommission: Math.max(
      ...filteredSubAffiliates.map((sub) => sub.commission),
      1,
    ),
    maxProfit: Math.max(...filteredSubAffiliates.map((sub) => sub.profit), 1),
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
    let totalCount = filteredSubAffiliates.length;
    let parentAffiliateCount = new Set(
      filteredSubAffiliates.map((sub) => sub.parentId),
    ).size;

    // Track metrics by deal type
    const dealTypeMetrics = {
      CPA: { revenue: 0, commission: 0, count: 0 },
      CPS: { revenue: 0, commission: 0, count: 0 },
      CPL: { revenue: 0, commission: 0, count: 0 },
      RevShare: { revenue: 0, commission: 0, count: 0 },
      Hybrid: { revenue: 0, commission: 0, count: 0 },
    };

    filteredSubAffiliates.forEach((sub) => {
      // Convert to USD for consistent calculations
      const exchangeRate =
        exchangeRates[sub.currency as keyof typeof exchangeRates] || 1;

      const revenueInUSD = sub.grossRevenue * exchangeRate;
      const commissionInUSD = sub.commission * exchangeRate;
      const cpaCommissionInUSD = sub.cpaCommission * exchangeRate;
      const profitInUSD = sub.profit * exchangeRate;

      totalGrossRevenue += revenueInUSD;
      totalCommission += commissionInUSD;
      totalCpaCommission += cpaCommissionInUSD;
      totalProfit += profitInUSD;

      // Track by deal type
      if (sub.dealType in dealTypeMetrics) {
        dealTypeMetrics[sub.dealType as keyof typeof dealTypeMetrics].revenue +=
          revenueInUSD;
        dealTypeMetrics[
          sub.dealType as keyof typeof dealTypeMetrics
        ].commission += commissionInUSD;
        dealTypeMetrics[sub.dealType as keyof typeof dealTypeMetrics].count +=
          1;
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
      totalCount,
      parentAffiliateCount,
      avgCommissionRate,
      mostProfitableDealType,
      highestCommissionRate,
    };
  };

  const summaryMetrics = calculateSummaryMetrics();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Sub-Affiliate Report
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Track and analyze performance of all sub-affiliates across your
          network.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Summary Cards */}
        <Grid container spacing={3}>
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
                  {summaryMetrics.totalCount.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Under {summaryMetrics.parentAffiliateCount} parent affiliates
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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

        {/* Sub-Affiliate Table */}
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
              Sub-Affiliates ({filteredSubAffiliates.length})
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDown size={18} />}
              onClick={() => {
                // Prepare data for export
                const exportData = filteredSubAffiliates.map(
                  (subAffiliate) => ({
                    parentUsername: subAffiliate.parentUsername,
                    username: subAffiliate.username,
                    parentAffiliate: subAffiliate.parentAffiliate,
                    brand: subAffiliate.brand,
                    category: subAffiliate.category,
                    dealType: subAffiliate.dealType,
                    grossRevenue: subAffiliate.grossRevenue,
                    commission: subAffiliate.commission,
                    commissionRate:
                      calculateCommissionRate(
                        subAffiliate.grossRevenue,
                        subAffiliate.commission,
                      ).toFixed(1) + "%",
                    profit: subAffiliate.profit,
                    currency: subAffiliate.currency,
                  }),
                );

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
            sx={{ borderRadius: 2 }}
          >
            <Table aria-label="sub-affiliate table">
              <TableHead sx={{ bgcolor: "action.hover" }}>
                <TableRow>
                  <TableCell
                    onClick={() => handleSort("parentUsername")}
                    sx={{ cursor: "pointer" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Parent Affiliate
                      {sortField === "parentUsername" && (
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
                    onClick={() => handleSort("username")}
                    sx={{ cursor: "pointer" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Sub-Affiliate
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
                    onClick={() => handleSort("parentAffiliate")}
                    sx={{ cursor: "pointer" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Affiliate Company
                      {sortField === "parentAffiliate" && (
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
                    sx={{ cursor: "pointer" }}
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
                    sx={{ cursor: "pointer" }}
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
                    sx={{ cursor: "pointer" }}
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
                    sx={{ cursor: "pointer" }}
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
                    sx={{ cursor: "pointer" }}
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
                    sx={{ cursor: "pointer" }}
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
                  <TableCell>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSubAffiliates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No sub-affiliates found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSubAffiliates.map((subAffiliate) => (
                    <TableRow key={subAffiliate.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {subAffiliate.parentUsername}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{subAffiliate.username}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="primary.main" fontWeight="medium">
                          {subAffiliate.parentAffiliate}
                        </Typography>
                      </TableCell>
                      <TableCell>{subAffiliate.brand}</TableCell>
                      <TableCell>{subAffiliate.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={subAffiliate.dealType}
                          size="small"
                          sx={{
                            bgcolor: getDealTypeChipColor(subAffiliate.dealType)
                              .bg,
                            color: getDealTypeChipColor(subAffiliate.dealType)
                              .color,
                            fontWeight: "medium",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography
                            color={getPerformanceColor(
                              subAffiliate.grossRevenue,
                            )}
                            fontWeight="medium"
                          >
                            {formatCurrency(
                              subAffiliate.grossRevenue,
                              subAffiliate.currency,
                            )}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (subAffiliate.grossRevenue /
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
                                  subAffiliate.grossRevenue,
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
                              subAffiliate.grossRevenue,
                              subAffiliate.commission,
                            )}
                            fontWeight="medium"
                          >
                            {formatCurrency(
                              subAffiliate.commission,
                              subAffiliate.currency,
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
                            color={getPerformanceColor(subAffiliate.profit)}
                            fontWeight="medium"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            {subAffiliate.profit >
                            subAffiliate.grossRevenue * 0.8 ? (
                              <TrendingUp
                                fontSize="small"
                                sx={{ mr: 0.5, color: "success.main" }}
                              />
                            ) : subAffiliate.profit <
                              subAffiliate.grossRevenue * 0.7 ? (
                              <TrendingDown
                                fontSize="small"
                                sx={{ mr: 0.5, color: "error.main" }}
                              />
                            ) : null}
                            {formatCurrency(
                              subAffiliate.profit,
                              subAffiliate.currency,
                            )}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={
                            (subAffiliate.profit / maxValues.maxProfit) * 100
                          }
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            mt: 0.5,
                            bgcolor: "rgba(0,0,0,0.05)",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: getPerformanceColor(subAffiliate.profit),
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>{subAffiliate.currency}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredSubAffiliates.length}
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
