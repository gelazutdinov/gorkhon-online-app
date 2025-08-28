
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminSimple from "./pages/AdminSimple";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./components/legal/PrivacyPolicy";
import TermsOfService from "./components/legal/TermsOfService";
import DataProtection from "./components/legal/DataProtection";
import AuthPage from "./components/auth/AuthPage";
import TestAuth from "./components/TestAuth";
import UserDashboard from "./components/UserDashboard";
import AuthTestSuite from "./components/AuthTestSuite";
import SaveTestForm from "./components/SaveTestForm";

// Оптимизированная конфигурация QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminSimple />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/data-protection" element={<DataProtection />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/test-auth" element={<TestAuth />} />
          <Route path="/auth-test" element={<AuthTestSuite />} />
          <Route path="/save-test" element={<SaveTestForm />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;