import { Box, Button, Dialog, DialogActions, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Radio, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';

const quiz = {
    "name": "Quiz 1",
    "id": 1,
    "dueDate": "2023-07-14T20:00",
    "timeLimit": 1000,
    "questions": [
        {
            "question": "What is a penguin?",
            "isMulti": true,
            "answers": ["a bird", "a plane", "a pp", "cock"],
            "correctAnswer": "a bird"
        },
        {
            "question": "whats 1+1",
            "isMulti": false,
            "answers": [],
            "correctAnswer": "2"
        },
    ]
}

const TeacherEditQuiz = () => {
    const [quizName, setQuizName] = useState('');
    const [quizTimeLimit, setQuizTimeLimit] = useState(0);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizDueDate, setQuizDueDate] = useState('');

    // Initial fetch and update when question is created or updated
    useEffect(() => {
        fetchQuiz();
    }, []);


    // Deploying a quiz - POST
    const handleDeployQuiz = () => {
        console.log("quiz deployed");
    };

    // Modal functions and values
    const [openModal, setOpenModal] = useState(false);
    const [newQuizName, setNewQuizName] = useState(quizName);
    const [newQuizTimeLimit, setNewQuizTimeLimit] = useState(quizTimeLimit);
    const [newQuizDueDate, setNewQuizDueDate] = useState(quizDueDate);
    const [errors, setErrors] = useState({});

    const handleOpenModal = () => {
        setOpenModal(true);
        setNewQuizName(quizName);
        setNewQuizTimeLimit(quizTimeLimit);
        setNewQuizDueDate(quizDueDate);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        // setErrors({});
        setNewQuizName(quizName);
        setNewQuizTimeLimit(quizTimeLimit);
        setNewQuizDueDate(quizDueDate);
    };

    const handleUpdateQuizDetails = () => {
        // Check for errors
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
            // TODO: PUT fetch goes here
            setOpenModal(false);
            setQuizName(newQuizName);
            setQuizTimeLimit(newQuizTimeLimit);
            setQuizDueDate(newQuizDueDate);
        }
    }

    // Variable on current form
    const [currQuestionIndex, setCurrQuestionIndex] = useState(null);
    const [currQuestion, setCurrQuestion] = useState("");
    const [currQuestionType, setCurrQuestionType] = useState(true);
    const [currQuestionAnswers, setCurrQuestionAnswers] = useState([]);
    const [currCorrectAnswer, setCurrCorrectAnswer] = useState("");

    // Everytime current Question Index changes, we need to update currQuestion
    useEffect(() => {
        if (currQuestionIndex === null) {
            setCurrQuestion("");
            setCurrQuestionType(true);
            setCurrQuestionAnswers([]);
            setCurrCorrectAnswer("");
        } else {
            setCurrQuestion(quizQuestions[currQuestionIndex].question);
            setCurrQuestionType(quizQuestions[currQuestionIndex].isMulti);
            setCurrQuestionAnswers(quizQuestions[currQuestionIndex].answers);
            setCurrCorrectAnswer(quizQuestions[currQuestionIndex].correctAnswer);
        }
    }, [currQuestionIndex])

    const handleCreateQuestion = () => {
        // Perform error checks here
        // Question string can't be empty
        if (currQuestion.trim() === '') {
            alert('Quiz name cannot be empty.');
            return;
        }
        // Multiple choice needs at least 2 values
        if (currQuestionType && currQuestionAnswers.length < 2) {
            alert('must need at least 2 answer options')
            return;
        }
        
        // correct answer can't be empty
        if (currCorrectAnswer.trim() === '') {
            alert('correct answer cannot be empty');
            return;
        }

        // Answer cannot be empty
        if (currQuestionType && currQuestionAnswers.some(str => str === "")) {
            alert("can't have empty answers");
            return;
        }

        setQuizQuestions([...quizQuestions, {
            "question": currQuestion,
            "isMulti": currQuestionType,
            "answers": currQuestionAnswers,
            "correctAnswer": currCorrectAnswer
        }])

        // Clear inputs
        setCurrQuestion("");
        setCurrQuestionType(true);
        setCurrQuestionAnswers([]);
        setCurrCorrectAnswer("");

        // PUT route here

    }

    const handleDeleteQuestion = () => {
        // Remove question index and update
        const newQuestions = [...quizQuestions];
        newQuestions.splice(currQuestionIndex, 1);
        setQuizQuestions(newQuestions);
        
        if (currQuestionIndex === 0) {
            setCurrQuestionIndex(null);
        } else {
            setCurrQuestionIndex(currQuestionIndex - 1);
        }
        // TODO: fetch request here


    }


    // TODO: Fetch quiz here
    const fetchQuiz = () => {
        setQuizName(quiz.name);
        setQuizTimeLimit(quiz.timeLimit);
        setQuizDueDate(quiz.dueDate);
        setQuizQuestions(quiz.questions);
    }

    const addAnswer = () => {
        setCurrQuestionAnswers([...currQuestionAnswers, '']);
        console.log(currQuestionAnswers)
    };

    const updateAnswers = (value, index) => {
        const newAnswers = [...currQuestionAnswers];
        newAnswers[index] = value;
        setCurrQuestionAnswers(newAnswers);
        console.log(currQuestionAnswers)
    };

    const deleteAnswer = (index) => {
        const newAnswers = [...currQuestionAnswers];
        newAnswers.splice(index, 1);
        setCurrQuestionAnswers(newAnswers);
        if (currCorrectAnswer === currQuestionAnswers[index]) {
            setCurrCorrectAnswer('');
        }
    };
    

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "lightblue", height: "100vh"}}>
                {/* Title */}
                <Box sx={{ margin: "0 auto"}}>
                    <Typography variant="h2">Edit Quiz</Typography>
                </Box>

                {/* Time limit, name, due date and deploy button goes here */}
                <Box sx={{ display: "flex", backgroundColor: "pink"}}>
                    <Typography variant="h5">Time Limit: {quizTimeLimit}</Typography>
                    <Typography variant="h5">Name: {quizName}</Typography>
                    <Typography variant="h5">Due Date: {quizDueDate}</Typography>
                    <Button variant="contained" color="secondary" onClick={handleOpenModal}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={handleDeployQuiz}>Deploy</Button>
                </Box>

                <Box sx={{ display: "flex", backgroundColor: "lightgreen", flexGrow: 1}}>
                    {/* Side bar for questions */}
                    <Box sx={{ width: "25%", display: "flex", flexDirection: "column", backgroundColor: "yellow"}}>
                        <Button variant="contained" color="secondary" onClick={() => setCurrQuestionIndex(null)}>Create Question</Button>
                        {quizQuestions.map((question, index) => (
                            // Can change below to list item    
                            <Button 
                                key={index}
                                onClick={() => setCurrQuestionIndex(index)}
                                sx={{
                                    backgroundColor: currQuestionIndex === index ? "#B19CD7" : "#FFE6EE",
                                    "&:hover": {
                                        backgroundColor: "#B19CD7",
                                    },
                                }}
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </Box>
                    
                    {/* If currQuestionIndex is null, show create question form */}
                    <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "lightblue", flexGrow: 1}}>
                        {/* The Create question or edit question */}
                        <Typography variant="h6">{currQuestionIndex === null ? "Create New Question": "Edit Question"}</Typography>

                        {/* Question goes here */}
                        <TextField
                            label="Question"
                            value={currQuestion}
                            onChange={(e) => setCurrQuestion(e.target.value)}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        {/* Question Type */}
                        <FormControl>
                            <InputLabel>Question Type</InputLabel>
                            <Select
                                value={currQuestionType}
                                onChange={(e) => setCurrQuestionType(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            >
                                <MenuItem value={true}>Multiple-choice</MenuItem>
                                <MenuItem value={false}>Open-ended</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Answers here. If not multi, show an input */}
                        <Typography variant="h6">Answers</Typography>
                         
                        {currQuestionType ? (
                            <>
                            {currQuestionAnswers.map((answer, index) => (
                                <Box display="flex" alignItems="center" key={index}>
                                    <Radio
                                        checked={currCorrectAnswer !== "" && answer === currCorrectAnswer}
                                        onChange={() => setCurrCorrectAnswer(answer)}
                                        color='primary'
                                    />
                                    <TextField
                                        // error={(e) => e.target.value === ''}
                                        value={answer}
                                        onChange={(e) => updateAnswers(e.target.value, index)}
                                        variant='outlined'
                                        margin='normal'
                                    />
                                    <IconButton onClick={() => deleteAnswer(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button variant="contained" color="primary" onClick={addAnswer}>
                                Add Answer
                            </Button>
                            </>
                        ) : (
                            // Open Ended question -> only include input
                            <TextField
                                label="Set Correct Answer"
                                value={currCorrectAnswer}
                                onChange={(e) => setCurrCorrectAnswer(e.target.value)}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            />
                        )}

                        {/* Delete an existing question or create new question*/}
                        {currQuestionIndex !== null ?
                            <Button variant="contained" color="primary" onClick={handleDeleteQuestion}>
                                Delete Question
                            </Button>
                            :
                            <Button variant="contained" color="primary" onClick={handleCreateQuestion}>
                                Create Question
                            </Button>
                        }

                    </Box>

                </Box>

            </Box>

            {/* Modal to edit time limit, name and due date */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to submit?"}</DialogTitle>
                <DialogActions>
                    <TextField
                        error={!!errors.timeLimit}
                        helperText={errors.timeLimit}
                        type='number'
                        label="Time Limit (min)"
                        value={newQuizTimeLimit}
                        onChange={(e) => {console.log(newQuizTimeLimit); setNewQuizTimeLimit(e.target.value)}}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
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
                <Button onClick={handleCloseModal} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleUpdateQuizDetails} color="primary" autoFocus>
                    Update
                </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TeacherEditQuiz;