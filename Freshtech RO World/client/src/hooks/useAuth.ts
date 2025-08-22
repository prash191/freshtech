import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  clearError 
} from '@/store/slices/authSlice';
import { LoginCredentials, RegisterCredentials } from '@/types';
import { routes } from '@/constants/config';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  // Check if user is authenticated on mount
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('useAuth: Starting login process');
      const result = await dispatch(loginUser(credentials)).unwrap();
      console.log('useAuth: Login successful, result:', result);
      navigate(routes.home);
      return { success: true };
    } catch (error) {
      console.error('useAuth: Login failed, error:', error);
      return { success: false, error: error as string };
    }
  };

  const register = async (userData: RegisterCredentials) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      navigate(routes.home);
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate(routes.login);
      return { success: true };
    } catch (error) {
      // Even if logout fails, redirect to login
      navigate(routes.login);
      return { success: false, error: error as string };
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuthError,
    isAdmin,
  };
};
