import react from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const NavBar = () => {
  // Need to do react router to profile page
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
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-end",
            color: "black",
          }}
        >
          Profile
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
