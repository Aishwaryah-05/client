import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Layout
import { ClientLayout } from './components/layout/ClientLayout';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { ProductCataloguePage } from './pages/products/ProductCataloguePage';
import { ProductDetailPage } from './pages/products/ProductDetailPage';
import { CreateOrderPage } from './pages/orders/CreateOrderPage';
import { MyOrdersPage } from './pages/orders/MyOrdersPage';
import { OrderDetailPage } from './pages/orders/OrderDetailPage';
import { ProductionTrackingPage } from './pages/orders/ProductionTrackingPage';
import { QuotationsPage } from './pages/quotations/QuotationsPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/client/login" element={<LoginPage />} />
            <Route path="/client/register" element={<RegisterPage />} />

            {/* Protected Client Portal Routes */}
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="/client/dashboard" replace />} />
              <Route path="dashboard" element={<OverviewPage />} />
              <Route path="products" element={<ProductCataloguePage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="orders/new" element={<CreateOrderPage />} />
              <Route path="orders" element={<MyOrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="orders/:id/tracking" element={<ProductionTrackingPage />} />
              <Route path="quotations" element={<QuotationsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Global Redirects */}
            <Route path="/" element={<Navigate to="/client/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;

