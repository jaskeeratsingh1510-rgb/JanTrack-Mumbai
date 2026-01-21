import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CandidateProfile from "@/pages/candidate-profile";
import Dashboard from "@/pages/dashboard";
import ReportIssue from "@/pages/report-issue";
import WardMap from "@/pages/ward-map";
import AuthPage from "@/pages/auth";
import CandidatesPage from "@/pages/candidates";
import ComparePage from "@/pages/compare";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/candidates" component={CandidatesPage} />
      <Route path="/compare" component={ComparePage} />
      <Route path="/candidate/:id" component={CandidateProfile} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ward-map" component={WardMap} />
      <Route path="/report-issue" component={ReportIssue} />
      <Route path="/login" component={AuthPage} />
      <Route path="/signup" component={AuthPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
