import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  Button,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import UserAvatar from "./UserAvatar";

const NavBar = () => {
  const navigate = useNavigate();
  const [userAvatar, setUserAvatar] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { courseId } = useParams();

  const token = localStorage.getItem("token");

  const [courseName, setCourseName] = useState("");

  const fetchCourseName = async () => {
    if (!courseId) {
      setCourseName("Dashboard");
      return;
    }

    const response = await fetch(
      new URL(`/courses/${courseId}/name`, "http://localhost:5000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      setCourseName(data.course_id);
    }
  };

  const fetchAvatar = async () => {
    const response = await fetch(
      new URL(`/profile/avatar/preview`, "http://localhost:5000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      setUserAvatar(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatar();
    fetchCourseName();
  }, []);

  const handleDashboardClick = async () => {
    const response = await fetch(
      new URL(`/profile/info`, "http://localhost:5000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      if (data.is_teacher) navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    }
  };

  const [dropdown, setDropdown] = useState(null);

  const handleOpen = (e) => {
    setDropdown(e.currentTarget);
  };

  const handleClose = () => {
    setDropdown(null);
  };

  const handleProfile = () => {
    navigate("/myprofile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 50000, backgroundColor: "white" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: "rgb(156,39,176)",
            cursor: "pointer",
            "&:hover": {
              fontSize: "2.3rem",
            },
            width: "130px",
          }}
          onClick={handleDashboardClick}
        >
          Poodle
        </Typography>
        {!isLoading && (
          <>
            <Typography variant="h4" component="div" sx={{ color: "black" }}>
              {courseName}
            </Typography>

            <div>
              <Button
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  height: "50px",
                  borderRadius: "50%",
                }}
                onClick={handleOpen}
              >
                <img
                  src={createAvatar(avataaars, userAvatar).toDataUriSync()}
                  alt="Avatar"
                  height={50}
                  style={{ borderRadius: "50%", backgroundColor: "lightGrey" }}
                />
              </Button>
              <Menu
                anchorEl={dropdown}
                open={Boolean(dropdown)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>View Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
