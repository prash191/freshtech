import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Inventory,
  People,
  RateReview,
  BookOnline,
  ShoppingCart,
  AttachMoney,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchDashboardStats, fetchRecentActivities } from '@/store/slices/dashboardSlice';
import { routes } from '@/constants/config';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { stats, recentActivities, isLoading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivities());
  }, [dispatch]);

  // Dashboard stats with real data
  const dashboardStats = [
    { 
      title: 'Total Products', 
      value: stats?.totalProducts?.toString() || '0', 
      icon: <Inventory />, 
      color: '#3b82f6' 
    },
    { 
      title: 'Total Users', 
      value: stats?.totalUsers?.toString() || '0', 
      icon: <People />, 
      color: '#10b981' 
    },
    { 
      title: 'Total Orders', 
      value: stats?.totalOrders?.toString() || '0', 
      icon: <ShoppingCart />, 
      color: '#f59e0b' 
    },
    { 
      title: 'Revenue', 
      value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0', 
      icon: <AttachMoney />, 
      color: '#8b5cf6' 
    },
  ];

  const quickActions = [
    { title: 'Manage Products', icon: <Inventory />, path: `${routes.admin.dashboard}/products` },
    { title: 'Manage Users', icon: <People />, path: `${routes.admin.dashboard}/users` },
    { title: 'View Reviews', icon: <RateReview />, path: `${routes.admin.dashboard}/reviews` },
    { title: 'Manage Bookings', icon: <BookOnline />, path: `${routes.admin.dashboard}/bookings` },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading dashboard data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}! Here's what's happening with your store.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    variant="outlined"
                    startIcon={action.icon}
                    onClick={() => navigate(action.path)}
                    sx={{
                      width: '100%',
                      py: 2,
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                    }}
                  >
                    {action.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Activities
            </Typography>
            {recentActivities.length > 0 ? (
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id || index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Visibility color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.text}
                        secondary={activity.time}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No recent activities
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
