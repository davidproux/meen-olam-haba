import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { HomePage } from './pages/public/HomePage';
import { YishuvPage } from './pages/public/YishuvPage';
import { UnitPage } from './pages/public/UnitPage';
import { LoginPage } from './pages/public/LoginPage';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminUnits } from './pages/admin/AdminUnits';
import { AdminBilling } from './pages/admin/AdminBilling';
import { AdminYishuvim } from './pages/admin/AdminYishuvim';
import { AdminAffiliates } from './pages/admin/AdminAffiliates';
import { AffiliateTracker } from './components/AffiliateTracker';
import { initDb } from './services/mockDb';

function App() {
  
  useEffect(() => {
    initDb();
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        {/* Affiliate Tracker runs invisible in background on all routes */}
        <AffiliateTracker />
        
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/:slug" element={<YishuvPage />} />
            <Route path="/unit/:id" element={<UnitPage />} />

            {/* Protected Admin Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/units" element={
              <ProtectedRoute>
                <AdminUnits />
              </ProtectedRoute>
            } />
            <Route path="/admin/yishuvim" element={
              <ProtectedRoute>
                <AdminYishuvim />
              </ProtectedRoute>
            } />
            <Route path="/admin/billing" element={
              <ProtectedRoute>
                <AdminBilling />
              </ProtectedRoute>
            } />
            <Route path="/admin/affiliates" element={
              <ProtectedRoute>
                <AdminAffiliates />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;