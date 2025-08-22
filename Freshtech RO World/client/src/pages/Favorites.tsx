import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import {
  Favorite,
  ArrowBack,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectFavorites, removeFromFavorites } from '@/store/slices/favoritesSlice';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/common/Button';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);

  const handleRemoveFromFavorites = (productId: string) => {
    dispatch(removeFromFavorites(productId));
  };

  if (favorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Favorite sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            No favorites yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start adding products to your favorites to see them here.
          </Typography>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="ghost"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
        <Typography variant="h3" component="h1" gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Favorites Grid */}
      <Grid container spacing={3}>
        {favorites.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard 
              product={product} 
              onAddToFavorites={() => handleRemoveFromFavorites(product.id)}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Favorites;
