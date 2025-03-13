import { useState } from "react";
import { Affiliate } from "./types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Typography,
  LinearProgress,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

interface AffiliateTableProps {
  affiliates: Affiliate[];
}

function AffiliateTable({ affiliates }: AffiliateTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("grossRevenue");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

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
  const sortedAffiliates = [...affiliates].sort((a, b) => {
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
    maxRevenue: Math.max(...affiliates.map((aff) => aff.grossRevenue), 1),
    maxCommission: Math.max(...affiliates.map((aff) => aff.commission), 1),
    maxProfit: Math.max(...affiliates.map((aff) => aff.profit), 1),
  };

  return (
    <>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table aria-label="affiliate table">
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell width={50} />
              <TableCell
                onClick={() => handleSort("username")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Username
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
                  CPA Commission
                  {sortField === "cpaCommission" && (
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
              <TableCell
                onClick={() => handleSort("subAffiliateCount")}
                sx={{ cursor: "pointer" }}
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
              <TableCell>Currency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAffiliates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No affiliates found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAffiliates.map((affiliate) => {
                const isExpanded = expandedRows[affiliate.id] || false;
                return (
                  <>
                    <TableRow key={affiliate.id} hover>
                      <TableCell>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => toggleRowExpanded(affiliate.id)}
                          disabled={!affiliate.subAffiliates?.length}
                          sx={{
                            opacity: affiliate.subAffiliates?.length ? 1 : 0.3,
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
                          <Typography variant="caption" color="text.secondary">
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
                            bgcolor: getDealTypeChipColor(affiliate.dealType)
                              .bg,
                            color: getDealTypeChipColor(affiliate.dealType)
                              .color,
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
                        <Typography fontWeight="medium">
                          {formatCurrency(
                            affiliate.cpaCommission,
                            affiliate.currency,
                          )}
                        </Typography>
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
                            {affiliate.profit > affiliate.grossRevenue * 0.5 ? (
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
                          colSpan={11}
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
                                Sub-Affiliates ({affiliate.subAffiliates.length}
                                )
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
                                    <TableCell align="right">Profit</TableCell>
                                    <TableCell>Currency</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {affiliate.subAffiliates.map(
                                    (subAffiliate) => (
                                      <TableRow key={subAffiliate.id}>
                                        <TableCell component="th" scope="row">
                                          {subAffiliate.username}
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
                  </>
                );
              })
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

export default AffiliateTable;
