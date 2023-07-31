import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import {
  Toolbar,
  Typography,
  Box,
  LinearProgress,
  Popover,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import SchoolIcon from "@mui/icons-material/School";
import InfoIcon from "@mui/icons-material/Info";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

const ProfilePage = () => {
  const userId = useParams().userId;
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState({});
  const [userAvatar, setUserAvatar] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState({});

  useEffect(() => {
    fetchUserDetails();
    fetchAvatar();
    fetchBadges();
  }, []);

  const fetchUserDetails = async () => {
    // fetch user details from backend
    const response = await fetch(
      new URL(`/profile/info/${userId}`, "http://localhost:5000"),
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
    } else setUserDetails(data);
  };

  const fetchAvatar = async () => {
    const response = await fetch(
      new URL(`/profile/avatar/preview/${userId}`, "http://localhost:5000"),
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
      console.log(data);
      setIsLoading(false);
    }
  };

  const fetchBadges = async () => {
    const response = await fetch(
      new URL(`/profile/badges/tallies`, "http://localhost:5000"),
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
      setBadges(data.tallies);
      console.log(data);
    }
  };

  // State and functions to handle the popover
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverInfo, setPopoverInfo] = useState("hi");
  const handlePopoverOpen = (event, badge) => {
    if (badge === "academic")
      setPopoverInfo("Gained by getting high scores in assignments");
    else if (badge === "efficient")
      setPopoverInfo("Gained by handing in work early");
    else if (badge === "helpful")
      setPopoverInfo("Gained by replying to forum posts");
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <NavBar />
      <Toolbar />
      {!isLoading && (
        <Box
          gap={20}
          sx={{
            display: "flex",
            flexDirection: "row",
            p: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Left section: Avatar */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              sx={{ textAlign: "center", marginBottom: 2 }}
            >
              User Profile
            </Typography>

            <img
              src={createAvatar(avataaars, userAvatar).toDataUriSync()}
              alt="Avatar"
              height={350}
              style={{ borderRadius: "50%" }}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }} gap={5}>
              <Box sx={{ display: "flex", flexDirection: "column" }} gap={2}>
                {/* Right section: User Details */}

                <Typography variant="h6" fontWeight={"bold"}>
                  First Name:
                </Typography>
                <Typography variant="h6" fontWeight={"bold"}>
                  Last Name:
                </Typography>
                <Typography variant="h6" fontWeight={"bold"}>
                  Email:
                </Typography>
                <Typography variant="h6" fontWeight={"bold"}>
                  Role:
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }} gap={2}>
                <Typography variant="h6">{userDetails.first_name}</Typography>
                <Typography variant="h6">{userDetails.last_name}</Typography>
                <Typography variant="h6"> {userDetails.email}</Typography>
                <Typography variant="h6">
                  {userDetails.is_teacher ? "Teacher" : "Student"}
                </Typography>
              </Box>
            </Box>
            {!userDetails.is_teacher && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  paddingTop: "60px",
                }}
                gap={5}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  gap={2}
                >
                  <SchoolIcon
                    sx={{
                      fontSize: "100px",
                      borderRadius: "25%",
                      boxShadow:
                        badges.academic > 29
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver, 0 0 0 12px gold`
                          : Math.floor(badges.academic / 10) === 2
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver`
                          : Math.floor(badges.academic / 10) === 1
                          ? `0 0 0 4px #cd7f32`
                          : "",
                      marginBottom: "10px",
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={
                      badges.academic >= 30 ? 100 : (badges.academic % 10) * 10
                    }
                    sx={{
                      width: "200px",
                      height: "10px",
                      borderRadius: "10px",
                      backgroundColor: "lightGrey",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                  <Typography variant="h5">
                    Academic Apex
                    <IconButton
                      onClick={(e) => handlePopoverOpen(e, "academic")}
                      sx={{ marginLeft: 0 }}
                    >
                      <InfoIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  gap={2}
                >
                  <MoreTimeIcon
                    sx={{
                      fontSize: "100px",
                      boxShadow:
                        badges.efficient > 29
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver, 0 0 0 12px gold`
                          : Math.floor(badges.efficient / 10) === 2
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver`
                          : Math.floor(badges.efficient / 10) === 1
                          ? `0 0 0 4px #cd7f32`
                          : "",
                      marginBottom: "10px",
                      borderRadius: "25%",
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={
                      badges.efficient >= 30
                        ? 100
                        : (badges.efficient % 10) * 10
                    }
                    sx={{
                      width: "200px",
                      height: "10px",
                      borderRadius: "10px",
                      backgroundColor: "lightGrey",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                  <Typography variant="h5">
                    Efficient Executor{" "}
                    <IconButton
                      onClick={(e) => handlePopoverOpen(e, "efficient")}
                      sx={{ marginLeft: 0 }}
                    >
                      <InfoIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                  gap={2}
                >
                  <LocalLibraryIcon
                    sx={{
                      fontSize: "100px",
                      boxShadow:
                        badges.helpful > 29
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver, 0 0 0 12px gold`
                          : Math.floor(badges.helpful / 10) === 2
                          ? `0 0 0 4px #cd7f32, 0 0 0 8px silver`
                          : Math.floor(badges.helpful / 10) === 1
                          ? `0 0 0 4px #cd7f32`
                          : "",
                      marginBottom: "10px",
                      borderRadius: "25%",
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={
                      badges.helpful >= 30 ? 100 : (badges.helpful % 10) * 10
                    }
                    sx={{
                      width: "200px",
                      height: "10px",
                      borderRadius: "10px",
                      backgroundColor: "lightGrey",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                  <Typography variant="h5">
                    Helpful Learner{" "}
                    <IconButton
                      onClick={(e) => handlePopoverOpen(e, "helpful")}
                      sx={{ marginLeft: 0 }}
                    >
                      <InfoIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </Typography>
                </Box>
                <Popover
                  open={Boolean(anchorEl)}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    sx: {
                      backgroundColor: "black",
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                    },
                  }}
                >
                  <Typography variant="p" sx={{ p: 1 }}>
                    {popoverInfo}
                  </Typography>
                </Popover>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfilePage;
