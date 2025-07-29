import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { PortfolioProvider } from "./context/PortfolioContext";
import { WelcomeProvider } from "./context/WelcomeContext";
import { Layout } from "./components/layout";
import { Index } from "./pages/Index";
import { Dashboard } from "./pages/Dashboard";
import { Exchange } from "./pages/Exchange";
import { Rates } from "./pages/Rates";
import { History } from "./pages/History";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Portfel } from "./pages/Portfel";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="kantoor-theme">
      <PortfolioProvider>
        <WelcomeProvider>
          <Router>
            <div className="min-h-screen bg-[#00071c]">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/exchange" element={<Layout><Exchange /></Layout>} />
                <Route path="/rates" element={<Layout><Rates /></Layout>} />
                <Route path="/history" element={<Layout><History /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/portfel" element={<Layout><Portfel /></Layout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </WelcomeProvider>
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;