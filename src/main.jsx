import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster position="bottom-right" richColors />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
