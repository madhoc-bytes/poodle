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
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import NavBar from "../../components/NavBar";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const TeacherEditQuiz = () => {
  const [quizName, setQuizName] = useState("");
  const [quizTimeLimit, setQuizTimeLimit] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizDueDate, setQuizDueDate] = useState("");

  const { courseId, quizId } = useParams();
  const navigate = useNavigate();

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

  // Deploying a quiz - POST
  const handleDeployQuiz = async () => {
    console.log("quiz deployed");
    const response = await fetch(
      new URL(`/quiz/${quizId}/deploy`, "http://localhost:5000/"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      alert("ERROR");
    } else {
      alert("Quiz deployed!");
      navigate(`/teacher/${courseId}/Quizzes`);
    }
  };

  const handleUpdateQuizDetails = async () => {
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
      const a = {
        quizName: newQuizName,
        quizDueDate: newQuizDueDate,
        quizTimeLimit: newQuizTimeLimit,
        newQuestions: quizQuestions,
      };
      console.log(a);
      const response = await fetch(
        new URL(`/quiz/${quizId}/edit`, "http://localhost:5000/"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            quizName: newQuizName,
            quizDueDate: newQuizDueDate,
            quizTimeLimit: newQuizTimeLimit,
            newQuestions: quizQuestions,
          }),
        }
      );
      const data = await response.json();
      if (data.error) {
        console.log("ERROR");
      } else {
        fetchQuiz();
        setOpenModal(false);
        console.log(newQuizName);
      }
      // TODO: PUT fetch goes here
    }
  };

  // Variable on current form
  const [currQuestionIndex, setCurrQuestionIndex] = useState(null);
  const [currQuestion, setCurrQuestion] = useState("");
  const [currQuestionType, setCurrQuestionType] = useState(true);
  const [currQuestionAnswers, setCurrQuestionAnswers] = useState([]);
  const [currCorrectAnswer, setCurrCorrectAnswer] = useState("");

  // Initial fetch and update when question is created or updated
  useEffect(() => {
    fetchQuiz();
  }, []);

  // Everytime current Question Index changes, we need to update currQuestion
  useEffect(() => {
    if (currQuestionIndex === null) {
      setCurrQuestion("");
      setCurrQuestionType(true);
      setCurrQuestionAnswers([]);
      setCurrCorrectAnswer("");
    } else {
      setCurrQuestion(quizQuestions[currQuestionIndex].question);
      setCurrQuestionType(quizQuestions[currQuestionIndex].is_multi);
      setCurrQuestionAnswers(quizQuestions[currQuestionIndex].answers);
      setCurrCorrectAnswer(quizQuestions[currQuestionIndex].correct_answer);
    }
  }, [currQuestionIndex]);

  const handleCreateQuestion = async () => {
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

    // PUT route here
    const newQuestionJson = {
      questionName: currQuestion,
      isMulti: currQuestionType,
      answers: currQuestionAnswers,
      correctAnswer: currCorrectAnswer,
    };

    const response = await fetch(
      new URL(`/quiz/${quizId}/create-question`, "http://localhost:5000/"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newQuestionJson),
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      console.log(newQuestionJson);
      fetchQuiz();
      setCurrQuestion("");
      setCurrQuestionType(true);
      setCurrQuestionAnswers([]);
      setCurrCorrectAnswer("");
    }
  };

  const handleEditQuestion = async () => {
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
      is_multi: currQuestionType,
      answers: currQuestionAnswers,
      correct_answer: currCorrectAnswer,
    };

    const newQuestions = [...quizQuestions];
    newQuestions[currQuestionIndex] = editedQuestion;

    const response = await fetch(
      new URL(`/quiz/${quizId}/edit`, "http://localhost:5000/"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          quizName,
          quizDueDate,
          quizTimeLimit,
          newQuestions,
        }),
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      alert(`edited question ${currQuestionIndex + 1}`);
      fetchQuiz();
    }
    console.log(newQuestions);
  };

  const handleDeleteQuestion = async () => {
    // Remove question index and update
    const newQuestions = [...quizQuestions];
    newQuestions.splice(currQuestionIndex, 1);

    const response = await fetch(
      new URL(`/quiz/${quizId}/edit`, "http://localhost:5000/"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          quizName,
          quizDueDate,
          quizTimeLimit,
          newQuestions,
        }),
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      fetchQuiz();
      if (currQuestionIndex === 0) {
        setCurrQuestionIndex(null);
      } else {
        setCurrQuestionIndex(currQuestionIndex - 1);
      }
      alert(`Deleted question ${currQuestionIndex + 1}`);
    }
  };

  // TODO: Fetch quiz here
  const fetchQuiz = async () => {
    // setQuizQuestions(quiz.questions);

    const response = await fetch(
      // Change the URL when backend is ready
      new URL(`/quiz/${quizId}/info`, "http://localhost:5000/"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      console.log(data);
      setQuizName(data.quiz.name);
      setQuizTimeLimit(data.quiz.time_limit);
      setQuizDueDate(data.quiz.due_date);
      setQuizQuestions(data.quiz.questions);
      console.log(quizDueDate);
    }
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
              Due Date:{quizDueDate}
              {/* {new Date(quizDueDate).toLocaleString("en-UK", {
                dateStyle: "short",
                timeStyle: "short",
                hour12: true,
              })} */}
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
            {quizQuestions.map((_question, index) => (
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
                    <Delete />
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
                      <Delete />
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
