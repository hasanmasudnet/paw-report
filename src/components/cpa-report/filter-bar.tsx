import React from "react";
import { CPAReportFilterOptions } from "./types";
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
import { FilterAlt, RestartAlt, Search, DateRange } from "@mui/icons-material";

interface FilterBarProps {
  brands: string[];
  trackerIds: string[];
  usernames: string[];
  filters: CPAReportFilterOptions;
  onFilterChange: (filters: CPAReportFilterOptions) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  brands,
  trackerIds,
  usernames,
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
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
                Filter CPA Report
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* All search boxes in one row */}
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
            <TextField
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
              sx={{ flex: 1, minWidth: 180 }}
            />
            <TextField
              size="small"
              label="Start Date"
              type="date"
              value={filters.startDate || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  startDate: e.target.value,
                })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange fontSize="small" />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: 1, minWidth: 180 }}
            />
            <TextField
              size="small"
              label="End Date"
              type="date"
              value={filters.endDate || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  endDate: e.target.value,
                })
              }
              InputLabelProps={{ shrink: true }}
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
