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
const quizzes = [
    {
      "name": "Quiz 1",
      "quizId": 1,
      "dueDate": "2023-07-01T15:30:00.000Z",
      "timeLimit": 1000,
      "mark": null,
      "max_marks": 30,
      "status": "ATTEMPT" // ATTEMPT or IN PROGRESS
    },
    {
      "name": "Quiz 2",
      "quizId": 2,
      "dueDate": "2023-07-01T15:30:00.000Z",
      "timeLimit": 1000,
      "mark": 2,
      "max_marks": 30,
      "status": "IN PROGRESS", // ATTEMPT or IN PROGRESS
    },
    {
      "name": "Quiz 3",
      "quizId": 3,
      "due_date": "2023-07-01T15:30:00.000Z",
      "timeLimit": 1000,
      "mark": 17,
      "max_marks": 20,
      "status": "COMPLETE", // ATTEMPT or IN PROGRESS
    },
];

const QuizCard = ({ quiz }) => {
    let due_date = new Date(quiz.dueDate);
    let formatted_date = `${due_date.getDate()}/${
        due_date.getMonth() + 1
    }/${due_date.getFullYear()} ${due_date.getHours()}:${due_date.getMinutes()} ${
        due_date.getHours() < 12 ? "AM" : "PM"
    }`;

    // Might need to format time limit also

    return (
        <Card sx={{ minWidth: 275, m: 2 }}>
            <CardContent>
                <Typography variant="h5">{quiz.name}</Typography>
                <Typography variant="body2">Due Date: {formatted_date}</Typography>
                {/* If status is not Complete, show ? */}
                <Typography variant="body2">Mark: {quiz.status !== "COMPLETE" ? "?" : quiz.mark}/{quiz.max_marks}</Typography>
                {/* Only attempt button is clickable */}
                <Typography variant="body2">Time limit: {quiz.timeLimit} </Typography>
                {quiz.status == "ATTEMPT"
                    ? <Button variant="contained">Attempt</Button>
                    : quiz.status == "IN PROGRESS"
                        ? <Button variant="contained" disabled>IN PROGRESS</Button>
                        : <Button variant="contained" disabled>COMPLETE</Button>
                }
            </CardContent>
        </Card>
    );
}

const StudentCourseQuizzes = () => {
    const token = localStorage.getItem("token");
    // const navigate = useNavigate();
    // const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        console.log("useEffect called");
        // fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        const response = await fetch(
            // TODO: Change URL when backend is ready
            new URL("/DUMMYURL", "http://localhost:5000/"),
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
            // setQuizzes(data);
            console.log(data);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
        <NavBar />
        <CourseSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />

            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            >
            {quizzes.map((quiz, index) => (
                <QuizCard key={index} quiz={quiz} />
            ))}
            </Box>

        </Box>
        </Box>
    )
}

export default StudentCourseQuizzes;