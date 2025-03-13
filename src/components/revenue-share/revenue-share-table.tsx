import React, { useState, useMemo } from "react";
import { RevenueShareItem } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  TablePagination,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Percent } from "@mui/icons-material";

interface RevenueShareTableProps {
  items: RevenueShareItem[];
}

type SortField =
  | "brand"
  | "trackerId"
  | "username"
  | "affiliate"
  | "grossRevenue"
  | "sharePercentage"
  | "shareAmount"
  | "netRevenue"
  | "currency"
  | "lastUpdated";

type SortDirection = "asc" | "desc";

export function RevenueShareTable({ items }: RevenueShareTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("lastUpdated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getPerformanceColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 70) return "success.main";
    if (percentage < 30) return "error.main";
    return "primary.main";
  };

  const getSharePercentageColor = (percentage: number) => {
    if (percentage > 30) return "error.main";
    if (percentage < 15) return "success.main";
    return "warning.main";
  };

  // Sort and paginate items
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "brand":
          comparison = a.brand.localeCompare(b.brand);
          break;
        case "trackerId":
          comparison = a.trackerId.localeCompare(b.trackerId);
          break;
        case "username":
          comparison = a.username.localeCompare(b.username);
          break;
        case "affiliate":
          comparison = a.affiliate.localeCompare(b.affiliate);
          break;
        case "grossRevenue":
          comparison = a.grossRevenue - b.grossRevenue;
          break;
        case "sharePercentage":
          comparison = a.sharePercentage - b.sharePercentage;
          break;
        case "shareAmount":
          comparison = a.shareAmount - b.shareAmount;
          break;
        case "netRevenue":
          comparison = a.netRevenue - b.netRevenue;
          break;
        case "currency":
          comparison = a.currency.localeCompare(b.currency);
          break;
        case "lastUpdated":
          comparison =
            new Date(a.lastUpdated).getTime() -
            new Date(b.lastUpdated).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [items, sortField, sortDirection]);

  const paginatedItems = useMemo(() => {
    return sortedItems.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [sortedItems, page, rowsPerPage]);

  // Find max values for visual indicators
  const maxValues = useMemo(() => {
    let maxGrossRevenue = 0;
    let maxShareAmount = 0;
    let maxNetRevenue = 0;

    items.forEach((item) => {
      maxGrossRevenue = Math.max(maxGrossRevenue, item.grossRevenue);
      maxShareAmount = Math.max(maxShareAmount, item.shareAmount);
      maxNetRevenue = Math.max(maxNetRevenue, item.netRevenue);
    });

    return { maxGrossRevenue, maxShareAmount, maxNetRevenue };
  }, [items]);

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
        <Table aria-label="revenue share table">
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell
                onClick={() => handleSort("brand")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  BRAND {renderSortIcon("brand")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("trackerId")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  TRACKER ID {renderSortIcon("trackerId")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("username")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  USERNAME {renderSortIcon("username")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("affiliate")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  AFFILIATE {renderSortIcon("affiliate")}
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
                  GROSS REVENUE {renderSortIcon("grossRevenue")}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("sharePercentage")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  SHARE % {renderSortIcon("sharePercentage")}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("shareAmount")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  SHARE AMOUNT {renderSortIcon("shareAmount")}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("netRevenue")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  NET REVENUE {renderSortIcon("netRevenue")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("currency")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  CURRENCY {renderSortIcon("currency")}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("lastUpdated")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  LAST UPDATED {renderSortIcon("lastUpdated")}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No results found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">{item.brand}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.trackerId}
                      size="small"
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: "medium",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>{item.username}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="primary.main" fontWeight="medium">
                      {item.affiliate}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(
                          item.grossRevenue,
                          maxValues.maxGrossRevenue,
                        )}
                        fontWeight="medium"
                      >
                        {formatCurrency(item.grossRevenue, item.currency)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (item.grossRevenue / maxValues.maxGrossRevenue) * 100
                        }
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(
                              item.grossRevenue,
                              maxValues.maxGrossRevenue,
                            ),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Revenue Share Percentage">
                      <Typography
                        fontWeight="medium"
                        color={getSharePercentageColor(item.sharePercentage)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        {item.sharePercentage}%
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(
                          item.shareAmount,
                          maxValues.maxShareAmount,
                        )}
                        fontWeight="medium"
                      >
                        {formatCurrency(item.shareAmount, item.currency)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (item.shareAmount / maxValues.maxShareAmount) * 100
                        }
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(
                              item.shareAmount,
                              maxValues.maxShareAmount,
                            ),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(
                          item.netRevenue,
                          maxValues.maxNetRevenue,
                        )}
                        fontWeight="medium"
                      >
                        {formatCurrency(item.netRevenue, item.currency)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (item.netRevenue / maxValues.maxNetRevenue) * 100
                        }
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(
                              item.netRevenue,
                              maxValues.maxNetRevenue,
                            ),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>{item.currency}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(item.lastUpdated)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
