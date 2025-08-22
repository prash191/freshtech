// Date utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
};

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Number utilities
export const formatPrice = (price: number | undefined | null, currency = '₹'): string => {
  if (price === undefined || price === null) {
    return `${currency}0`;
  }
  return `${currency}${price.toLocaleString('en-IN')}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

export const roundToDecimals = (num: number, decimals = 2): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Array utilities
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const groupBy = <T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

// Object utilities
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const isValidPassword = (password: string): boolean => {
  // Password validation disabled - accepting any password
  return true;
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  // return passwordRegex.test(password);
};

// Storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// URL utilities
export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

export const setQueryParams = (params: Record<string, string>): void => {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.replaceState({}, '', url.toString());
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Error handling
export const handleError = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

// File utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

// Data transformation utilities
export const transformProduct = (serverProduct: any): any => {
  // Handle specifications field safely
  let specifications = {};
  if (serverProduct.specifications) {
    try {
      // Check if specifications is a Map or iterable object
      if (serverProduct.specifications instanceof Map) {
        specifications = Object.fromEntries(serverProduct.specifications);
      } else if (typeof serverProduct.specifications === 'object' && serverProduct.specifications !== null) {
        // If it's already a plain object, use it directly
        specifications = serverProduct.specifications;
      } else {
        // Fallback to default specifications
        specifications = {
          'Color': serverProduct.color || 'N/A',
          'Stages': `${serverProduct.stage || 'N/A'} Stage`,
          'Storage': `${serverProduct.storage || 'N/A'} L`,
          'Power': `${serverProduct.power || 'N/A'}W`,
          'Installation': serverProduct.installation || 'Free',
          'Guarantee': `${serverProduct.guarantee || 'N/A'} Years`,
          'Rating': `${serverProduct.ratingsAverage || 'N/A'}/5`,
          'Features': serverProduct.features?.join(', ') || 'N/A',
        };
      }
    } catch (error) {
      console.warn('Error processing specifications:', error);
      // Fallback to default specifications
      specifications = {
        'Color': serverProduct.color || 'N/A',
        'Stages': `${serverProduct.stage || 'N/A'} Stage`,
        'Storage': `${serverProduct.storage || 'N/A'} L`,
        'Power': `${serverProduct.power || 'N/A'}W`,
        'Installation': serverProduct.installation || 'Free',
        'Guarantee': `${serverProduct.guarantee || 'N/A'} Years`,
        'Rating': `${serverProduct.ratingsAverage || 'N/A'}/5`,
        'Features': serverProduct.features?.join(', ') || 'N/A',
      };
    }
  } else {
    // No specifications provided, use defaults
    specifications = {
      'Color': serverProduct.color || 'N/A',
      'Stages': `${serverProduct.stage || 'N/A'} Stage`,
      'Storage': `${serverProduct.storage || 'N/A'} L`,
      'Power': `${serverProduct.power || 'N/A'}W`,
      'Installation': serverProduct.installation || 'Free',
      'Guarantee': `${serverProduct.guarantee || 'N/A'} Years`,
      'Rating': `${serverProduct.ratingsAverage || 'N/A'}/5`,
      'Features': serverProduct.features?.join(', ') || 'N/A',
    };
  }

  return {
    id: serverProduct._id,
    name: serverProduct.name,
    description: serverProduct.description || serverProduct.summary || '',
    price: serverProduct.price,
    images: serverProduct.images || [serverProduct.imageCover].filter(Boolean),
    category: serverProduct.category || 'RO Systems',
    specifications,
    inStock: serverProduct.inStock !== undefined ? serverProduct.inStock : true,
    createdAt: serverProduct.createdAt,
    updatedAt: serverProduct.updatedAt || serverProduct.createdAt,
  };
};

export const transformProductsResponse = (response: any): any => {
  // Handle server response structure: { status: "success", result: number, data: [...] }
  const productsArray = response.data || [];
  return {
    data: productsArray.map(transformProduct),
    total: response.result || productsArray.length,
    page: response.page || 1,
    limit: response.limit || 12,
    totalPages: response.totalPages || 1,
  };
};

// Cookie utilities
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};
