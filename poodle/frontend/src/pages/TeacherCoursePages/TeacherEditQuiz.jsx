import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Drawer,
  List,
  ListItemButton,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  Select,
  TextField,
  Typography,
  Toolbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/NavBar";

const quiz = {
  name: "Quiz 1",
  id: 1,
  dueDate: "2023-07-14T20:00",
  timeLimit: 1000,
  questions: [
    {
      question: "What is a penguin?",
      isMulti: true,
      answers: ["a bird", "a plane", "a pp", "cock"],
      correctAnswer: "a bird",
    },
    {
      question: "whats 1+1",
      isMulti: false,
      answers: [],
      correctAnswer: "2",
    },
  ],
};

const TeacherEditQuiz = () => {
  const [quizName, setQuizName] = useState("");
  const [quizTimeLimit, setQuizTimeLimit] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizDueDate, setQuizDueDate] = useState("");

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
    if (newQuizName.trim() === "") {
      newErrors.name = "Quiz name cannot be empty.";
    }
    if (newQuizTimeLimit <= 0) {
      newErrors.timeLimit = "Time limit must be greater than 0.";
    }
    if (
      newQuizDueDate.trim() === "" ||
      isNaN(new Date(newQuizDueDate).getTime())
    ) {
      newErrors.dueDate = "Invalid due date.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: PUT fetch goes here
      setOpenModal(false);
      setQuizName(newQuizName);
      setQuizTimeLimit(newQuizTimeLimit);
      setQuizDueDate(newQuizDueDate);
    }
  };

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
  }, [currQuestionIndex]);

  const handleCreateQuestion = () => {
    // Perform error checks here
    // Question string can't be empty
    if (currQuestion.trim() === "") {
      alert("Quiz name cannot be empty.");
      return;
    }
    // Multiple choice needs at least 2 values
    if (currQuestionType && currQuestionAnswers.length < 2) {
      alert("must need at least 2 answer options");
      return;
    }

    // correct answer can't be empty
    if (currCorrectAnswer.trim() === "") {
      alert("correct answer cannot be empty");
      return;
    }

    // Answer cannot be empty
    if (currQuestionType && currQuestionAnswers.some((str) => str === "")) {
      alert("can't have empty answers");
      return;
    }

    setQuizQuestions([
      ...quizQuestions,
      {
        question: currQuestion,
        isMulti: currQuestionType,
        answers: currQuestionAnswers,
        correctAnswer: currCorrectAnswer,
      },
    ]);

    // Clear inputs
    setCurrQuestion("");
    setCurrQuestionType(true);
    setCurrQuestionAnswers([]);
    setCurrCorrectAnswer("");

    // PUT route here
  };

  const handleEditQuestion = () => {
    // Perform error checks here
    // Question string can't be empty
    if (currQuestion.trim() === "") {
      alert("Quiz name cannot be empty.");
      return;
    }
    // Multiple choice needs at least 2 values
    if (currQuestionType && currQuestionAnswers.length < 2) {
      alert("must need at least 2 answer options");
      return;
    }

    // correct answer can't be empty
    if (currCorrectAnswer.trim() === "") {
      alert("correct answer cannot be empty");
      return;
    }

    // Answer cannot be empty
    if (currQuestionType && currQuestionAnswers.some((str) => str === "")) {
      alert("can't have empty answers");
      return;
    }

    const editedQuestion = {
      question: currQuestion,
      isMulti: currQuestionType,
      answers: currQuestionAnswers,
      correctAnswer: currCorrectAnswer,
    };

    const editedQuestions = [...quizQuestions];
    editedQuestions[currQuestionIndex] = editedQuestion;
    setQuizQuestions(editedQuestions);

    // Clear inputs
    alert(`Successfully edited Question ${currQuestionIndex + 1}`);
    // PUT route here
  };

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
    alert(`Deleted question ${currQuestionIndex + 1}`);
    // TODO: fetch request here
  };

  // TODO: Fetch quiz here
  const fetchQuiz = () => {
    setQuizName(quiz.name);
    setQuizTimeLimit(quiz.timeLimit);
    setQuizDueDate(quiz.dueDate);
    setQuizQuestions(quiz.questions);
  };

  const addAnswer = () => {
    setCurrQuestionAnswers([...currQuestionAnswers, ""]);
    console.log(currQuestionAnswers);
  };

  const updateAnswers = (value, index) => {
    const newAnswers = [...currQuestionAnswers];
    newAnswers[index] = value;
    setCurrQuestionAnswers(newAnswers);
    console.log(currQuestionAnswers);
  };

  const deleteAnswer = (index) => {
    const newAnswers = [...currQuestionAnswers];
    newAnswers.splice(index, 1);
    setCurrQuestionAnswers(newAnswers);
    if (currCorrectAnswer === currQuestionAnswers[index]) {
      setCurrCorrectAnswer("");
    }
  };

  return (
    <Box>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          marginTop: "64px",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "16px",
            borderBottom: "2px solid black",
          }}
        >
          <div>
            <Typography variant="h4">
              <b>{quizName}</b>
            </Typography>
            <Typography variant="h6">Time Limit: {quizTimeLimit}</Typography>
            <Typography variant="h6">
              Due Date:{" "}
              {new Date(quizDueDate).toLocaleString("en-UK", {
                dateStyle: "short",
                timeStyle: "short",
                hour12: true,
              })}
            </Typography>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              sx={{ marginRight: "100px" }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDeployQuiz}
            >
              Deploy
            </Button>
          </div>
        </Box>
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: {
              width: "200px",
              marginTop: "188px",
            },
          }}
        >
          <Toolbar />
          <List>
            <ListItemButton
              onClick={() => setCurrQuestionIndex(null)}
              sx={{
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                sx={{ fontSize: "13px" }}
              >
                Create Question
              </Button>
            </ListItemButton>
            {quizQuestions.map((question, index) => (
              <ListItemButton
                key={index}
                onClick={() => setCurrQuestionIndex(index)}
                sx={{
                  backgroundColor:
                    currQuestionIndex === index ? "#B19CD7" : "#FFE6EE",
                  "&:hover": {
                    backgroundColor: "#B19CD7",
                  },
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <b>Question {index + 1}</b>
              </ListItemButton>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            marginLeft: "200px",
            padding: "0 20px",
          }}
        >
          <Box
            sx={{
              padding: "0 300px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6">
                <b>
                  {currQuestionIndex === null
                    ? "Create New Question"
                    : `Edit Question ${currQuestionIndex + 1}`}
                </b>
              </Typography>
              {currQuestionIndex !== null ? (
                <>
                  <IconButton
                    onClick={handleDeleteQuestion}
                    sx={{
                      verticalAlign: "middle",
                      marginLeft: "5px",
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              ) : (
                <></>
              )}
            </div>

            {/* Question goes here */}
            <TextField
              label="Question"
              value={currQuestion}
              onChange={(e) => setCurrQuestion(e.target.value)}
              variant="outlined"
            />
            {/* Question Type */}
            <FormControl>
              <InputLabel id="question-type-label">Question Type</InputLabel>
              <Select
                label="Question Type"
                labelId="question-type-label"
                value={currQuestionType}
                onChange={(e) => setCurrQuestionType(e.target.value)}
                variant="outlined"
              >
                <MenuItem value={true}>Multiple choice</MenuItem>
                <MenuItem value={false}>Open ended</MenuItem>
              </Select>
            </FormControl>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Answers here. If not multi, show an input */}
              <Typography variant="h6">
                {currQuestionType ? "Answers" : "Answer"}
              </Typography>
              {currQuestionType ? (
                <>
                  <IconButton
                    onClick={addAnswer}
                    sx={{
                      verticalAlign: "middle",
                      marginLeft: "5px",
                    }}
                  >
                    <AddIcon
                      sx={{ color: "rgb(156,39,176)", fontSize: "30px" }}
                    />
                  </IconButton>
                </>
              ) : (
                <></>
              )}
            </div>

            {currQuestionType ? (
              <>
                {currQuestionAnswers.map((answer, index) => (
                  <Box
                    display="flex"
                    sx={{ gap: "8px" }}
                    alignItems="center"
                    key={index}
                  >
                    <Radio
                      checked={
                        currCorrectAnswer !== "" && answer === currCorrectAnswer
                      }
                      onChange={() => setCurrCorrectAnswer(answer)}
                      color="primary"
                    />
                    <TextField
                      value={answer}
                      onChange={(e) => updateAnswers(e.target.value, index)}
                      variant="outlined"
                    />
                    <IconButton onClick={() => deleteAnswer(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </>
            ) : (
              // Open Ended question -> only include input
              <TextField
                label="Set Correct Answer"
                value={currCorrectAnswer}
                onChange={(e) => setCurrCorrectAnswer(e.target.value)}
                variant="outlined"
              />
            )}

            {/* Delete an existing question or create new question*/}
            {currQuestionIndex !== null ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEditQuestion}
                sx={{ width: "300px", margin: "auto" }}
              >
                Edit Question
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCreateQuestion}
                sx={{ width: "300px", margin: "auto" }}
              >
                Create Question
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle id="alert-dialog-title">
          <b>Edit quiz parameters</b>
        </DialogTitle>
        <DialogActions
          sx={{ display: "flex", flexDirection: "column", padding: "0 50px" }}
        >
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
            type="number"
            label="Time Limit (min)"
            value={newQuizTimeLimit}
            onChange={(e) => {
              console.log(newQuizTimeLimit);
              setNewQuizTimeLimit(e.target.value);
            }}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            error={!!errors.dueDate}
            helperText={errors.dueDate}
            label="Due Date"
            type="datetime-local"
            value={newQuizDueDate}
            onChange={(e) => setNewQuizDueDate(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

          <Button
            onClick={handleUpdateQuizDetails}
            color="secondary"
            variant="contained"
            sx={{ margin: "20px 0" }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherEditQuiz;
