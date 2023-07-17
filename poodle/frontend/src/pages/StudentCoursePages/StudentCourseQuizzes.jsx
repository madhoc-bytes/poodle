import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  TextField,
  Container,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import { useParams } from "react-router";
import CourseSidebar from "../../components/CourseSidebar";

// Set dummy quizzes here first
// const quizzes = [
//   {
//     name: "Quiz 1",
//     quizId: 1,
//     dueDate: "2023-07-01T15:30:00.000Z",
//     timeLimit: 1000,
//     mark: null,
//     max_marks: 30,
//     status: "ATTEMPT", // ATTEMPT or IN PROGRESS
//   },
//   {
//     name: "Quiz 2",
//     quizId: 2,
//     dueDate: "2023-07-01T15:30:00.000Z",
//     timeLimit: 1000,
//     mark: 2,
//     max_marks: 30,
//     status: "IN PROGRESS", // ATTEMPT or IN PROGRESS
//   },
//   {
//     name: "Quiz 3",
//     quizId: 3,
//     dueDate: "2023-07-01T15:30:00.000Z",
//     timeLimit: 1000,
//     mark: 17,
//     max_marks: 20,
//     status: "COMPLETE", // ATTEMPT or IN PROGRESS
//   },
// ];

const StudentCourseQuizzes = () => {
  const token = localStorage.getItem("token");
  const courseId = useParams().courseId;

  // const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // console.log("useEffect called");
    fetchQuizzes();
  }, []);

  const handleAttemptQuiz = (quizId) => {
    // Send a POST request with time right now to backend
    let timeStarted = new Date().getTime();
    // Post request

    // Open a new tab with the quiz
    window.open(`/student/${courseId}/quizpage/${quizId}`, "_blank");
  };

  const fetchQuizzes = async () => {
    const response = await fetch(
      // TODO: Change URL when backend is ready
      new URL(
        `/courses/${courseId}/quiz/student-details`,
        "http://localhost:5000/"
      ),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      // TODO: Uncomment this when backend is ready
      setQuizzes(data);
      console.log(data);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <CourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box>
          <h1>Course Quizzes</h1>
        </Box>

        <Box
          sx={{
            p: 2,
            flexGrow: "1",
          }}
        >
          <List>
            {quizzes.map((quiz, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: "#c6c6c6",
                  marginTop: "10px",
                  borderTop: "2px solid grey",
                }}
              >
                <ListItemText>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {quiz.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "95%",
                    }}
                  >
                    <Typography variant="body">
                      Due:{" "}
                      {new Date(quiz.dueDate).toLocaleString("en-UK", {
                        dateStyle: "short",
                        timeStyle: "short",
                        hour12: true,
                      })}
                    </Typography>
                    <Typography variant="body">
                      {" "}
                      Mark: {quiz.status !== "COMPLETE" ? "?" : quiz.mark}/
                      {quiz.maxMarks}
                    </Typography>
                    <Typography variant="body">
                      Time limit: {quiz.timeLimit} mins
                    </Typography>
                  </Box>
                </ListItemText>
                {quiz.status === "Not attempted" ? (
                  <Button
                    variant="contained"
                    onClick={() => handleAttemptQuiz(quiz.id)}
                    color="secondary"
                    sx={{ width: "130px" }}
                  >
                    Attempt
                  </Button>
                ) : quiz.status === "In progress" ? (
                  <Button
                    variant="contained"
                    onClick={() => handleAttemptQuiz(quiz.id)}
                    sx={{
                      width: "130px",
                      whiteSpace: "nowrap",
                      backgroundColor: "#9575de",
                    }}
                  >
                    IN PROGRESS
                  </Button>
                ) : quiz.status === "Past due date" ? (
                  <Button
                    variant="contained"
                    disabled
                    sx={{
                      width: "130px",
                      whiteSpace: "nowrap",
                      backgroundColor: "#9575de",
                    }}
                  >
                    Past due date
                  </Button>
                ) : (
                  <Button variant="contained" disabled sx={{ width: "130px" }}>
                    COMPLETED
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentCourseQuizzes;