import React from 'react';
import { Box, Typography } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import Button from '@/components/common/Button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Oops! Something went wrong
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
        We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          {error.message}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="primary"
          onClick={resetErrorBoundary}
          sx={{ minWidth: 120 }}
        >
          Try Again
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.location.href = '/'}
          sx={{ minWidth: 120 }}
        >
          Go Home
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorFallback;
