import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyTrips from "./pages/MyTrips";
import AllTrips from "./pages/AllTrips";
import Notifications from "./pages/Notifications";
import BottomNav from "./components/BottomNav";
import { useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { driver, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!driver) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      {children}
      <BottomNav />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-trips"
              element={
                <ProtectedRoute>
                  <AllTrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;