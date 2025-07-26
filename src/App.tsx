import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PortfolioProvider } from "./context/PortfolioContext";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Layout } from "./components/layout";
import Dashboard from "./pages/Dashboard";
import Portfel from "./pages/Portfel";
import Exchange from "./pages/Exchange";
import Rates from "./pages/Rates";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PriceAlerts from "./pages/PriceAlerts";
import NotificationSettings from "./pages/NotificationSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="loombard-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PortfolioProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="portfel" element={<Portfel />} />
                <Route path="exchange" element={<Exchange />} />
                <Route path="rates" element={<Rates />} />
                <Route path="history" element={<History />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/price-alerts" element={<PriceAlerts />} />
                <Route path="settings/notifications" element={<NotificationSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </PortfolioProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;