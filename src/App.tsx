
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
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./components/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/legal/TermsOfService"));
const DataProtection = lazy(() => import("./components/legal/DataProtection"));
const AuthPage = lazy(() => import("./components/auth/AuthPage"));
const TestAuth = lazy(() => import("./components/TestAuth"));
const UserDashboard = lazy(() => import("./components/UserDashboard"));
const AuthTestSuite = lazy(() => import("./components/AuthTestSuite"));
const SaveTestForm = lazy(() => import("./components/SaveTestForm"));
const ProfileTestButton = lazy(() => import("./components/ProfileTestButton"));

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
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
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
            <Route path="/profile-test" element={<ProfileTestButton />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;