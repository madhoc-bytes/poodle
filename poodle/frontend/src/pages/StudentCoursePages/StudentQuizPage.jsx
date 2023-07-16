import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Drawer,
  Checkbox,
  FormControlLabel,
  Box,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogActions,
  Toolbar,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const StudentQuizPage = () => {
  const [quiz, setQuiz] = useState({
    name: "Quiz 1",
    quizId: 1,
    timeStarted: "2023-07-01T15:30:00.000Z",
    timeLimit: 1030400,
    questions: [
      {
        question: "What is a penguin?",
        isMulti: true,
        answers: ["a bird", "a plane", "a pp", "cock"],
        correctAnswer: "a bird",
      },
      {
        question: "What is 1+1?",
        isMulti: false,
        correctAnswer: "2",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
      {
        question: "is eddy the most little bro?",
        isMulti: true,
        answers: ["ye", "nah"],
        correctAnswer: "ye",
      },
    ],
  });

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(0, 0, 0)", // Pink color for the selected radio button
      },
    },
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(null);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);

  const [currScore, setCurrScore] = useState(0);

  const handleClickOpen = () => {
    setOpenSubmitModal(true);
  };

  const handleClose = () => {
    setOpenSubmitModal(false);
  };

  const handleSubmit = () => {
    console.log("test submitted");
    // This will probably redirect you to another page saying test submitted
  };

  // Time remaining
  useEffect(() => {
    const interval = setInterval(() => {
      const timeStarted = new Date(quiz.timeStarted);
      const now = new Date();
      const timeLimitMilliseconds = quiz.timeLimit * 1000;
      const timeElapsed = now.getTime() - timeStarted.getTime();
      const timeRemaining = timeLimitMilliseconds - timeElapsed;
      const secondsLeft = Math.floor(timeRemaining / 1000);

      if (secondsLeft < 0) {
        clearInterval(interval);
        setTimeLeft("Time's Up!");
      } else {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = Math.floor(secondsLeft % 60);
        setTimeLeft(`${hours}hrs ${minutes}min ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz.timeStarted, quiz.timeLimit]);

  // Calculate the current score
  useEffect(() => {
    let count = 0;
    for (let key in selectedAnswers) {
      if (selectedAnswers[key] === quiz.questions[key].correctAnswer) {
        count++;
      }

      setCurrScore(count);
      // TODO: send put request here to update score
    }
    // Loop through selected answer and see how many are correct
  }, [selectedAnswers]);

  const goNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // setState({...state, currentQuestionIndex: state.currentQuestionIndex - 1});
    }
  };

  const handleAnswerChange = (e) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: e.target.value,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Toolbar />
      {/* Quiz Name */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 50px",
          borderBottom: "2px solid black",
        }}
      >
        <Typography variant="h7">Time Remaining: {timeLeft}</Typography>

        <Typography variant="h2">
          <b>{quiz.name}</b>
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleClickOpen}>
          Submit
        </Button>
      </Box>
      <Drawer
        variant="permanent"
        sx={{ justifyContent: "center" }}
        PaperProps={{
          sx: {
            width: "260px",
            marginTop: "158px",
            alignItems: "center",
            padding: "20px",
          },
        }}
      >
        <Grid container>
          <Grid item>
            {quiz.questions.map((question, index) => (
              <Button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                variant="contained"
                sx={{
                  minWidth: "46px",
                  minHeight: "46px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  margin: "2.4px",
                  backgroundColor:
                    currentQuestionIndex === index
                      ? "rgb(156,39,176)"
                      : "#f0f0f0",
                  color: currentQuestionIndex === index ? "#fff" : "#000",
                  "&:hover": {
                    backgroundColor: "rgb(156,39,176)",
                    color: "#fff",
                  },
                }}
              >
                {index + 1}
              </Button>
            ))}
          </Grid>
        </Grid>

        {/* Delete this below */}
        <Typography variant="h7">Score: {currScore}</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            padding: "10px",
            width: "100%",
          }}
        >
          <Button
            onClick={goPrevious}
            sx={{
              backgroundColor: "#f0f0f0",
              color: "black",
              borderRadius: "50%",
              minWidth: "50px",
              minHeight: "50px",
              "&:hover": {
                backgroundColor: "rgb(156,39,176)",
                color: "white",
              },
            }}
          >
            <ArrowBack />
          </Button>
          <Button
            onClick={goNext}
            sx={{
              backgroundColor: "#f0f0f0",
              color: "black",
              borderRadius: "50%",
              minWidth: "50px",
              minHeight: "50px",
              "&:hover": {
                backgroundColor: "rgb(156,39,176)",
                color: "white",
              },
            }}
          >
            <ArrowForward />
          </Button>
        </Box>
      </Drawer>
      <Box marginLeft={"300px"}>
        <Box
          sx={{
            marginLeft: "auto",
            marginRight: "auto",
            padding: "20px",
            minWidth: "600px",
            maxWidth: "900px",
          }}
        >
          {/* <Grid item> */}
          <Typography variant="h6" sx={{ margin: "10px 0 30px 0" }}>
            {quiz.questions[currentQuestionIndex].question}
          </Typography>
          {quiz.questions[currentQuestionIndex].isMulti ? (
            quiz.questions[currentQuestionIndex].answers.map(
              (answer, index) => (
                <RadioGroup
                  value={selectedAnswers[currentQuestionIndex] || ""}
                  onChange={handleAnswerChange}
                >
                  <FormControlLabel
                    key={index}
                    value={answer}
                    control={<Radio />}
                    label={answer}
                    sx={{
                      backgroundColor:
                        selectedAnswers[currentQuestionIndex] === answer
                          ? "rgb(149,117,222)"
                          : "#f0f0f0",
                      borderRadius: "5px",
                      margin: "10px 20px",
                      padding: "10px",
                      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                      "& .MuiFormControlLabel-label": {
                        color:
                          selectedAnswers[currentQuestionIndex] === answer
                            ? "#fff"
                            : "#000",
                      },
                      "&:hover": {
                        backgroundColor: "rgb(149,117,222)",
                      },
                    }}
                  />
                </RadioGroup>
              )
            )
          ) : (
            <TextField
              label="Answer"
              // variant="outlined"
              value={selectedAnswers[currentQuestionIndex] || ""}
              onChange={handleAnswerChange}
              fullWidth
              // sx={{ margin: "10px 0" }}
            />
          )}
        </Box>
      </Box>

      {/* Prev and Next question */}
      <Dialog
        open={openSubmitModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to submit?"}
        </DialogTitle>
        <DialogActions
          sx={{ display: "flex", flexDirection: "column", padding: "0 50px" }}
        >
          <Button
            onClick={handleSubmit}
            color="secondary"
            variant="contained"
            sx={{ margin: "0 0 20px 0" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default StudentQuizPage;
