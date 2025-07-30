import React, { useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  Badge,
  Drawer,
  Avatar,
} from "@mui/material";
import { ShoppingCart, Favorite, Menu } from "@mui/icons-material";

import SideDrawer from "./sideDrawer";

import logo from "../../assets/icons/logo.png";
import { PHONE } from "../../constants/constant";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1f2937",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "12px 24px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section - Logo & Company Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#ffffff",
            }}
          >
            Freshtech RO World
          </Typography>
        </div>

        {/* Middle Section - Search Input */}
        <TextField
          variant="outlined"
          placeholder="Search Product"
          size="small"
          sx={{
            width: "15rem",
            backgroundColor: "white",
            borderRadius: "0.2em",
            "& .MuiOutlinedInput-root": {
              height: "2rem",
              padding: "4px",
            },
          }}
        />

        {/* Right Section - Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Typography
            variant="body1"
            sx={{ color: "#ffffff", display: { xs: "none", sm: "block" } }}
          >
            📞 +91 {PHONE}
          </Typography>

          {/* Circular Profile Icon with Initial */}
          <IconButton color="inherit" onClick={() => {
            navigate('/account');
          }}>
            <Avatar sx={{ bgcolor: "#3b82f6", width: 32, height: 32 }}>U</Avatar>
          </IconButton>

          {/* Shopping Cart Icon */}
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={2} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {/* Favorites Icon */}
          <IconButton color="inherit" component={Link} to="/favorites">
            <Badge badgeContent={1} color="error">
              <Favorite />
            </Badge>
          </IconButton>

          {/* Hamburger Menu Icon - Opens Drawer */}
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <Menu />
          </IconButton>
        </div>
      </Toolbar>

      {/* Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <SideDrawer toggleDrawer={toggleDrawer} />
      </Drawer>
    </AppBar>
  );
};

export default Navbar;