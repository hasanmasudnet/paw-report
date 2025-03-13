import React, { useState } from "react";
import { TrafficReportFilterOptions } from "./types";
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
  Slider,
  Tooltip,
  Autocomplete,
  Collapse,
} from "@mui/material";
import { FilterAlt, RestartAlt, Search, Info } from "@mui/icons-material";

interface FilterBarProps {
  brands: string[];
  trackerIds: string[];
  filters: TrafficReportFilterOptions;
  onFilterChange: (filters: TrafficReportFilterOptions) => void;
  onResetFilters: () => void;
  years?: string[];
  months?: { value: string; label: string }[];
}

export function FilterBar({
  brands,
  trackerIds,
  filters,
  onFilterChange,
  onResetFilters,
  years = [],
  months = [],
}: FilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
                Filter Traffic Report
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Basic filters in one line */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
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

        {/* Advanced filters section removed */}
      </Grid>
    </Paper>
  );
}
