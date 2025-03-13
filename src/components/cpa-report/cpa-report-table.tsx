import React, { useState, useMemo } from "react";
import { CPAReportItem } from "./types";
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
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

interface CPAReportTableProps {
  items: CPAReportItem[];
}

type SortField =
  | "brand"
  | "trackerId"
  | "username"
  | "cpaCount"
  | "currency"
  | "lastUpdated";

type SortDirection = "asc" | "desc";

export function CPAReportTable({ items }: CPAReportTableProps) {
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
        case "cpaCount":
          comparison = a.cpaCount - b.cpaCount;
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
  const maxCPACount = useMemo(() => {
    return Math.max(...items.map((item) => item.cpaCount), 1);
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
        <Table aria-label="CPA report table">
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
                align="right"
                onClick={() => handleSort("cpaCount")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  CPA COUNT {renderSortIcon("cpaCount")}
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
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
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
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(item.cpaCount, maxCPACount)}
                        fontWeight="medium"
                      >
                        {item.cpaCount.toLocaleString()}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(item.cpaCount / maxCPACount) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(
                              item.cpaCount,
                              maxCPACount,
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
