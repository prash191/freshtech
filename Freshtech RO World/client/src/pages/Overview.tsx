import React, { useEffect } from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { formatPrice } from '@/utils';
import { Product } from '@/types';

const Overview: React.FC = () => {
  const { products, isLoading, error, loadProducts } = useProducts();

  useEffect(() => {
    console.log('🔍 Overview: useEffect triggered, calling loadProducts');
    loadProducts();
  }, []); // Empty dependency array to run only once

  console.log('📊 Overview: Render - products:', products);
  console.log('📊 Overview: Render - isLoading:', isLoading);
  console.log('📊 Overview: Render - error:', error);
  console.log('📊 Overview: Render - products.length:', products?.length || 0);

  if (isLoading) {
    console.log('⏳ Overview: Showing loading spinner');
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    console.log('❌ Overview: Showing error:', error);
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Error loading products: {error}
        </Typography>
      </Container>
    );
  }

  console.log('✅ Overview: Rendering products, count:', products?.length || 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Our Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover our premium RO water purification solutions designed for your home and business needs.
        </Typography>
      </Box>

      {products && products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product: Product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products available at the moment.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check back later or contact us for more information.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Overview;
