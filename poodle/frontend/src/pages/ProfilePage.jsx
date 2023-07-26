import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { Grid, Toolbar, Typography, Box } from "@mui/material";
import { useParams } from "react-router";

const ProfilePage = () => {
  const userId = useParams().userId;
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState({
    firstName: "Handy",
    lastName: "Wang",
    email: "huangandy05@gmail.com",
    avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Toby",
  });
  const [isTeacher, setIsTeacher] = useState();

  useEffect(() => {
    fetchIsTeacher();
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    // fetch user details from backend
  };

  const fetchIsTeacher = async () => {
    const response = await fetch(
      new URL(`/profile/is_teacher/${userId}`, "http://localhost:5000"),
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
    } else setIsTeacher(data);
  };

  return (
    <>
      <NavBar />
      <Toolbar />
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
            src={userDetails.avatar}
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
            <Typography variant="h6">{userDetails.firstName}</Typography>
            <Typography variant="h6">{userDetails.lastName}</Typography>
            <Typography variant="h6"> {userDetails.email}</Typography>
            <Typography variant="h6">
              {isTeacher ? "Teacher" : "Student"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
