import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { ButtonProps as MuiButtonProps } from '@mui/material/Button';


interface CustomButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: '#3b82f6',
            color: 'white',
            '&:hover': {
              backgroundColor: '#2563eb',
            },
            '&:disabled': {
              backgroundColor: '#9ca3af',
            },
          },
        };
      case 'secondary':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: '#6b7280',
            color: 'white',
            '&:hover': {
              backgroundColor: '#4b5563',
            },
            '&:disabled': {
              backgroundColor: '#9ca3af',
            },
          },
        };
      case 'outline':
        return {
          variant: 'outlined' as const,
          sx: {
            borderColor: '#3b82f6',
            color: '#3b82f6',
            '&:hover': {
              borderColor: '#2563eb',
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
            },
            '&:disabled': {
              borderColor: '#9ca3af',
              color: '#9ca3af',
            },
          },
        };
      case 'ghost':
        return {
          variant: 'text' as const,
          sx: {
            color: '#3b82f6',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
            },
            '&:disabled': {
              color: '#9ca3af',
            },
          },
        };
      default:
        return { variant: 'contained' as const };
    }
  };

  const getSizeProps = () => {
    switch (size) {
      case 'sm':
        return { size: 'small' as const };
      case 'md':
        return { size: 'medium' as const };
      case 'lg':
        return { size: 'large' as const };
      default:
        return { size: 'medium' as const };
    }
  };

  const variantProps = getVariantProps();
  const sizeProps = getSizeProps();

  return (
    <MuiButton
      {...variantProps}
      {...sizeProps}
      disabled={disabled || loading}
      className={className}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: '8px',
        ...variantProps.sx,
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
          color="inherit"
          sx={{ mr: 1 }}
        />
      ) : null}
      {children}
    </MuiButton>
  );
};

export default Button;
