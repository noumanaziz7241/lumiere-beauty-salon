import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SalonConfigProvider, useSalonConfig } from './context/SalonConfigContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import HomePage from './pages/HomePage';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useSalonConfig();
  return isAdmin ? <>{children}</> : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <SalonConfigProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AccessibilityProvider>
    </SalonConfigProvider>
  );
}
