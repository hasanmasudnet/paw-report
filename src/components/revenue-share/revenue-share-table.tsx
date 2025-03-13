import { useState } from "react";
import { RevenueShareItem } from "./types";
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

interface RevenueShareTableProps {
  items: RevenueShareItem[];
}

export function RevenueShareTable({ items }: RevenueShareTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("grossRevenue");
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

  // Format percentage
  const formatPercentage = (value: number) => {
    return value.toFixed(1) + "%";
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
    maxGrossRevenue: Math.max(...items.map((item) => item.grossRevenue), 1),
    maxShareAmount: Math.max(...items.map((item) => item.shareAmount), 1),
    maxNetRevenue: Math.max(...items.map((item) => item.netRevenue), 1),
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
                  Share %
                  {sortField === "sharePercentage" && (
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
                  Share Amount
                  {sortField === "shareAmount" && (
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
              <TableCell>Currency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No revenue share items found.
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
                    <Box>
                      <Typography
                        color={getPerformanceColor(item.grossRevenue)}
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
                            bgcolor: getPerformanceColor(item.grossRevenue),
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontWeight="medium"
                      color={
                        item.sharePercentage > 25
                          ? "error.main"
                          : item.sharePercentage < 10
                            ? "success.main"
                            : "text.primary"
                      }
                    >
                      {formatPercentage(item.sharePercentage)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography fontWeight="medium">
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
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Typography
                        color={getPerformanceColor(item.netRevenue)}
                        fontWeight="medium"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        {item.netRevenue > item.grossRevenue * 0.8 ? (
                          <TrendingUp
                            fontSize="small"
                            sx={{ mr: 0.5, color: "success.main" }}
                          />
                        ) : item.netRevenue < item.grossRevenue * 0.6 ? (
                          <TrendingDown
                            fontSize="small"
                            sx={{ mr: 0.5, color: "error.main" }}
                          />
                        ) : null}
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

export default RevenueShareTable;
