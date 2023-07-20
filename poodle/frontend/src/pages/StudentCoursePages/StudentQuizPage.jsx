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
import { useParams, useNavigate } from "react-router";

const StudentQuizPage = () => {
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [quizTimeStarted, setQuizTimeStarted] = useState();
  const [quizTimeLimit, setQuizTimeLimit] = useState();
  const [quizQuestions, setQuizQuestions] = useState([]);
  const token = localStorage.getItem("token");
  const { quizId, courseId } = useParams();

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

  const handleSubmit = async () => {
    const response = await fetch(
      new URL(`/quiz/${quizId}/submit`, "http://localhost:5000/"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    navigate(`/student/${courseId}/Quizzes`);
    // This will probably redirect you to another page saying test submitted
  };

  const fetchQuiz = async () => {
    const response = await fetch(
      new URL(`/quiz/${quizId}/studentinfo`, "http://localhost:5000/"),
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
      // TODO: Uncomment this when backend is ready
      setQuizName(data.quizInfo.name);
      setQuizTimeLimit(data.quizInfo.timeLimit);
      setQuizTimeStarted(data.quizInfo.timeStarted);
      setQuizQuestions(data.quizInfo.questions);
      console.log(data);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  // Time remaining
  useEffect(() => {
    const interval = setInterval(() => {
      const timeStarted = new Date(quizTimeStarted);

      const now = new Date();
      const timeLimitMilliseconds = quizTimeLimit * 60 * 1000;
      const timeElapsed =
        now.getTime() - timeStarted.getTime() + 10 * 60 * 1000 * 60;
      const timeRemaining = timeLimitMilliseconds - timeElapsed;
      const secondsLeft = Math.floor(timeRemaining / 1000);

      if (secondsLeft < 0) {
        clearInterval(interval);
        setTimeLeft("Time's up!");
      } else {
        const hours = Math.floor(secondsLeft / 3600);
        const minutes = Math.floor((secondsLeft % 3600) / 60);
        const seconds = Math.floor(secondsLeft % 60);
        setTimeLeft(`${hours}hrs ${minutes}min ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quizTimeStarted, quizTimeLimit]);

  // Calculate the current score
  useEffect(() => {
    if (timeLeft === "Time's up!") {
      alert("Time is up!");
      return;
    }
    let count = 0;
    for (let key in selectedAnswers) {
      if (selectedAnswers[key] === quizQuestions[key].correct_answer) {
        count++;
      }
    }
    setCurrScore(count);
    const updateScoreFetch = async () => {
      const response = await fetch(
        new URL(`/quiz/${quizId}/update-score`, "http://localhost:5000/"),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ score: count }),
        }
      );
      const data = await response.json();
      if (data.error) alert("ERROR");
    };

    updateScoreFetch();
  }, [selectedAnswers]);

  const goNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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
          <b>{quizName}</b>
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
            {quizQuestions.map((_question, index) => (
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
          {quizQuestions.length > 0 ? (
            <>
              <Typography variant="h6" sx={{ margin: "10px 0 30px 0" }}>
                {quizQuestions[currentQuestionIndex].question}
              </Typography>
              {quizQuestions[currentQuestionIndex].is_multi ? (
                quizQuestions[currentQuestionIndex].answers.map(
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
            </>
          ) : (
            <></>
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
