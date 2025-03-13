import { useState } from "react";
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
  Stack,
  SelectChangeEvent,
  Grid,
  TextField,
  InputAdornment,
  Slider,
  Chip,
  Tooltip,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  FilterAlt,
  RestartAlt,
  Search,
  ExpandMore,
  ExpandLess,
  Info,
} from "@mui/icons-material";

interface FilterBarProps {
  brands: string[];
  categories: string[];
  dealTypes: string[];
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  brands,
  categories,
  dealTypes,
  filters,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [revenueRange, setRevenueRange] = useState<[number, number]>([
    0, 50000,
  ]);
  const [commissionRateRange, setCommissionRateRange] = useState<
    [number, number]
  >([0, 30]);

  const handleBrandChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      brand: event.target.value,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      category: event.target.value,
    });
  };

  const handleDealTypeChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      dealType: event.target.value,
    });
  };

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

  const handleRevenueRangeChange = (
    event: Event,
    newValue: number | number[],
  ) => {
    setRevenueRange(newValue as [number, number]);
  };

  const handleRevenueRangeChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    const [min, max] = newValue as [number, number];
    onFilterChange({
      ...filters,
      minRevenue: min,
      maxRevenue: max === 50000 ? undefined : max,
    });
  };

  const handleCommissionRateRangeChange = (
    event: Event,
    newValue: number | number[],
  ) => {
    setCommissionRateRange(newValue as [number, number]);
  };

  const handleCommissionRateRangeChangeCommitted = (
    event: Event | React.SyntheticEvent,
    newValue: number | number[],
  ) => {
    const [min, max] = newValue as [number, number];
    onFilterChange({
      ...filters,
      minCommissionRate: min,
      maxCommissionRate: max === 30 ? undefined : max,
    });
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
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
                Filter Affiliates
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

        {/* Dropdown filters */}
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
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={filters.category}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="deal-type-select-label">Deal Type</InputLabel>
            <Select
              labelId="deal-type-select-label"
              id="deal-type-select"
              value={filters.dealType}
              label="Deal Type"
              onChange={handleDealTypeChange}
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
        </Grid>

        {/* Search fields */}
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            fullWidth
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
          />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <TextField
            fullWidth
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
          />
        </Grid>

        {/* Reset button */}
        <Grid
          item
          xs={12}
          md={12}
          lg={4}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={onResetFilters}
            sx={{ ml: { xs: 0, lg: "auto" }, mt: { xs: 1, md: 0 } }}
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
                      Revenue Range
                    </Typography>
                    <Tooltip title="Filter affiliates by their gross revenue amount">
                      <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                    </Tooltip>
                  </Box>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={revenueRange}
                      onChange={handleRevenueRangeChange}
                      onChangeCommitted={handleRevenueRangeChangeCommitted}
                      valueLabelDisplay="auto"
                      min={0}
                      max={50000}
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
                        ${revenueRange[0].toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${revenueRange[1].toLocaleString()}
                        {revenueRange[1] === 50000 ? "+" : ""}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      Commission Rate
                    </Typography>
                    <Tooltip title="Filter affiliates by their commission rate percentage">
                      <Info fontSize="small" sx={{ ml: 1, opacity: 0.7 }} />
                    </Tooltip>
                  </Box>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={commissionRateRange}
                      onChange={handleCommissionRateRangeChange}
                      onChangeCommitted={
                        handleCommissionRateRangeChangeCommitted
                      }
                      valueLabelDisplay="auto"
                      min={0}
                      max={30}
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
                        {commissionRateRange[0]}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {commissionRateRange[1]}%
                        {commissionRateRange[1] === 30 ? "+" : ""}
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
