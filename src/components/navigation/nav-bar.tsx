import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function NavBar() {
  return (
    <AppBar position="static" color="primary" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: "white", textDecoration: "none" }}
          >
            Affiliate Dashboard
          </Typography>
          <Box>
            <Button color="inherit" component={RouterLink} to="/">
              Gross Report
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/sub-affiliate-report"
            >
              Sub-Affiliates
            </Button>
            <Button color="inherit" component={RouterLink} to="/traffic-report">
              Traffic Report
            </Button>
            <Button color="inherit" component={RouterLink} to="/cpa-report">
              CPA Report
            </Button>
            <Button color="inherit" component={RouterLink} to="/revenue-share">
              Revenue Share
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
