import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
  useTheme,
} from '@mui/material';
import Button from '@/components/common/Button';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility,
} from '@mui/icons-material';
import { Product } from '@/types';
import { formatPrice } from '@/utils';
import { routes } from '@/constants/config';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleFavorite, selectIsFavorite } from '@/store/slices/favoritesSlice';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToFavorites?: (product: Product) => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToFavorites,
  showActions = true,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(state => selectIsFavorite(state, product.id));
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    navigate(routes.productDetail(product.id));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product }));
    onAddToCart?.(product);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(product));
    onAddToFavorites?.(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log('Quick view:', product);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images[0] || 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Product'}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Stock Status */}
        <Chip
          label={product.inStock ? 'In Stock' : 'Out of Stock'}
          color={product.inStock ? 'success' : 'error'}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: product.inStock ? 'success.main' : 'error.main',
            color: 'white',
            fontWeight: 600,
          }}
        />

        {/* Action Buttons */}
        {showActions && isHovered && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={handleQuickView}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleToggleFavorite}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
            >
              {isFavorite ? (
                <Favorite fontSize="small" color="error" />
              ) : (
                <FavoriteBorder fontSize="small" />
              )}
            </IconButton>
          </Box>
        )}

        {/* Category Badge */}
        <Chip
          label={product.category}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '0.75rem',
          }}
        />
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.3,
            height: '2.6em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            height: '3em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h6"
            color="primary"
            sx={{ fontWeight: 700, fontSize: '1.1rem' }}
          >
            {formatPrice(product.price)}
          </Typography>
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={4.5} // TODO: Get actual rating from product
            precision={0.5}
            size="small"
            readOnly
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            (4.5)
          </Typography>
        </Box>

        {/* Add to Cart Button */}
        {showActions && (
          <Box sx={{ mt: 'auto' }}>
            <Button
              variant="primary"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={!product.inStock}
              fullWidth
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
