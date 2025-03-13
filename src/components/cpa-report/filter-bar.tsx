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
    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
      <Grid container spacing={3}>
        {/* Header and title */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" mb={2}>
            <FilterAlt color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              Filter CPA Report
            </Typography>
          </Box>
        </Grid>

        {/* Basic filters */}
        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={4}>
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

        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
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
            />
            <TextField
              fullWidth
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
            />
          </Box>
        </Grid>

        {/* Reset button */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: "flex", alignItems: "center" }}
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
