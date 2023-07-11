import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

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
            "correctAnswer": "2"
        },
    ]
}

const TeacherEditQuiz = () => {
    const [quizName, setQuizName] = useState('');
    const [quizTimeLimit, setQuizTimeLimit] = useState(0);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizDueDate, setQuizDueDate] = useState('');

    const [newQuestion, setNewQuestion] = useState({
        "question": "",
        "isMulti": true,
        "correctAnswer": ""
    });
    // const [newQuestionQuestion, setNewQuestionQuestion] = useState("");
    // const [newQuestionType, setNewQuestionType] = useState(true)
    // const [newQuestionAnswers, setNewQuestionAnswers] = useState([])

    const [currQuestionIndex, setCurrentQuestionIndex] = useState(null);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = () => {
        setQuizName(quiz.name);
        setQuizTimeLimit(quiz.timeLimit);
        setQuizDueDate(quiz.dueDate);
        setQuizQuestions(quiz.questions);
    }


    const handleDeployQuiz = () => {
        let newErrors = {};

        if (quizName.trim() === '') {
            newErrors.name = 'Quiz name cannot be empty.';
        }

        if (quizTimeLimit <= 0) {
            newErrors.timeLimit = 'Time limit must be greater than 0.';
        }

        if (quizDueDate.trim() === '' || isNaN(new Date(newQuizDueDate).getTime())) {
            newErrors.dueDate = 'Invalid due date.';
        }


    }

    const addAnswer = () => {
        setAnswers([...answers, '']);
    };

    const updateAnswer = (value, index) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const deleteAnswer = (index) => {
        const newAnswers = [...answers];
        newAnswers.splice(index, 1);
        setAnswers(newAnswers);
        if (correctAnswer === answers[index]) {
            setCorrectAnswer('');
        }
    };
    

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "lightblue", height: "100vh"}}>
                {/* Quiz Name */}
                <Box sx={{ margin: "0 auto"}}>
                    <Typography variant="h2">Edit Quiz</Typography>
                </Box>

                <Box sx={{ display: "flex", backgroundColor: "pink"}}>
                    <TextField
                        error={!!errors.timeLimit}
                        helperText={errors.timeLimit}
                        type='number'
                        label="Time Limit (min)"
                        value={quizTimeLimit}
                        onChange={(e) => setQuizTimeLimit(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        error={!!errors.name}
                        helperText={errors.name}
                        label="Quiz name"
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                    <TextField
                        error={!!errors.dueDate}
                        helperText={errors.dueDate}
                        label="Due Date"
                        type='datetime-local'
                        value={quizDueDate}
                        onChange={(e) => setQuizDueDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button variant="contained" color="secondary" onClick={handleDeployQuiz}>Deploy</Button>
                </Box>

                <Box sx={{ display: "flex", backgroundColor: "lightgreen", flexGrow: 1}}>
                    {/* Side bar for questions */}
                    <Box sx={{ width: "25%", display: "flex", flexDirection: "column", backgroundColor: "yellow"}}>
                        <Button variant="contained" color="secondary" onClick={() => setCurrentQuestionIndex(null)}>Add Question</Button>
                        {quizQuestions.map((question, index) => (
                            // Can change below to list item    
                            <Button 
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
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
                        <Typography variant="h6">{currQuestionIndex === null ? "Create Question": "Edit Question"}</Typography>
                        {currQuestionIndex === null ? (
                            <>
                            <TextField
                            label="Question"
                            onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            />
                            <FormControl>
                                <InputLabel>Question Type</InputLabel>
                                <Select
                                    value={newQuestion.isMulti}
                                    onChange={(e) => setNewQuestion({...newQuestion, isMulti: e.target.value})}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                >
                                    <MenuItem value={true}>Multiple-choice</MenuItem>
                                    <MenuItem value={false}>Open-ended</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography variant="h6">Answers</Typography>
                            {newQuestion.isMulti ? (
                                <>
                                <Button variant="contained" color="secondary">Add Answer</Button>


                                </>
                            ) : (
                                <>
                                <TextField
                                    label="Answer"
                                    onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                />
                                </>
                            )}
                            </>
                        ) : (
                            <>
                            {/* <TextField
                                // label="Question"
                                value={currQuestionIndex === null ? "" : quizQuestions[currQuestionIndex].question}
                                onChange={(e) => setQuizQuestions({...quizQuestions, [currQuestionIndex]: {...quizQuestions[currQuestionIndex], question: e.target.value}})}
                                fullWidth
                                margin="normal"
                                variant="outlined"
                            /> */}
                            <FormControl>
                                <InputLabel>Question Type</InputLabel>
                                <Select
                                    value={currQuestionIndex === null ? "" : quizQuestions[currQuestionIndex].isMulti}
                                    onChange={(e) => setQuizQuestions({...quizQuestions, [currQuestionIndex]: {...quizQuestions[currQuestionIndex], isMulti: e.target.value}})}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                >
                                    <MenuItem value={true}>Multiple-choice</MenuItem>
                                    <MenuItem value={false}>Open-ended</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography variant="h6">Answers</Typography>
                            {quizQuestions[currQuestionIndex].answers.map((answer, index) => (
                            <Box display="flex" alignItems="center" key={index}>
                                <Radio
                                    checked={correctAnswer === answer}
                                    onChange={() => setCorrectAnswer(answer)}
                                    color="primary"
                                />
                                <TextField
                                    value={answer}
                                    onChange={(e) => updateAnswer(e.target.value, index)}
                                    variant="outlined"
                                    margin="normal"
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
                        )}                            
                    </Box>

                </Box>

            </Box>
        </>
    )
}

export default TeacherEditQuiz;