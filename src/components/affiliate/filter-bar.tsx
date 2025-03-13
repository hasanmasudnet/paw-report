import React from "react";
import { FilterOptions } from "./types";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
  SelectChangeEvent,
  Grid,
  TextField,
  InputAdornment,
  Slider,
  Chip,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import { FilterAlt, RestartAlt, Search, Info } from "@mui/icons-material";

interface FilterBarProps {
  brands: string[];
  dealTypes: string[];
  affiliateCompanies: string[];
  years?: string[];
  months?: { value: string; label: string }[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  brands,
  dealTypes,
  affiliateCompanies,
  years = [],
  months = [],
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  const handleAffiliateUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onFilterChange({
      ...filters,
      affiliateUsername: event.target.value,
    });
  };

  const handleSubAffiliateUsernameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onFilterChange({
      ...filters,
      subAffiliateUsername: event.target.value,
    });
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

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
      <Grid container spacing={2}>
        {/* Header and title */}
        <Grid item xs={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Box display="flex" alignItems="center">
              <FilterAlt color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Filter Affiliates
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* All search boxes in one row */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
            <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={filters.year || ""}
                label="Year"
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    year: e.target.value as string,
                  })
                }
              >
                <MenuItem value="">
                  <em>All Years</em>
                </MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ flex: 1, minWidth: 150 }}>
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={filters.month || ""}
                label="Month"
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    month: e.target.value as string,
                  })
                }
              >
                <MenuItem value="">
                  <em>All Months</em>
                </MenuItem>
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              id="brand-select"
              options={brands}
              value={filters.brand || null}
              onChange={(event, newValue) => {
                onFilterChange({
                  ...filters,
                  brand: newValue || "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Brand"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              sx={{ flex: 1, minWidth: 180 }}
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
            />

            <FormControl size="small" sx={{ flex: 1, minWidth: 180 }}>
              <InputLabel id="deal-type-select-label">Deal Type</InputLabel>
              <Select
                labelId="deal-type-select-label"
                id="deal-type-select"
                value={filters.dealType}
                label="Deal Type"
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    dealType: e.target.value,
                  })
                }
                renderValue={(selected) => (
                  <Chip
                    label={selected}
                    size="small"
                    sx={{
                      bgcolor: selected
                        ? getDealTypeChipColor(selected).bg
                        : undefined,
                      color: selected
                        ? getDealTypeChipColor(selected).color
                        : undefined,
                      fontWeight: "medium",
                    }}
                  />
                )}
              >
                <MenuItem value="">
                  <em>All Deal Types</em>
                </MenuItem>
                {dealTypes.map((dealType) => (
                  <MenuItem key={dealType} value={dealType}>
                    <Chip
                      label={dealType}
                      size="small"
                      sx={{
                        bgcolor: getDealTypeChipColor(dealType).bg,
                        color: getDealTypeChipColor(dealType).color,
                        fontWeight: "medium",
                      }}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Affiliate Username"
              value={filters.affiliateUsername || ""}
              onChange={handleAffiliateUsernameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search affiliates..."
              sx={{ flex: 1, minWidth: 180 }}
            />

            <TextField
              size="small"
              label="Sub-Affiliate Username"
              value={filters.subAffiliateUsername || ""}
              onChange={handleSubAffiliateUsernameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search sub-affiliates..."
              sx={{ flex: 1, minWidth: 180 }}
            />
          </Box>
        </Grid>

        {/* Reset button */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
        >
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={onResetFilters}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
