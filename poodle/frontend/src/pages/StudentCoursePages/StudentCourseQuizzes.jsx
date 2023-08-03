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

const StudentCourseQuizzes = () => {
  const token = localStorage.getItem("token");
  const courseId = useParams().courseId;

  // const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAttemptQuiz = async (quizId) => {
    // Post request
    const response = await fetch(
      new URL(`/quiz/${quizId}/student-attempt`, "http://localhost:5000/"),
      {
        method: "POST",
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
      // Open a new tab with the quiz
      window.open(`/student/${courseId}/quizpage/${quizId}`, "_blank");
      fetchQuizzes();
    }
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
      setQuizzes(data);
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
                      Due: {quiz.dueDate.slice(0, -7)}{" "}
                    </Typography>
                    <Typography variant="body">
                      {" "}
                      Mark: {quiz.status !== "Completed" ? "?" : quiz.score}/
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
                    onClick={() =>
                      window.open(
                        `/student/${courseId}/quizpage/${quiz.id}`,
                        "_blank"
                      )
                    }
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
