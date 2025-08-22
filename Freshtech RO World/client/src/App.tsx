import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAppSelector } from '@/store';

// Pages
import Overview from '@/pages/Overview';
import ProductDetails from '@/pages/ProductDetails';
import Account from '@/pages/Account';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminProducts from '@/pages/AdminProducts';
import AddEditProduct from '@/pages/AddEditProduct';
import AuthForm from '@/pages/AuthForm';
import Cart from '@/pages/Cart';
import Favorites from '@/pages/Favorites';

// Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminLayout from '@/components/layout/AdminLayout';
import Alert from '@/components/common/Alert';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorFallback from '@/components/common/ErrorFallback';
import CartDrawer from '@/components/common/CartDrawer';

// Constants
import { routes } from '@/constants/config';

// Create theme
const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
      },
      secondary: {
        main: '#6b7280',
        light: '#9ca3af',
        dark: '#4b5563',
      },
      background: {
        default: mode === 'light' ? '#f9fafb' : '#111827',
        paper: mode === 'light' ? '#ffffff' : '#1f2937',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.125rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

const App: React.FC = () => {
  const uiState = useAppSelector((state) => state.ui);
  const authState = useAppSelector((state) => state.auth);
  const { theme, loading } = uiState;
  const { isAuthenticated, user } = authState;

  // Check authentication status on app load
  useEffect(() => {
    if (isAuthenticated && !user) {
      // This will be handled by the useAuth hook
    }
  }, [isAuthenticated, user]);

  const appTheme = createAppTheme(theme);

  if (loading.global) {
    return <LoadingSpinner fullScreen message="Initializing application..." />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <Router>
          <div className="app">
            <Alert />
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path={routes.home} element={<Overview />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path={routes.login} element={<AuthForm mode="login" />} />
                <Route path={routes.register} element={<AuthForm mode="register" />} />
                
                {/* Protected Routes */}
                <Route 
                  path={routes.account} 
                  element={
                    isAuthenticated ? <Account /> : <AuthForm mode="login" />
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path={routes.admin.dashboard} 
                  element={
                    isAuthenticated && user?.role === 'admin' ? (
                      <AdminLayout />
                    ) : (
                      <AuthForm mode="login" />
                    )
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/add" element={<AddEditProduct mode="add" />} />
                  <Route path="products/edit/:id" element={<AddEditProduct mode="edit" />} />
                  <Route path="users" element={<div>Manage Users (Coming Soon)</div>} />
                  <Route path="reviews" element={<div>Manage Reviews (Coming Soon)</div>} />
                  <Route path="bookings" element={<div>Manage Bookings (Coming Soon)</div>} />
                </Route>
                
                {/* 404 Route */}
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </main>
            <Footer />
            <CartDrawer />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
