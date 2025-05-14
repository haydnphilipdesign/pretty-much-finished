import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import WorkWithMe from './pages/WorkWithMe';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NavigationTest from './pages/NavigationTest';
import ScrollRestoration from './components/ScrollRestoration';
import AppProviders from './providers/AppProviders';
import { PortalTransactionForm } from './components/TransactionForm/PortalTransactionForm';
import ScrollIndicatorWrapper from './components/ScrollIndicatorWrapper';

const App: React.FC = () => {
  const location = useLocation();
  const hideFooterPaths = ['/agent-portal'];
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <AppProviders>
      <ScrollRestoration />
      <Header />
      <main className="flex-grow pt-20">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work-with-me" element={<WorkWithMe />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/navigation-test" element={<NavigationTest />} />

          {/* Protected Routes */}
          <Route
            path="/agent-portal/transaction"
            element={
              <ProtectedRoute>
                <PortalTransactionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent-portal"
            element={<Login />}
          />
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </AppProviders>
  );
};

export default App;
