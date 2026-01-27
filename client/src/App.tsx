import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CandidateProfile from "@/pages/candidate-profile";
import Dashboard from "@/pages/dashboard";
import ReportIssue from "@/pages/report-issue";
import AuthPage from "@/pages/auth";
import CandidatesPage from "@/pages/candidates";
import ComparePage from "@/pages/compare";
import AdminPage from "@/pages/admin";
import WardMap from "@/pages/ward-map";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function Router() {
  const [location] = useLocation();

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen">
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/candidates" component={CandidatesPage} />
          <Route path="/compare" component={ComparePage} />
          <Route path="/candidate/:id" component={CandidateProfile} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/report-issue" component={ReportIssue} />
          <Route path="/admin/login" component={AuthPage} />
          <Route path="/admin/signup" component={AuthPage} />
          <Route path="/login" component={AuthPage} />
          <Route path="/signup" component={AuthPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/ward-map" component={WardMap} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Toaster />
            <Router />
          </ThemeProvider>
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
