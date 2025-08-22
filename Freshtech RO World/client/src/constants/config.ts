// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    apiVersion: 'v1.0',
    timeout: 10000,
    withCredentials: true,
  },

  // App Configuration
  app: {
    name: 'Freshtech RO World',
    version: '1.0.0',
    description: 'Premium RO Water Purification Solutions',
  },

  // Contact Information
  contact: {
    phone: '+91 8619449866',
    email: 'freshtechroworld@gmail.com',
    address: 'Your Address Here',
  },

  // Features
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  },

  // Pagination
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100,
  },

  // File upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 5,
  },
} as const;

// API endpoints
export const endpoints = {
  auth: {
    login: '/users/login',
    register: '/users/signup',
    logout: '/users/logout',
    refresh: '/users/refresh',
    profile: '/users/profile',
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
  reviews: {
    list: '/reviews',
    create: '/reviews',
    update: (id: string) => `/reviews/${id}`,
    delete: (id: string) => `/reviews/${id}`,
  },
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  dashboard: {
    stats: '/dashboard/stats',
    activities: '/dashboard/activities',
  },
} as const;

// Route paths
export const routes = {
  home: '/',
  products: '/products',
  productDetail: (id: string) => `/products/${id}`,
  login: '/login',
  register: '/signup',
  account: '/account',
  admin: {
    dashboard: '/admin',
    products: '/admin/products',
    addProduct: '/admin/products/add',
    editProduct: (id: string) => `/admin/products/edit/${id}`,
    users: '/admin/users',
    reviews: '/admin/reviews',
    bookings: '/admin/bookings',
  },
} as const;

// Local storage keys
export const storageKeys = {
  auth: 'freshtech_auth',
  theme: 'freshtech_theme',
  language: 'freshtech_language',
  cart: 'freshtech_cart',
  favorites: 'freshtech_favorites',
} as const;

// Error messages
export const errorMessages = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'Access denied.',
  notFound: 'Resource not found.',
  serverError: 'Server error. Please try again later.',
  validation: 'Please check your input and try again.',
  unknown: 'An unexpected error occurred.',
} as const;

// Success messages
export const successMessages = {
  login: 'Successfully logged in.',
  register: 'Account created successfully.',
  logout: 'Successfully logged out.',
  profileUpdate: 'Profile updated successfully.',
  productCreate: 'Product created successfully.',
  productUpdate: 'Product updated successfully.',
  productDelete: 'Product deleted successfully.',
} as const;
