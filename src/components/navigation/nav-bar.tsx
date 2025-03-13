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
import { BarChart, PieChart } from "@mui/icons-material";

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
            >
              <Tab
                label="Affiliate Dashboard"
                value="/"
                icon={<BarChart />}
                iconPosition="start"
              />
              <Tab
                label="Gross Report"
                value="/gross-report"
                icon={<PieChart />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
            <Button onClick={() => navigate("/")} color="inherit">
              Affiliates
            </Button>
            <Button onClick={() => navigate("/gross-report")} color="inherit">
              Reports
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
