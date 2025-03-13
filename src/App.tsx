import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import GrossReport from "./components/gross-report";
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
            <Route path="/gross-report" element={<GrossReport />} />
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
