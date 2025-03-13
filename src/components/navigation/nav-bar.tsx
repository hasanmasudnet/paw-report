import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Tabs,
  Tab,
} from "@mui/material";
import {
  BarChart,
  PieChart,
  Groups,
  Traffic,
  Assessment,
  Percent,
} from "@mui/icons-material";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 4, display: { xs: "none", md: "flex" } }}
          >
            Affiliate Analytics
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="navigation tabs"
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label="Gross Report"
                value="/"
                icon={<PieChart />}
                iconPosition="start"
              />
              <Tab
                label="Sub-Affiliate Report"
                value="/sub-affiliate-report"
                icon={<Groups />}
                iconPosition="start"
              />

              <Tab
                label="Traffic Report"
                value="/traffic-report"
                icon={<Traffic />}
                iconPosition="start"
              />
              <Tab
                label="CPA Report"
                value="/cpa-report"
                icon={<Assessment />}
                iconPosition="start"
              />
              <Tab
                label="Revenue Share"
                value="/revenue-share"
                icon={<Percent />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
            <Button onClick={() => navigate("/")} color="inherit">
              Reports
            </Button>
            <Button
              onClick={() => navigate("/sub-affiliate-report")}
              color="inherit"
            >
              Sub-Affiliates
            </Button>
            <Button onClick={() => navigate("/traffic-report")} color="inherit">
              Traffic
            </Button>
            <Button onClick={() => navigate("/cpa-report")} color="inherit">
              CPA
            </Button>
            <Button onClick={() => navigate("/revenue-share")} color="inherit">
              Revenue Share
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
