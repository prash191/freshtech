import React from 'react';
import { Card as MuiCard, CardContent, CardActions, Typography, Box } from '@mui/material';
import { CardProps } from '@/types';

interface CustomCardProps extends CardProps {
  children?: React.ReactNode;
  elevation?: number;
  onClick?: () => void;
}

const Card: React.FC<CustomCardProps> = ({
  title,
  subtitle,
  image,
  actions,
  children,
  className,
  elevation = 1,
  onClick,
  ...props
}) => {
  return (
    <MuiCard
      elevation={elevation}
      className={className}
      onClick={onClick}
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        } : {},
        ...props.sx,
      }}
      {...props}
    >
      {image && (
        <Box
          component="img"
          src={image}
          alt={title || 'Card image'}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
          }}
        />
      )}
      
      {(title || subtitle || children) && (
        <CardContent sx={{ p: 3 }}>
          {title && (
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 600,
                mb: subtitle ? 1 : 0,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: children ? 2 : 0 }}
            >
              {subtitle}
            </Typography>
          )}
          
          {children}
        </CardContent>
      )}
      
      {actions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
