import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Modal,
  TextField,
  Button,
  Alert,
  Toolbar,
} from "@mui/material";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import DashboardTimeline from "../components/DashboardTimeline";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  card: {
    width: "150px",
    height: "150px",
    margin: "14px",
    transition: "all 0.15s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "rgb(149,117,222)",
    },
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

const StudentDashboard = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    console.log(token);
    fetchCourses();
  }, []);

  const handleCardClick = (course) => {
    navigate(`/student/${course}/Participants`);
  };

  const fetchCourses = async () => {
    const response = await fetch(
      new URL("/dashboard/course-list", "http://localhost:5000/"),
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
      setCourses(data);
      console.log(data);
    }
  };

  return (
    <>
      <NavBar />
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            display: "flex",
            margin: "20px 30px",
            width: "50%",
            flexDirection: "column",
          }}
        >
          <Box>
            {/* Courses */}
            <Typography variant="h3" component="h1" align="center" gutterBottom>
              Courses
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            {courses.map((course) => (
              <Card
                key={course.id}
                sx={styles.card}
                onClick={() => handleCardClick(course.id)}
              >
                <CardContent
                  sx={{
                    wordWrap: "break-word",
                  }}
                >
                  <Typography variant="h7" component="div">
                    <strong>{course.name}</strong>
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
        {/* Calendar */}
        <Box sx={{ width: "50%", height: "100vh" }}>
          <DashboardTimeline />
        </Box>
      </Box>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          borderLeft: "2px solid black",
        }}
      />
    </>
  );
};

export default StudentDashboard;
