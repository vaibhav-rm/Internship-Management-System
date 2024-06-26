import React, { useContext, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import AuthContext from "./auth/auth-context";
import StudentContextProvider from "./student/StudentContextProvider";
import logo from "./sangwin-logo.png";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuIcon from '@mui/icons-material/Menu';

const theme = createTheme({
  palette: {
    primary: {
      main: "#333",
    },
  },
});

const Dashboard = () => {
  const authCtx = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); // State for toggling sidebar

  if (authCtx.isLoggedIn === false) {
    return <Navigate to="/login" />;
  }

  const logOut = () => {
    authCtx.logout();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <StudentContextProvider>
        <Box sx={{ display: "flex" }}>
          {/* Toggle Button for Sidebar */}
          <IconButton
            color="inherit"
            aria-label="open sidebar"
            onClick={toggleSidebar}
            sx={{
              display: { xs: 'block', md: 'none' }, // Show only on small screens
              mr: 2,
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Sidebar */}
          <Drawer
            variant="permanent"
            open={isOpen}
            sx={{
              width: 250,
              flexShrink: 0,
              [`&.MuiDrawer-paper`]: { width: 250, boxSizing: "border-box" },
              "@media (max-width: 600px)": {
                display: isOpen ? "block" : "none", // Hide when not open on small screens
              },
            }}
          >
            <Typography variant="h6" sx={{ p: 2 }}>
              <img src={logo} alt="IMS Logo" width={200} />
            </Typography>
            <List>
              <ListItem
                button
                component={NavLink}
                to="/"
                sx={{
                  "&:hover": {
                    backgroundColor: "#4BB1BE",
                    color: "#000000",
                  },
                  "&.active": {
                    backgroundColor: "#28666E",
                    color: "#000000",
                  },
                }}
              >
                <ListItemIcon>
                  <i className="fa fa-user" />
                </ListItemIcon>
                <ListItemText primary="User List" />
              </ListItem>
              <ListItem
                button
                component={NavLink}
                to="/add"
                sx={{
                  "&:hover": {
                    backgroundColor: "#4BB1BE",
                    color: "gray.900",
                  },
                  "&.active": {
                    backgroundColor: "#28666E",
                    color: "gray.900",
                  },
                }}
              >
                <ListItemIcon>
                  <i className="fa fa-plus" />
                </ListItemIcon>
                <ListItemText primary="Add new user" />
              </ListItem>
              <ListItem
                button
                component={NavLink}
                to="/login"
                onClick={logOut}
                sx={{
                  "&:hover": {
                    backgroundColor: "#4BB1BE",
                    color: "gray.900",
                  },
                  "&.active": {
                    backgroundColor: "#28666E",
                    color: "gray.900",
                  },
                }}
              >
                <ListItemIcon>
                  <i className="fa fa-sign-out" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
              <ListItem
                button
                component={NavLink}
                to="/reports"
                sx={{
                  "&:hover": {
                    backgroundColor: "#4BB1BE",
                    color: "gray.900",
                  },
                  "&.active": {
                    backgroundColor: "#28666E",
                    color: "gray.900",
                  },
                }}
              >
                <ListItemIcon>
                  <i className="fa fa-file" />
                </ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItem>
              <ListItem
                button
                component={NavLink}
                to="/settings"
                sx={{
                  "&:hover": {
                    backgroundColor: "#4BB1BE",
                    color: "gray.900",
                  },
                  "&.active": {
                    backgroundColor: "#28666E",
                    color: "gray.900",
                  },
                }}
              >
                <ListItemIcon>
                  <i className="fa fa-cog" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
          </Drawer>

          {/* Main Content Area */}
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </StudentContextProvider>
    </ThemeProvider>
  );
};

export default Dashboard;
