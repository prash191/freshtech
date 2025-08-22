import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  fetchProducts, 
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  clearError,
  setFilters,
  clearFilters,
  setPage
} from '@/store/slices/productsSlice';
import { Product } from '@/types';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { 
    products, 
    currentProduct, 
    isLoading, 
    error, 
    pagination, 
    filters 
  } = useAppSelector((state) => state.products);

  const loadProducts = async (params?: any) => {
    try {
      await dispatch(fetchProducts(params)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const loadProduct = async (id: string) => {
    try {
      await dispatch(fetchProductById(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const addProduct = async (productData: Partial<Product>) => {
    try {
      await dispatch(createProduct(productData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const editProduct = async (id: string, productData: Partial<Product>) => {
    try {
      await dispatch(updateProduct({ id, data: productData })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error: error as string };
    }
  };

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  const changePage = (page: number) => {
    dispatch(setPage(page));
  };

  const clearProductsError = () => {
    dispatch(clearError());
  };

  return {
    products,
    currentProduct,
    isLoading,
    error,
    pagination,
    filters,
    loadProducts,
    loadProduct,
    addProduct,
    editProduct,
    removeProduct,
    updateFilters,
    resetFilters,
    changePage,
    clearProductsError,
  };
};
