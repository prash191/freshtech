import React from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { Close, Home, Login, Settings, ExitToApp } from "@mui/icons-material";

const SideDrawer = ({ toggleDrawer }) => {
  return (
    <div role="presentation" style={{ width: 250 }}>
      {/* Close Icon */}
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px" }}>
        <IconButton onClick={toggleDrawer(false)}>
          <Close />
        </IconButton>
      </div>

      <List>
        {/* Home */}
        <ListItem component={Link} to="/" onClick={toggleDrawer(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {/* Login */}
        <ListItem component={Link} to="/login" onClick={toggleDrawer(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemIcon>
            <Login />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>

        {/* Settings */}
        <ListItem component={Link} to="/account" onClick={toggleDrawer(false)} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>

        <Divider />

        {/* Logout */}
        <ListItem onClick={toggleDrawer(false)} style={{ cursor: "pointer" }}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );
};

export default SideDrawer;
