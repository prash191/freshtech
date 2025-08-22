import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UI State interface
interface UIState {
  // Theme
  theme: 'light' | 'dark';
  
  // Sidebar
  sidebarOpen: boolean;
  
  // Modals
  modals: {
    auth: boolean;
    product: boolean;
    confirm: boolean;
  };
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
  
  // Loading states
  loading: {
    global: boolean;
    auth: boolean;
    products: boolean;
  };
  
  // Search
  searchQuery: string;
  
  // Mobile menu
  mobileMenuOpen: boolean;
}

// Initial state
const initialState: UIState = {
  theme: (localStorage.getItem('freshtech_theme') as 'light' | 'dark') || 'light',
  sidebarOpen: false,
  modals: {
    auth: false,
    product: false,
    confirm: false,
  },
  notifications: [],
  loading: {
    global: false,
    auth: false,
    products: false,
  },
  searchQuery: '',
  mobileMenuOpen: false,
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('freshtech_theme', action.payload);
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      localStorage.setItem('freshtech_theme', newTheme);
    },

    // Sidebar actions
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Modal actions
    setModalOpen: (state, action: PayloadAction<{ modal: keyof UIState['modals']; open: boolean }>) => {
      const { modal, open } = action.payload;
      state.modals[modal] = open;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },

    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        ...action.payload,
        id,
        duration: action.payload.duration || 5000,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Loading actions
    setLoading: (state, action: PayloadAction<{ key: keyof UIState['loading']; loading: boolean }>) => {
      const { key, loading } = action.payload;
      state.loading[key] = loading;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },

    // Search actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
    },

    // Mobile menu actions
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    // Reset UI state
    resetUI: (state) => {
      state.sidebarOpen = false;
      state.modals = initialState.modals;
      state.notifications = [];
      state.mobileMenuOpen = false;
      state.searchQuery = '';
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setModalOpen,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setGlobalLoading,
  setSearchQuery,
  clearSearch,
  setMobileMenuOpen,
  toggleMobileMenu,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
