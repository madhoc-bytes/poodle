import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Toolbar, Typography, Box } from "@mui/material";
import { useParams } from "react-router";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

const ProfilePage = () => {
  const userId = useParams().userId;
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState({});
  const [userAvatar, setUserAvatar] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
    fetchAvatar();
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

  // TODO: fetch user avatar from backend
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
        </Box>
      )}
    </>
  );
};

export default ProfilePage;
