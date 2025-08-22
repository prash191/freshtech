import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Badge,
  Drawer,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Menu as MenuIcon,
  Search,
  Person,
  Logout,
  Settings,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSearchQuery, toggleMobileMenu } from '@/store/slices/uiSlice';
import { selectCartItemCount, openCart } from '@/store/slices/cartSlice';
import { selectFavoritesCount } from '@/store/slices/favoritesSlice';
import SideDrawer from './SideDrawer';
import logo from '@/assets/icons/logo.png';
import { config, routes } from '@/constants/config';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useAppDispatch();
  
  const { searchQuery, mobileMenuOpen } = useAppSelector((state) => state.ui);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement search functionality
    console.log('Search for:', searchQuery);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuClick = (action: string) => {
    handleProfileClose();
    switch (action) {
      case 'profile':
        navigate(routes.account);
        break;
      case 'admin':
        navigate(routes.admin.dashboard);
        break;
      case 'settings':
        navigate(routes.account);
        break;
      case 'logout':
        logout();
        break;
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMobileMenuToggle = () => {
    dispatch(toggleMobileMenu());
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#1f2937',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
          {/* Left Section - Logo & Company Name */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
            }}
            onClick={() => navigate(routes.home)}
          >
            <img src={logo} alt="Logo" style={{ height: '40px' }} />
            <Typography
              variant="h6"
              sx={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#ffffff',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {config.app.name}
            </Typography>
          </Box>

          {/* Middle Section - Search Input */}
          {!isMobile && (
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{ flex: 1, maxWidth: 400, mx: 4 }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                    '& .MuiOutlinedInput-input': {
                      color: 'rgba(0, 0, 0, 0.87)',
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'rgba(0, 0, 0, 0.54)',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'grey.500', mr: 1 }} />,
                }}
              />
            </Box>
          )}

          {/* Right Section - Icons & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Contact Info - Desktop Only */}
            <Typography
              variant="body2"
              sx={{
                color: '#ffffff',
                display: { xs: 'none', lg: 'block' },
                mr: 2,
              }}
            >
              📞 {config.contact.phone}
            </Typography>

            {/* User Profile */}
            {isAuthenticated && user ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleProfileClick}
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: '#3b82f6',
                      width: 32,
                      height: 32,
                      fontSize: '0.875rem',
                    }}
                  >
                    {user.photo ? (
                      <img src={user.photo} alt={user.name} />
                    ) : (
                      getInitials(user.name)
                    )}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleProfileMenuClick('profile')}>
                    <Person sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleProfileMenuClick('settings')}>
                    <Settings sx={{ mr: 1 }} />
                    Settings
                  </MenuItem>
                  {user.role === 'admin' && (
                    <MenuItem onClick={() => handleProfileMenuClick('admin')}>
                      <AdminPanelSettings sx={{ mr: 1 }} />
                      Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={() => handleProfileMenuClick('logout')}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <IconButton
                color="inherit"
                onClick={() => navigate(routes.login)}
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}>
                  <Person />
                </Avatar>
              </IconButton>
            )}

            {/* Shopping Cart */}
            <IconButton
              color="inherit"
              onClick={() => dispatch(openCart())}
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Favorites */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/favorites')}
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={favoritesCount} color="error">
                <Favorite />
              </Badge>
            </IconButton>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              onClick={handleMobileMenuToggle}
              sx={{ ml: 1, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Search Bar */}
      {isMobile && (
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.drawer,
            p: 2,
            backgroundColor: 'white',
            borderBottom: 1,
            borderColor: 'grey.200',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: <Search sx={{ color: 'grey.500', mr: 1 }} />,
            }}
          />
        </Box>
      )}

      {/* Side Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <SideDrawer onClose={handleDrawerToggle} />
      </Drawer>
    </>
  );
};

export default Navbar;
