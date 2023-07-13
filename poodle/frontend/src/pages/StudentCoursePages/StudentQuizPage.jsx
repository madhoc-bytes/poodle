import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogActions,
  Toolbar,
} from "@mui/material";
import NavBar from "../../components/NavBar";

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
    <>
      <NavBar />
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "lightblue",
          height: "100%",
        }}
      >
        {/* Quiz Name */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h2">
            <b>{quiz.name}</b>
          </Typography>
          <Typography variant="h7">Time Remaining: {timeLeft}</Typography>
        </Box>

        {/* Stuff in middle */}
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          {/* Time remaining and questions sidebar */}
          <Box width={"20%"} p={5}>
            <Grid container justifyContent="space-between">
              <Grid item>
                {quiz.questions.map((question, index) => (
                  <Button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    sx={{
                      backgroundColor:
                        currentQuestionIndex === index ? "#B19CD7" : "#FFE6EE",
                      "&:hover": {
                        backgroundColor: "#B19CD7",
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
          </Box>

          {/* Actual Question */}
          <Box
            sx={{
              diplay: "flex",
              flexDirection: "column",
              backgroundColor: "lightgreen",
              flexGrow: 1,
            }}
          >
            {/* <Grid item> */}
            <Typography variant="h6">
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
                      style={{
                        backgroundColor:
                          selectedAnswers[currentQuestionIndex] === answer
                            ? "red"
                            : "transparent",
                      }}
                    />
                  </RadioGroup>
                )
              )
            ) : (
              <TextField
                label="Answer"
                variant="outlined"
                value={selectedAnswers[currentQuestionIndex] || ""}
                onChange={handleAnswerChange}
              />
            )}
            {/* </Grid> */}
          </Box>

          {/* Submit Button */}
          <Box
            sx={{
              width: "25%",
              textAlign: "center",
              backgroundColor: "pink",
            }}
          >
            <Button
              variant="outline"
              color="secondary"
              onClick={handleClickOpen}
            >
              Submit
            </Button>
            <Dialog
              open={openSubmitModal}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to submit?"}
              </DialogTitle>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary" autoFocus>
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>

        {/* Prev and Next question */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "50px",
            backgroundColor: "purple",
          }}
        >
          <Button onClick={goPrevious}>Previous</Button>
          <Button onClick={goNext}>Next</Button>
        </Box>
      </Box>
    </>
  );
};

export default StudentQuizPage;
