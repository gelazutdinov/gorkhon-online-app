
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Обычный импорт для главной страницы (часто используется)
import Index from "./pages/Index";
// Lazy загрузка остальных компонентов для code splitting
const AdminSimple = lazy(() => import("./pages/AdminSimple"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./components/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/legal/TermsOfService"));
const DataProtection = lazy(() => import("./components/legal/DataProtection"));
const SaveTestForm = lazy(() => import("./components/SaveTestForm"));

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
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-amber-100">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-autumn-burgundy"></div>
              <div className="absolute -top-8 -right-8 text-3xl animate-sway">🍂</div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AdminSimple />} />
            <Route path="/admin-gorkhon" element={<Admin />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/data-protection" element={<DataProtection />} />
            <Route path="/save-test" element={<SaveTestForm />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;