import React, { useState } from "react";
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
  Slider,
  Tooltip,
  Autocomplete,
  Collapse,
} from "@mui/material";
import {
  FilterAlt,
  RestartAlt,
  Search,
  Info,
  DateRange,
} from "@mui/icons-material";

interface FilterBarProps {
  brands: string[];
  trackerIds: string[];
  usernames: string[];
  affiliateNames: string[];
  filters: RevenueShareFilterOptions;
  onFilterChange: (filters: RevenueShareFilterOptions) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  brands,
  trackerIds,
  usernames,
  affiliateNames,
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sharePercentageRange, setSharePercentageRange] = useState<
    [number, number]
  >([10, 40]);

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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      startDate: e.target.value,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      endDate: e.target.value,
    });
  };

  const handleSharePercentageRangeChange = (
    event: Event,
    newValue: number | number[],
  ) => {
    setSharePercentageRange(newValue as [number, number]);
  };

  const handleSharePercentageRangeChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    const [min, max] = newValue as [number, number];
    onFilterChange({
      ...filters,
      minSharePercentage: min,
      maxSharePercentage: max === 40 ? undefined : max,
    });
  };

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
                Filter Revenue Share
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters
                ? "Hide Advanced Filters"
                : "Show Advanced Filters"}
            </Button>
          </Box>
        </Grid>

        {/* Basic filters */}
        <Grid item xs={12} md={4} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="brand-select-label">Brand</InputLabel>
            <Select
              labelId="brand-select-label"
              id="brand-select"
              value={filters.brand}
              label="Brand"
              onChange={handleBrandChange}
            >
              <MenuItem value="">
                <em>All Brands</em>
              </MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="tracker-select-label">Tracker ID</InputLabel>
            <Select
              labelId="tracker-select-label"
              id="tracker-select"
              value={filters.trackerId}
              label="Tracker ID"
              onChange={handleTrackerIdChange}
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
            onChange={handleUsernameChange}
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
            fullWidth
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
          />
        </Grid>

        {/* Date range filters */}
        <Grid item xs={12} md={8} lg={6}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Start Date"
              type="date"
              value={filters.startDate || ""}
              onChange={handleStartDateChange}
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
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Grid>

        {/* Reset button */}
        <Grid
          item
          xs={12}
          md={4}
          lg={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={onResetFilters}
          >
            Reset Filters
          </Button>
        </Grid>

        {/* Advanced filters */}
        <Grid item xs={12}>
          <Collapse in={showAdvancedFilters}>
            <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      Share Percentage Range
                    </Typography>
                    <Tooltip title="Filter by revenue share percentage">
                      <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                    </Tooltip>
                  </Box>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={sharePercentageRange}
                      onChange={handleSharePercentageRangeChange}
                      onChangeCommitted={
                        handleSharePercentageRangeChangeCommitted
                      }
                      valueLabelDisplay="auto"
                      min={10}
                      max={40}
                      step={1}
                      valueLabelFormat={(value) => `${value}%`}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {sharePercentageRange[0]}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sharePercentageRange[1]}%
                        {sharePercentageRange[1] === 40 ? "+" : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </Grid>
      </Grid>
    </Paper>
  );
}
