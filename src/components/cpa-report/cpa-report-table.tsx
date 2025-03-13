import { useState } from "react";
import { CPAReportItem } from "./types";
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
import { TrendingUp } from "@mui/icons-material";

interface CPAReportTableProps {
  items: CPAReportItem[];
}

export function CPAReportTable({ items }: CPAReportTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("cpaCount");
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

  // Get color based on performance
  const getPerformanceColor = (value: number) => {
    if (value > 300) return "success.main";
    if (value < 50) return "error.main";
    return "text.primary";
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
      case "username":
        comparison = a.username.localeCompare(b.username);
        break;
      case "cpaCount":
        comparison = a.cpaCount - b.cpaCount;
        break;
      case "lastUpdated":
        comparison =
          new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
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
  const maxCpaCount = Math.max(...items.map((item) => item.cpaCount), 1);

  return (
    <>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table aria-label="cpa report table">
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
                  CPA Count
                  {sortField === "cpaCount" && (
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
              <TableCell align="right">Estimated Value</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell
                onClick={() => handleSort("lastUpdated")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Last Updated
                  {sortField === "lastUpdated" && (
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
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No CPA report items found.
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
                  <TableCell>
                    <Typography fontWeight="medium">{item.username}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(item.cpaCount)}
                        fontWeight="medium"
                      >
                        {formatNumber(item.cpaCount)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(item.cpaCount / maxCpaCount) * 100}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          mt: 0.5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getPerformanceColor(item.cpaCount),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: item.currency,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(item.cpaCount * 100)}
                    </Typography>
                  </TableCell>
                  <TableCell>{item.currency}</TableCell>
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

export default CPAReportTable;
