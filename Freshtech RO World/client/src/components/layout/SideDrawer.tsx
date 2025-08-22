import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Home,
  ShoppingCart,
  Favorite,
  Person,
  Settings,
  AdminPanelSettings,
  Logout,
  Close,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { config, routes } from '@/constants/config';

interface SideDrawerProps {
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { text: 'Home', icon: <Home />, path: routes.home },
    { text: 'Cart', icon: <ShoppingCart />, path: '/cart' },
    { text: 'Favorites', icon: <Favorite />, path: '/favorites' },
  ];

  const userMenuItems = isAuthenticated
    ? [
        { text: 'Profile', icon: <Person />, path: routes.account },
        { text: 'Settings', icon: <Settings />, path: routes.account },
        ...(user?.role === 'admin'
          ? [{ text: 'Admin Panel', icon: <AdminPanelSettings />, path: routes.admin.dashboard }]
          : []),
      ]
    : [{ text: 'Login', icon: <Person />, path: routes.login }];

  return (
    <Box
      sx={{
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Menu
        </Typography>
        <IconButton color="inherit" onClick={onClose}>
          <Close />
        </IconButton>
      </Box>

      {/* User Profile Section */}
      {isAuthenticated && user && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 48,
                height: 48,
                mr: 2,
                fontSize: '1.2rem',
              }}
            >
              {user.photo ? (
                <img src={user.photo} alt={user.name} />
              ) : (
                getInitials(user.name)
              )}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 1 }} />

        {userMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      {/* Contact Information */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'grey.200' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Contact Us
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {config.contact.phone}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {config.contact.email}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {config.contact.address}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SideDrawer;
