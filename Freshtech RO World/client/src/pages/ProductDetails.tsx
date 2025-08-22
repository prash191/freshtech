import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  Divider,
  Paper,
  Rating,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import { ArrowBack, ShoppingCart, Favorite } from '@mui/icons-material';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ImageCarousel from '@/components/common/ImageCarousel';
import Button from '@/components/common/Button';
import { formatPrice, formatDate } from '@/utils';
import { Product } from '@/types';
import { addToCart } from '@/store/slices/cartSlice';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { currentProduct, isLoading, error, loadProduct } = useProducts();
  
  console.log('ProductDetails: Render - id:', id, 'currentProduct:', currentProduct, 'isLoading:', isLoading, 'error:', error);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    if (id) {
      console.log('ProductDetails: useEffect triggered, calling loadProduct with id:', id);
      loadProduct(id);
    }
  }, [id]); // Remove loadProduct from dependency array to prevent infinite loop

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ product: currentProduct, quantity }));
      console.log('Added to cart:', { product: currentProduct, quantity });
    }
  };

  const handleAddToFavorites = () => {
    // TODO: Implement favorites functionality
    console.log('Add to favorites:', currentProduct);
  };

  const handleSubmitReview = () => {
    // TODO: Implement review submission
    console.log('Submit review:', review);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (error || !currentProduct) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          {error || 'Product not found'}
        </Typography>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  const product = currentProduct;
  
  // Debug logging
  console.log('ProductDetails: Product data:', product);
  console.log('ProductDetails: Product price:', product.price);
  console.log('ProductDetails: Product specifications:', product.specifications);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        variant="ghost"
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <ImageCarousel
            images={product.images || []}
            selectedImage={selectedImage}
            onImageChange={setSelectedImage}
          />
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" color="primary" sx={{ mr: 2 }}>
                {formatPrice(product.price)}
              </Typography>
              <Chip
                label={product.inStock ? 'In Stock' : 'Out of Stock'}
                color={product.inStock ? 'success' : 'error'}
                size="small"
              />
            </Box>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {product.description || 'No description available'}
            </Typography>

            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Quantity:
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                size="small"
                sx={{ width: 80, mr: 2 }}
              />
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="primary"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                sx={{ flex: 1 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                startIcon={<Favorite />}
                onClick={handleAddToFavorites}
                sx={{ minWidth: 'auto' }}
              >
                Favorite
              </Button>
            </Box>
          </Box>

          {/* Specifications */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <Grid container spacing={2}>
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="body2" color="text.secondary">
                    {key}:
                  </Typography>
                  <Typography variant="body1">
                    {value !== undefined && value !== null ? String(value) : 'N/A'}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            {(!product.specifications || Object.keys(product.specifications).length === 0) && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No specifications available
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Customer Reviews
        </Typography>
        
        {user && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Write a Review
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Rating
                value={review.rating}
                onChange={(_, value) => setReview(prev => ({ ...prev, rating: value || 0 }))}
                size="large"
              />
            </Box>
            <TextareaAutosize
              placeholder="Share your experience with this product..."
              value={review.comment}
              onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
              style={{
                width: '100%',
                minHeight: 100,
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                disabled={!review.rating || !review.comment.trim()}
              >
                Submit Review
              </Button>
            </Box>
          </Paper>
        )}

        {/* TODO: Display existing reviews */}
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Reviews feature coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default ProductDetails;
