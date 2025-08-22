import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface ImageCarouselProps {
  images: string[];
  selectedImage: number;
  onImageChange: (index: number) => void;
  height?: number;
  showThumbnails?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  selectedImage,
  onImageChange,
  height = 400,
  showThumbnails = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isHovered, setIsHovered] = useState(false);

  const handlePrevious = () => {
    onImageChange(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
  };

  const handleNext = () => {
    onImageChange(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
  };

  const handleThumbnailClick = (index: number) => {
    onImageChange(index);
  };

  if (!images || images.length === 0) {
    return (
      <Paper
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
        }}
      >
        No images available
      </Paper>
    );
  }

  return (
    <Box>
      {/* Main Image */}
      <Paper
        sx={{
          position: 'relative',
          height,
          overflow: 'hidden',
          borderRadius: 2,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Box
          component="img"
          src={images[selectedImage]}
          alt={`Product image ${selectedImage + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (isHovered || isMobile) && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 1,
              fontSize: '0.875rem',
            }}
          >
            {selectedImage + 1} / {images.length}
          </Box>
        )}
      </Paper>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
          {images.map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 1,
                cursor: 'pointer',
                border: index === selectedImage ? 2 : 1,
                borderColor: index === selectedImage ? 'primary.main' : 'grey.300',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'scale(1.05)',
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageCarousel;
