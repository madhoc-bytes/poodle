import react, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  Button,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const [dropdown, setDropdown] = useState(null);

  const handleOpen = (e) => {
    setDropdown(e.currentTarget);
  };

  const handleClose = () => {
    setDropdown(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // TODO: Need to do react router to profile page
  return (
    <AppBar position="fixed" sx={{ zIndex: 50000, backgroundColor: "white" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, color: "rgb(156,39,176)" }}
        >
          Poodle
        </Typography>
        <div>
          <Button
            sx={{ backgroundColor: "white", color: "black", height: "56px" }}
            onClick={handleOpen}
          >
            Profile
          </Button>
          <Menu
            anchorEl={dropdown}
            open={Boolean(dropdown)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>View Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
