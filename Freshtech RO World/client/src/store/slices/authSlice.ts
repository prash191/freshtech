import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types';
import { authAPI } from '@/services/api';
import { storageKeys } from '@/constants/config';
import { getCookie } from '@/utils';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      console.log('Login API response:', response);
      
      // Handle different response structures
      let user: User;
      if (response.data && (response.data as any).user) {
        user = (response.data as any).user;
      } else if ((response as any).user) {
        user = (response as any).user;
      } else {
        throw new Error('Invalid response structure from server');
      }
      
      // Wait a bit for the cookie to be set, then extract JWT token
      await new Promise(resolve => setTimeout(resolve, 100));
      const token = getCookie('jwt');
      
      console.log('Login successful, token found:', !!token);
      
      // Store user data and token in localStorage
      localStorage.setItem(storageKeys.auth, JSON.stringify({ user, token }));
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      console.log('Register API response:', response);
      
      // Handle different response structures
      let user: User;
      if (response.data && (response.data as any).user) {
        user = (response.data as any).user;
      } else if ((response as any).user) {
        user = (response as any).user;
      } else {
        throw new Error('Invalid response structure from server');
      }
      
      // Wait a bit for the cookie to be set, then extract JWT token
      await new Promise(resolve => setTimeout(resolve, 100));
      const token = getCookie('jwt');
      
      console.log('Registration successful, token found:', !!token);
      
      // Store user data and token in localStorage
      localStorage.setItem(storageKeys.auth, JSON.stringify({ user, token }));
      
      return user;
    } catch (error: any) {
      console.error('Registration error:', error);
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      localStorage.removeItem(storageKeys.auth);
      return null;
    } catch (error: any) {
      // Even if logout fails, clear local storage
      localStorage.removeItem(storageKeys.auth);
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      console.log('GetCurrentUser API response:', response);
      
      // Handle different response structures
      let user: User;
      if (response.data) {
        user = response.data as User;
      } else if ((response as any).user) {
        user = (response as any).user;
      } else {
        throw new Error('Invalid response structure from server');
      }
      
      // Extract JWT token from cookie and update localStorage
      const token = getCookie('jwt');
      if (token) {
        localStorage.setItem(storageKeys.auth, JSON.stringify({ user, token }));
      }
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user profile');
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Check if user is already logged in
const storedAuth = localStorage.getItem(storageKeys.auth);
if (storedAuth) {
  try {
    const authData = JSON.parse(storedAuth);
    if (authData.user) {
      initialState.user = authData.user;
      initialState.isAuthenticated = true;
    }
  } catch (error) {
    // If parsing fails, clear the invalid data
    localStorage.removeItem(storageKeys.auth);
  }
}

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as User;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as User;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as User;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        // Clear invalid auth data
        localStorage.removeItem(storageKeys.auth);
      });
  },
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
