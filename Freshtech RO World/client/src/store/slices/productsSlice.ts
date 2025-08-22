import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, PaginatedResponse } from '@/types';
import { productsAPI } from '@/services/api';
import { transformProduct, transformProductsResponse } from '@/utils';

// State interface
interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    category: string;
    search: string;
    minPrice: number;
    maxPrice: number;
    inStock: boolean | null;
  };
}

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: any = undefined, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      console.log('🔍 fetchProducts: Starting API call with params:', params);
      
      const response = await productsAPI.getAll(params);
      console.log('✅ fetchProducts: API response received:', response);
      
      // Transform server response using the utility function
      const transformedResponse = transformProductsResponse(response);
      console.log('🔄 fetchProducts: Transformed response:', transformedResponse);
      
      return transformedResponse;
    } catch (error: any) {
      console.error('❌ fetchProducts: Error occurred:', error);
      console.error('❌ fetchProducts: Error response:', error.response);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      console.log('Fetching product by ID from API:', id);
      
      const response = await productsAPI.getById(id);
      console.log('API response:', response);
      
      // Transform server response using the utility function
      const transformedProduct = transformProduct(response.data);
      console.log('Transformed product:', transformedProduct);
      
      return transformedProduct;
    } catch (error: any) {
      console.error('Error fetching product by ID:', error);
      return rejectWithValue(error.response?.data?.message || 'Product not found');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Partial<Product>, { rejectWithValue }) => {
    try {
      const response = await productsAPI.create(productData);
      const transformedProduct = transformProduct(response.data);
      return transformedProduct;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.update(id, data);
      const transformedProduct = transformProduct(response.data);
      return transformedProduct;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productsAPI.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Initial state
const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  filters: {
    category: '',
    search: '',
    minPrice: 0,
    maxPrice: 0,
    inStock: null,
  },
};

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        console.log('🔄 Products slice: fetchProducts.pending - Setting isLoading to true');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log('✅ Products slice: fetchProducts.fulfilled - Payload:', action.payload);
        state.isLoading = false;
        const response = action.payload as PaginatedResponse<Product>;
        console.log('📊 Products slice: Response data:', response);
        console.log('📊 Products slice: Response data length:', response.data?.length || 0);
        
        state.products = response.data;
        state.pagination = {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages,
        };
        console.log('✅ Products slice: Updated state with', state.products.length, 'products');
        console.log('✅ Products slice: Products data:', state.products);
        console.log('✅ Products slice: Final state:', {
          productsCount: state.products.length,
          isLoading: state.isLoading,
          error: state.error,
          pagination: state.pagination
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.log('❌ Products slice: fetchProducts.rejected - Payload:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch single product
    builder
      .addCase(fetchProductById.pending, (state) => {
        console.log('Products slice: fetchProductById.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        console.log('Products slice: fetchProductById.fulfilled', action.payload);
        state.isLoading = false;
        state.currentProduct = action.payload as Product;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        console.log('Products slice: fetchProductById.rejected', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload as Product);
        state.pagination.total += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProduct = action.payload as Product;
        const index = state.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        if (state.currentProduct?.id === updatedProduct.id) {
          state.currentProduct = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload;
        state.products = state.products.filter(p => p.id !== deletedId);
        if (state.currentProduct?.id === deletedId) {
          state.currentProduct = null;
        }
        state.pagination.total -= 1;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearCurrentProduct,
  setFilters,
  clearFilters,
  setPage,
} = productsSlice.actions;

export default productsSlice.reducer;
