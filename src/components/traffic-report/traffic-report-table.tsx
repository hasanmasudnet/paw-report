import { useState } from "react";
import { TrafficReportItem } from "./types";
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
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface TrafficReportTableProps {
  items: TrafficReportItem[];
}

export function TrafficReportTable({ items }: TrafficReportTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("impressions");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  // Format large numbers
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  // Format percentage
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return "0.00%";
    return value.toFixed(2) + "%";
  };

  // Get color based on performance
  const getPerformanceColor = (value: number, type: string) => {
    if (type === "ctr") {
      if (value > 5) return "success.main";
      if (value < 1) return "error.main";
      return "text.primary";
    } else if (type === "conversionRate") {
      if (value > 10) return "success.main";
      if (value < 3) return "error.main";
      return "text.primary";
    } else {
      return "text.primary";
    }
  };

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
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
      case "ctr":
        comparison = (a.ctr || 0) - (b.ctr || 0);
        break;
      case "newDeposits":
        comparison = a.newDeposits - b.newDeposits;
        break;
      case "conversionRate":
        comparison = (a.conversionRate || 0) - (b.conversionRate || 0);
        break;
      default:
        comparison = 0;
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  // Paginate items
  const paginatedItems = sortedItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Find max values for visual indicators
  const maxValues = {
    maxImpressions: Math.max(...items.map((item) => item.impressions), 1),
    maxClicks: Math.max(...items.map((item) => item.clicks), 1),
    maxNewDeposits: Math.max(...items.map((item) => item.newDeposits), 1),
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
                onClick={() => handleSort("trackerId")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Tracker ID
                  {sortField === "trackerId" && (
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
                  Impressions
                  {sortField === "impressions" && (
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
                  Clicks
                  {sortField === "clicks" && (
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
                  CTR
                  {sortField === "ctr" && (
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
                  New Deposits
                  {sortField === "newDeposits" && (
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
                  Conversion Rate
                  {sortField === "conversionRate" && (
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
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No traffic report items found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.brand}</TableCell>
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
                      <Typography fontWeight="medium">
                        {formatNumber(item.impressions)}
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
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography fontWeight="medium">
                        {formatNumber(item.clicks)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(item.clicks / maxValues.maxClicks) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontWeight="medium"
                      color={getPerformanceColor(item.ctr || 0, "ctr")}
                    >
                      {formatPercentage(item.ctr)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography fontWeight="medium">
                        {formatNumber(item.newDeposits)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (item.newDeposits / maxValues.maxNewDeposits) * 100
                        }
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontWeight="medium"
                      color={getPerformanceColor(
                        item.conversionRate || 0,
                        "conversionRate",
                      )}
                    >
                      {formatPercentage(item.conversionRate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(item.lastUpdated).toLocaleDateString()}
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

export default TrafficReportTable;
