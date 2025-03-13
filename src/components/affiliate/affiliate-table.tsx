import React, { useState, useMemo } from "react";
import { Affiliate } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Collapse,
  Chip,
  Tooltip,
  TablePagination,
  LinearProgress,
  Badge,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  TrendingUp,
  TrendingDown,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";

interface AffiliateTableProps {
  affiliates: Affiliate[];
}

type SortField =
  | "username"
  | "brand"
  | "category"
  | "dealType"
  | "grossRevenue"
  | "commission"
  | "cpaCommission"
  | "profit"
  | "affiliate";
type SortDirection = "asc" | "desc";

export function AffiliateTable({ affiliates }: AffiliateTableProps) {
  const [expandedAffiliates, setExpandedAffiliates] = useState<
    Record<string, boolean>
  >({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("grossRevenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const toggleExpand = (affiliateId: string) => {
    setExpandedAffiliates((prev) => ({
      ...prev,
      [affiliateId]: !prev[affiliateId],
    }));
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc"); // Default to descending for new sort field
    }
  };

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPerformanceColor = (value: number) => {
    if (value > 10000) return "success.main";
    if (value < 3000) return "error.main";
    return "text.primary";
  };

  const getCommissionRateColor = (revenue: number, commission: number) => {
    if (revenue === 0) return "text.secondary";

    const rate = (commission / revenue) * 100;
    if (rate > 20) return "error.main";
    if (rate < 5) return "success.main";
    return "text.primary";
  };

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

  // Calculate commission rate for display
  const calculateCommissionRate = (revenue: number, commission: number) => {
    if (revenue === 0) return 0;
    return (commission / revenue) * 100;
  };

  // Sort and paginate affiliates
  const sortedAffiliates = useMemo(() => {
    return [...affiliates].sort((a, b) => {
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
        case "affiliate":
          comparison = (a.affiliate || "").localeCompare(b.affiliate || "");
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [affiliates, sortField, sortDirection]);

  const paginatedAffiliates = useMemo(() => {
    return sortedAffiliates.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [sortedAffiliates, page, rowsPerPage]);

  // Find max values for visual indicators
  const maxValues = useMemo(() => {
    let maxRevenue = 0;
    let maxCommission = 0;
    let maxProfit = 0;

    affiliates.forEach((affiliate) => {
      maxRevenue = Math.max(maxRevenue, affiliate.grossRevenue);
      maxCommission = Math.max(maxCommission, affiliate.commission);
      maxProfit = Math.max(maxProfit, affiliate.profit);
    });

    return { maxRevenue, maxCommission, maxProfit };
  }, [affiliates]);

  // Render sort indicator
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUpward fontSize="small" />
    ) : (
      <ArrowDownward fontSize="small" />
    );
  };

  return (
    <>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table aria-label="affiliate table">
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell
                onClick={() => handleSort("username")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Username {renderSortIcon("username")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("brand")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Brand {renderSortIcon("brand")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("category")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Category {renderSortIcon("category")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("affiliate")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Affiliate Company {renderSortIcon("affiliate")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("dealType")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Deal Type {renderSortIcon("dealType")}
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
                  Gross Revenue {renderSortIcon("grossRevenue")}
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
                  Commission {renderSortIcon("commission")}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("cpaCommission")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  CPA Commission {renderSortIcon("cpaCommission")}
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
                  Profit {renderSortIcon("profit")}
                </Box>
              </TableCell>
              <TableCell>Currency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAffiliates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No results found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAffiliates.map((affiliate) => (
                <React.Fragment key={affiliate.id}>
                  <TableRow hover>
                    <TableCell padding="checkbox">
                      {affiliate.subAffiliates &&
                        affiliate.subAffiliates.length > 0 && (
                          <IconButton
                            size="small"
                            onClick={() => toggleExpand(affiliate.id)}
                            aria-label="expand row"
                          >
                            {expandedAffiliates[affiliate.id] ? (
                              <KeyboardArrowDown />
                            ) : (
                              <Badge
                                badgeContent={affiliate.subAffiliates.length}
                                color="primary"
                                sx={{
                                  ".MuiBadge-badge": {
                                    fontSize: "0.6rem",
                                    height: "16px",
                                    minWidth: "16px",
                                  },
                                }}
                              >
                                <KeyboardArrowRight />
                              </Badge>
                            )}
                          </IconButton>
                        )}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {affiliate.username}
                      </Typography>
                    </TableCell>
                    <TableCell>{affiliate.brand}</TableCell>
                    <TableCell>{affiliate.category}</TableCell>
                    <TableCell>
                      <Typography color="primary.main" fontWeight="medium">
                        {affiliate.affiliate || "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={affiliate.dealType}
                        size="small"
                        sx={{
                          bgcolor: getDealTypeChipColor(affiliate.dealType).bg,
                          color: getDealTypeChipColor(affiliate.dealType).color,
                          fontWeight: "medium",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box>
                        <Typography
                          color={getPerformanceColor(affiliate.grossRevenue)}
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
                            (affiliate.grossRevenue / maxValues.maxRevenue) *
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
                      {formatCurrency(
                        affiliate.cpaCommission,
                        affiliate.currency,
                      )}
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
                          {affiliate.profit > affiliate.grossRevenue * 0.8 ? (
                            <TrendingUp
                              fontSize="small"
                              sx={{ mr: 0.5, color: "success.main" }}
                            />
                          ) : affiliate.profit <
                            affiliate.grossRevenue * 0.7 ? (
                            <TrendingDown
                              fontSize="small"
                              sx={{ mr: 0.5, color: "error.main" }}
                            />
                          ) : null}
                          {formatCurrency(affiliate.profit, affiliate.currency)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(affiliate.profit / maxValues.maxProfit) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(affiliate.profit),
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>{affiliate.currency}</TableCell>
                  </TableRow>

                  {/* Sub-affiliates */}
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={10}
                    >
                      <Collapse
                        in={expandedAffiliates[affiliate.id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ margin: 1, ml: 4, mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            component="div"
                            sx={{ fontStyle: "italic", mb: 1 }}
                          >
                            Sub-affiliates (
                            {affiliate.subAffiliates?.length || 0})
                          </Typography>
                          <Table size="small" aria-label="sub-affiliates">
                            <TableBody>
                              {affiliate.subAffiliates?.map((subAffiliate) => (
                                <TableRow
                                  key={subAffiliate.id}
                                  sx={{
                                    bgcolor: "action.hover",
                                    "&:hover": { bgcolor: "action.selected" },
                                  }}
                                >
                                  <TableCell
                                    sx={{ borderBottom: "none" }}
                                  ></TableCell>
                                  <TableCell sx={{ borderBottom: "none" }}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {subAffiliate.username}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "none" }}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {subAffiliate.brand}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "none" }}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {subAffiliate.category}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "none" }}>
                                    <Typography
                                      variant="body2"
                                      color="primary.main"
                                    >
                                      {affiliate.affiliate || "N/A"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "none" }}>
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
                                        fontSize: "0.7rem",
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ borderBottom: "none" }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color={getPerformanceColor(
                                        subAffiliate.grossRevenue,
                                      )}
                                    >
                                      {formatCurrency(
                                        subAffiliate.grossRevenue,
                                        subAffiliate.currency,
                                      )}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ borderBottom: "none" }}
                                  >
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color={getCommissionRateColor(
                                          subAffiliate.grossRevenue,
                                          subAffiliate.commission,
                                        )}
                                      >
                                        {formatCurrency(
                                          subAffiliate.commission,
                                          subAffiliate.currency,
                                        )}
                                      </Typography>
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
                                  <TableCell
                                    align="right"
                                    sx={{ borderBottom: "none" }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {formatCurrency(
                                        subAffiliate.cpaCommission,
                                        subAffiliate.currency,
                                      )}
                                    </Typography>
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{ borderBottom: "none" }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color={getPerformanceColor(
                                        subAffiliate.profit,
                                      )}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                      }}
                                    >
                                      {subAffiliate.profit >
                                      subAffiliate.grossRevenue * 0.8 ? (
                                        <TrendingUp
                                          fontSize="small"
                                          sx={{
                                            mr: 0.5,
                                            color: "success.main",
                                          }}
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
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "none" }}>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {subAffiliate.currency}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={affiliates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
