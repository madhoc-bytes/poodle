import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Toolbar,
  Card,
  CardContent,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import { useParams } from "react-router-dom";
import CourseSidebar from "../../components/CourseSidebar";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
  },
  card: {
    width: "400px",
    marginBottom: "10px",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

const StudentCourseClasses = () => {
  const courseId = useParams().courseId;
  const [activeClasses, setActiveClasses] = useState([]);
  const token = localStorage.getItem("token");

  const handleJoinClass = (name) => {
    window.open(`/OnlineClass/${courseId}/${name}`, "_blank");
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const response = await fetch(
      new URL(`/courses/${courseId}/classes`, "http://localhost:5000/"),
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
      setActiveClasses(data);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <CourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <h1>Active Classes</h1>
        </Box>

        <Box sx={styles.container}>
          {activeClasses.map((activeClass) => (
            <Card key={activeClass.id} sx={styles.card}>
              <CardContent sx={styles.cardContent}>
                <Typography variant="h6">{activeClass.name}</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleJoinClass(activeClass.id)}
                >
                  Join
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentCourseClasses;
