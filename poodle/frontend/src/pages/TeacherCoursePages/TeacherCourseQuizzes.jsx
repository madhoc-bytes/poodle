import React, { useEffect, useState } from 'react';
import { Button, Grid, TextField, Typography, Checkbox, FormControlLabel, Box, Radio, RadioGroup, Dialog, DialogTitle, DialogActions, Toolbar, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import NavBar from "../../components/NavBar";
import { useParams } from "react-router";
import CourseSidebar from "../../components/CourseSidebar";

const quizzes = [
    {
      "name": "Quiz 1",
      "id": 1,
      "isDeployed": false
    },
    {
      "name": "Quiz 2",
      "id": 2,
      "isDeployed": false
    },
    {
      "name": "Quiz 3",
      "id": 3,
      "isDeployed": true
    }
];

const TeacherCourseQuizzes = () => {
    // const [quizzes, setQuizzes] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [newQuizName, setNewQuizName] = useState('');
    const [newQuizTimeLimit, setNewQuizTimeLimit] = useState(60);
    const [newQuizDueDate, setNewQuizDueDate] = useState('');
    const [errors, setErrors] = useState({});

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setNewQuizName('');
        setNewQuizTimeLimit(60);
        setNewQuizDueDate('');
    };

    useEffect(() => {
        // fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        // fetch quizzes here
        const response = await fetch(
            // Change the URL when backend is ready
            new URL(`/courses/${useParams().courseId}/quizzes`, 'http://localhost:5000/'),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
        const data = await response.json()
        if (data.error) {
            console.log('ERROR')
        }
        else {
            setQuizzes(data)
            console.log(data);
        }
    }

    const handleDeployQuiz = (quizId) => {
        // handle deploying quiz here

        console.log(`Deploying quiz ${quizId}`);
        window.open(`/teacher/editquiz/${quizId}`, '_blank');
    }

    const handleCreateQuiz = async () => {
        // Perform some checks
        // Make sure quiz name not empty, time limit > 0, due date not empty and valid date time
        let newErrors = {};

        if (newQuizName.trim() === '') {
            newErrors.name = 'Quiz name cannot be empty.';
        }

        if (newQuizTimeLimit <= 0) {
            newErrors.timeLimit = 'Time limit must be greater than 0.';
        }

        if (newQuizDueDate.trim() === '' || isNaN(new Date(newQuizDueDate).getTime())) {
            newErrors.dueDate = 'Invalid due date.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // handle creating the quiz here...
            console.log('Data is valid, proceed to create quiz');
        }
    }

    return (
        <Box sx={{ display: "flex" }}>
          <NavBar />
          <CourseSidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <h1>Course Quizzes</h1>
            </Box>
            {/* Move this button below anywhere */}
            <Button variant="contained" color="secondary" onClick={handleOpenModal}>Create Quiz</Button>
            
            {/* List of quizzes here */}
            <List>
                {quizzes.map((quiz) => (
                    <ListItem key={quiz.id} divider>
                        <ListItemText primary={quiz.name} />
                        <Button
                            variant="contained"
                            color={quiz.isDeployed ? "secondary" : "primary"}
                            disabled={quiz.isDeployed}
                            onClick={() => handleDeployQuiz(quiz.id)}
                        >
                            {quiz.isDeployed ? "Deployed" : "Edit"}
                        </Button>
                    </ListItem>
                ))}
            </List>


            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Create Quiz</DialogTitle>
                <DialogContent>
                <TextField
                    error={!!errors.name}
                    helperText={errors.name}
                    label="Quiz name"
                    value={newQuizName}
                    onChange={(e) => setNewQuizName(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    error={!!errors.timeLimit}
                    helperText={errors.timeLimit}
                    type='number'
                    label="Time Limit (min)"
                    value={newQuizTimeLimit}
                    onChange={(e) => setNewQuizTimeLimit(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    error={!!errors.dueDate}
                    helperText={errors.dueDate}
                    label="Due Date"
                    type='datetime-local'
                    value={newQuizDueDate}
                    onChange={(e) => setNewQuizDueDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                />
                </DialogContent>
                <DialogActions sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Button variant="contained" color="secondary" onClick={handleCreateQuiz}>Create Quiz</Button>
                </DialogActions>
            </Dialog>
            </Box>
        </Box>
    );
}

export default TeacherCourseQuizzes;