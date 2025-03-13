import React from "react";
import { RevenueShareFilterOptions } from "./types";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { FilterAlt, RestartAlt, Search } from "@mui/icons-material";

interface FilterBarProps {
  brands: string[];
  trackerIds: string[];
  usernames: string[];
  affiliateNames: string[];
  filters: RevenueShareFilterOptions;
  onFilterChange: (filters: RevenueShareFilterOptions) => void;
  onResetFilters: () => void;
  years?: string[];
  months?: { value: string; label: string }[];
}

export function FilterBar({
  brands,
  trackerIds,
  usernames,
  affiliateNames,
  filters,
  onFilterChange,
  onResetFilters,
  years = [],
  months = [],
}: FilterBarProps) {
  const handleBrandChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    onFilterChange({
      ...filters,
      brand: e.target.value as string,
    });
  };

  const handleTrackerIdChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    onFilterChange({
      ...filters,
      trackerId: e.target.value as string,
    });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      username: e.target.value,
    });
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
                Filter Revenue Share
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

            <Autocomplete
              id="tracker-select"
              options={trackerIds}
              value={filters.trackerId || null}
              onChange={(event, newValue) => {
                onFilterChange({
                  ...filters,
                  trackerId: newValue || "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tracker ID"
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

            <TextField
              size="small"
              label="Username"
              value={filters.username || ""}
              onChange={handleUsernameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by username..."
              sx={{ flex: 1, minWidth: 180 }}
            />

            <Autocomplete
              id="affiliate-select"
              options={affiliateNames}
              value={filters.affiliate || null}
              onChange={(event, newValue) => {
                onFilterChange({
                  ...filters,
                  affiliate: newValue || "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Affiliate"
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
