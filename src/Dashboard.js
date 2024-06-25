import React, { useContext } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import AuthContext from "./auth/auth-context";
import StudentContextProvider from "./student/StudentContextProvider";
import logo from "./sangwin-logo.png";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#333",
    },
  },
});

const Dashboard = () => {
  const authCtx = useContext(AuthContext);

  if (authCtx.isLoggedIn === false) {
    return <Navigate to="/login" />;
  }

  const logOut = () => {
    authCtx.logout();
  };

  return (
    <ThemeProvider theme={theme}>
      <StudentContextProvider>
        <Box sx={{ display: "flex" }}>
          <Drawer
            variant="permanent"
            sx={{
              width: 250,
              flexShrink: 0,
              [`&.MuiDrawer-paper`]: { width: 250, boxSizing: "border-box" },
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
      backgroundColor: "#4BB1BE", // bright yellow
      color: "#000000", // black text
    },
    "&.active": {
      backgroundColor: "#28666E", // bright orange
      color: "#000000", // black text
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
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </StudentContextProvider>
    </ThemeProvider>
  );
};

export default Dashboard;