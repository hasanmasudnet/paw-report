import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { MuiProvider } from "@/components/ui/mui-provider";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MuiProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </MuiProvider>
  </React.StrictMode>,
);
