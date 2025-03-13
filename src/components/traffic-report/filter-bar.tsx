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
  filters: TrafficReportFilterOptions;
  onFilterChange: (filters: TrafficReportFilterOptions) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  brands,
  trackerIds,
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [impressionsRange, setImpressionsRange] = React.useState<
    [number, number]
  >([0, 100000]);
  const [clicksRange, setClicksRange] = React.useState<[number, number]>([
    0, 10000,
  ]);
  const [depositsRange, setDepositsRange] = React.useState<[number, number]>([
    0, 1000,
  ]);

  const handleImpressionsRangeChange = (
    event: Event,
    newValue: number | number[],
  ) => {
    setImpressionsRange(newValue as [number, number]);
  };

  const handleImpressionsRangeChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    const [min, max] = newValue as [number, number];
    onFilterChange({
      ...filters,
      minImpressions: min,
      maxImpressions: max === 100000 ? undefined : max,
    });
  };

  const handleClicksRangeChange = (
    event: Event,
    newValue: number | number[],
  ) => {
    setClicksRange(newValue as [number, number]);
  };

  const handleClicksRangeChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    const [min, max] = newValue as [number, number];
    onFilterChange({
      ...filters,
      minClicks: min,
      maxClicks: max === 10000 ? undefined : max,
    });
  };

  const handleDepositsRangeChange = (
    event: Event,
    newValue: number | number[],
  ) => {
    setDepositsRange(newValue as [number, number]);
  };

  const handleDepositsRangeChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    const [min, max] = newValue as [number, number];
    onFilterChange({
      ...filters,
      minDeposits: min,
      maxDeposits: max === 1000 ? undefined : max,
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
                Filter Traffic Report
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

        {/* Advanced filters */}
        <Grid item xs={12}>
          <Collapse in={showAdvancedFilters}>
            <Box
              sx={{ mt: 1, p: 1.5, bgcolor: "action.hover", borderRadius: 2 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      Impressions Range
                    </Typography>
                    <Tooltip title="Filter by number of impressions">
                      <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                    </Tooltip>
                  </Box>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={impressionsRange}
                      onChange={handleImpressionsRangeChange}
                      onChangeCommitted={handleImpressionsRangeChangeCommitted}
                      valueLabelDisplay="auto"
                      min={0}
                      max={100000}
                      step={1000}
                      valueLabelFormat={(value) => `${value.toLocaleString()}`}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {impressionsRange[0].toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {impressionsRange[1].toLocaleString()}
                        {impressionsRange[1] === 100000 ? "+" : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      Clicks Range
                    </Typography>
                    <Tooltip title="Filter by number of clicks">
                      <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                    </Tooltip>
                  </Box>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={clicksRange}
                      onChange={handleClicksRangeChange}
                      onChangeCommitted={handleClicksRangeChangeCommitted}
                      valueLabelDisplay="auto"
                      min={0}
                      max={10000}
                      step={100}
                      valueLabelFormat={(value) => `${value.toLocaleString()}`}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {clicksRange[0].toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {clicksRange[1].toLocaleString()}
                        {clicksRange[1] === 10000 ? "+" : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      New Deposits Range
                    </Typography>
                    <Tooltip title="Filter by number of new deposits">
                      <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                    </Tooltip>
                  </Box>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={depositsRange}
                      onChange={handleDepositsRangeChange}
                      onChangeCommitted={handleDepositsRangeChangeCommitted}
                      valueLabelDisplay="auto"
                      min={0}
                      max={1000}
                      step={10}
                      valueLabelFormat={(value) => `${value.toLocaleString()}`}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {depositsRange[0].toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {depositsRange[1].toLocaleString()}
                        {depositsRange[1] === 1000 ? "+" : ""}
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
