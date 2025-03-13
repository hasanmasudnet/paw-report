import React from "react";
import { GrossReportFilterOptions } from "./types";
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
import { FilterAlt, RestartAlt, Search, Info } from "@mui/icons-material";

interface FilterBarProps {
  years: string[];
  months: { value: string; label: string }[];
  brands: string[];
  trackerIds: string[];
  usernames: string[];
  affiliateNames: string[];
  filters: GrossReportFilterOptions;
  onFilterChange: (filters: GrossReportFilterOptions) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  years,
  months,
  brands,
  trackerIds,
  usernames,
  affiliateNames,
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  return (
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Grid container spacing={3}>
        {/* Header and title */}
        <Grid item xs={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center">
              <FilterAlt color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">
                Filter Gross Report
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Basic filters */}
        <Grid item xs={12} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={filters.year}
              label="Year"
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  year: e.target.value,
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
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={filters.month}
              label="Month"
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  month: e.target.value,
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
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
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
            fullWidth
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
          />
        </Grid>

        <Grid item xs={12} md={4} lg={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="tracker-select-label">Tracker ID</InputLabel>
            <Select
              labelId="tracker-select-label"
              id="tracker-select"
              value={filters.trackerId}
              label="Tracker ID"
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  trackerId: e.target.value,
                })
              }
            >
              <MenuItem value="">
                <em>All Trackers</em>
              </MenuItem>
              {trackerIds.map((trackerId) => (
                <MenuItem key={trackerId} value={trackerId}>
                  {trackerId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <TextField
            fullWidth
            size="small"
            label="Username"
            value={filters.username || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                username: e.target.value,
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            placeholder="Search by username..."
          />
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <Autocomplete
            id="affiliate-name-select"
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
            fullWidth
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
          />
        </Grid>

        {/* Reset button */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
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
