import { useState } from "react";
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
  SelectChangeEvent,
  TextField,
  InputAdornment,
  Collapse,
} from "@mui/material";
import {
  FilterAlt,
  RestartAlt,
  Search,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

interface FilterBarProps {
  years: string[];
  months: { value: string; label: string }[];
  brands: string[];
  trackerIds: string[];
  usernames: string[];
  affiliateIds: string[];
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
  affiliateIds,
  affiliateNames,
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleYearChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      year: event.target.value,
    });
  };

  const handleMonthChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      month: event.target.value,
    });
  };

  const handleBrandChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      brand: event.target.value,
    });
  };

  const handleTrackerIdChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      trackerId: event.target.value,
    });
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      username: event.target.value,
    });
  };

  const handleAffiliateIdChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      affiliateId: event.target.value,
    });
  };

  const handleAffiliateChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      affiliate: event.target.value,
    });
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
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
                Filter Gross Report
              </Typography>
            </Box>
            <Button
              variant="text"
              size="small"
              onClick={toggleAdvancedFilters}
              endIcon={showAdvancedFilters ? <ExpandLess /> : <ExpandMore />}
            >
              {showAdvancedFilters
                ? "Hide Advanced Filters"
                : "Show Advanced Filters"}
            </Button>
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
              onChange={handleYearChange}
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
              onChange={handleMonthChange}
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

        <Grid item xs={12} md={4} lg={2}>
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

        <Grid item xs={12} md={8} lg={4}>
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

        {/* Advanced filters */}
        <Grid item xs={12}>
          <Collapse in={showAdvancedFilters}>
            <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="affiliate-select-label">
                      Affiliate ID
                    </InputLabel>
                    <Select
                      labelId="affiliate-select-label"
                      id="affiliate-select"
                      value={filters.affiliateId}
                      label="Affiliate ID"
                      onChange={handleAffiliateIdChange}
                    >
                      <MenuItem value="">
                        <em>All Affiliate IDs</em>
                      </MenuItem>
                      {affiliateIds.map((affiliateId) => (
                        <MenuItem key={affiliateId} value={affiliateId}>
                          {affiliateId}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="affiliate-name-select-label">
                      Affiliate
                    </InputLabel>
                    <Select
                      labelId="affiliate-name-select-label"
                      id="affiliate-name-select"
                      value={filters.affiliate}
                      label="Affiliate"
                      onChange={handleAffiliateChange}
                    >
                      <MenuItem value="">
                        <em>All Affiliates</em>
                      </MenuItem>
                      {affiliateNames.map((affiliateName) => (
                        <MenuItem key={affiliateName} value={affiliateName}>
                          {affiliateName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
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
