import { useState } from "react";
import { GrossReportItem } from "./types";
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

interface GrossReportTableProps {
  items: GrossReportItem[];
}

export function GrossReportTable({ items }: GrossReportTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("netRevenue");
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
      case "affiliate":
        comparison = a.affiliate.localeCompare(b.affiliate);
        break;
      case "deduction":
        comparison = a.deduction - b.deduction;
        break;
      case "adminFee":
        comparison = a.adminFee - b.adminFee;
        break;
      case "netRevenue":
        comparison = a.netRevenue - b.netRevenue;
        break;
      case "profit":
        comparison = a.profit - b.profit;
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
    maxNetRevenue: Math.max(...items.map((item) => item.netRevenue), 1),
    maxProfit: Math.max(...items.map((item) => item.profit), 1),
  };

  return (
    <>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table aria-label="gross report table">
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
                onClick={() => handleSort("affiliate")}
                sx={{ cursor: "pointer" }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  Affiliate
                  {sortField === "affiliate" && (
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
                onClick={() => handleSort("deduction")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  Deduction
                  {sortField === "deduction" && (
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
                onClick={() => handleSort("adminFee")}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  Admin Fee
                  {sortField === "adminFee" && (
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
                  Net Revenue
                  {sortField === "netRevenue" && (
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
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No gross report items found.
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
                  <TableCell>{item.affiliate}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.deduction, item.currency)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.adminFee, item.currency)}
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(item.netRevenue)}
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
                            bgcolor: getPerformanceColor(item.netRevenue),
                          },
                        }}
                      />
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
                        color={getPerformanceColor(item.profit)}
                        fontWeight="medium"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {item.profit > item.netRevenue * 0.5 ? (
                          <TrendingUp
                            fontSize="small"
                            sx={{ mr: 0.5, color: "success.main" }}
                          />
                        ) : item.profit < item.netRevenue * 0.3 ? (
                          <TrendingDown
                            fontSize="small"
                            sx={{ mr: 0.5, color: "error.main" }}
                          />
                        ) : null}
                        {formatCurrency(item.profit, item.currency)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(item.profit / maxValues.maxProfit) * 100}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        mt: 0.5,
                        bgcolor: "rgba(0,0,0,0.05)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: getPerformanceColor(item.profit),
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>{item.currency}</TableCell>
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

export default GrossReportTable;
