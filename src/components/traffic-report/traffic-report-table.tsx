import React, { useState, useMemo } from "react";
import { TrafficReportItem } from "./types";
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
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

interface TrafficReportTableProps {
  items: TrafficReportItem[];
}

type SortField =
  | "brand"
  | "trackerId"
  | "impressions"
  | "clicks"
  | "newDeposits"
  | "ctr"
  | "conversionRate"
  | "lastUpdated";

type SortDirection = "asc" | "desc";

export function TrafficReportTable({ items }: TrafficReportTableProps) {
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

  const getCTRColor = (ctr: number) => {
    if (ctr > 5) return "success.main";
    if (ctr < 1) return "error.main";
    return "primary.main";
  };

  const getConversionColor = (rate: number) => {
    if (rate > 10) return "success.main";
    if (rate < 3) return "error.main";
    return "primary.main";
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
        case "impressions":
          comparison = a.impressions - b.impressions;
          break;
        case "clicks":
          comparison = a.clicks - b.clicks;
          break;
        case "newDeposits":
          comparison = a.newDeposits - b.newDeposits;
          break;
        case "ctr":
          comparison = (a.ctr || 0) - (b.ctr || 0);
          break;
        case "conversionRate":
          comparison = (a.conversionRate || 0) - (b.conversionRate || 0);
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
    let maxImpressions = 0;
    let maxClicks = 0;
    let maxDeposits = 0;

    items.forEach((item) => {
      maxImpressions = Math.max(maxImpressions, item.impressions);
      maxClicks = Math.max(maxClicks, item.clicks);
      maxDeposits = Math.max(maxDeposits, item.newDeposits);
    });

    return { maxImpressions, maxClicks, maxDeposits };
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
        <Table aria-label="traffic report table">
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
                align="right"
                onClick={() => handleSort("impressions")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  IMPRESSIONS {renderSortIcon("impressions")}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("clicks")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  CLICKS {renderSortIcon("clicks")}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("ctr")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  CTR {renderSortIcon("ctr")}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("newDeposits")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  NEW DEPOSITS {renderSortIcon("newDeposits")}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("conversionRate")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  CONVERSION RATE {renderSortIcon("conversionRate")}
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
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(
                          item.impressions,
                          maxValues.maxImpressions,
                        )}
                        fontWeight="medium"
                      >
                        {item.impressions.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (item.impressions / maxValues.maxImpressions) * 100
                        }
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(
                              item.impressions,
                              maxValues.maxImpressions,
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
                          item.clicks,
                          maxValues.maxClicks,
                        )}
                        fontWeight="medium"
                      >
                        {item.clicks.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(item.clicks / maxValues.maxClicks) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(
                              item.clicks,
                              maxValues.maxClicks,
                            ),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Click-Through Rate">
                      <Typography
                        fontWeight="medium"
                        color={getCTRColor(item.ctr || 0)}
                      >
                        {(item.ctr || 0).toFixed(2)}%
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(
                          item.newDeposits,
                          maxValues.maxDeposits,
                        )}
                        fontWeight="medium"
                      >
                        {item.newDeposits.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(item.newDeposits / maxValues.maxDeposits) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(
                              item.newDeposits,
                              maxValues.maxDeposits,
                            ),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Conversion Rate (Deposits/Clicks)">
                      <Typography
                        fontWeight="medium"
                        color={getConversionColor(item.conversionRate || 0)}
                      >
                        {(item.conversionRate || 0).toFixed(2)}%
                      </Typography>
                    </Tooltip>
                  </TableCell>
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
