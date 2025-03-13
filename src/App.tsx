import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import GrossReport from "./components/gross-report";
import TrafficReport from "./components/traffic-report";
import CPAReport from "./components/cpa-report";
import RevenueShare from "./components/revenue-share";
import { SubAffiliateReport } from "./components/affiliate";
import NavBar from "./components/navigation/nav-bar";
import routes from "tempo-routes";
import { Box } from "@mui/material";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <NavBar />
        <Box sx={{ mt: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/sub-affiliate-report"
              element={<SubAffiliateReport />}
            />

            <Route path="/traffic-report" element={<TrafficReport />} />
            <Route path="/cpa-report" element={<CPAReport />} />
            <Route path="/revenue-share" element={<RevenueShare />} />
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </Box>
      </>
    </Suspense>
  );
}

export default App;
