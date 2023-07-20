import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import {
  Box,
  Toolbar,
  Typography,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TextField,
  Button,
  Link,
  Tabs,
  Tab,
  TableContainer,
  Paper,
} from "@mui/material";
import { useParams } from "react-router";

const TeacherGradeAssignment = () => {
  // const assignmentSubmissions = [{ id: 1, studentName: "Handy", grade: 0 }];
  const { assignmentId } = useParams();
  const token = localStorage.getItem("token");

  const [assignmentSubmissions, setAssignmentSubmissions] = useState([]);
  const [scores, setScores] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchAssignmentSubmissions();
  }, []);

  const fetchAssignmentSubmissions = async () => {
    const response = await fetch(
      // Change the URL when backend is ready
      new URL(
        `/courses/assignments/${assignmentId}/submissions`,
        "http://localhost:5000/"
      ),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) alert("ERROR");
    else {
      setAssignmentSubmissions(data);
    }
  };

  const handleGetFile = async (fileId) => {
    const response = await fetch(
      new URL(`/courses/download-file/${fileId}`, "http://localhost:5000/"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.blob();
    if (data.error) {
      console.log("error");
    } else {
      console.log(data);
      let url = window.URL.createObjectURL(data);
      window.open(url);
    }
  };

  const handleScoreChange = (submissionId, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [submissionId]: score,
    }));
  };

  const handleMarkAssignment = async (submissionId) => {
    const score = scores[submissionId];
    console.log(score);
    const response = await fetch(
      new URL(
        `/courses/assignments/mark/${submissionId}`,
        "http://localhost:5000/"
      ),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ score }),
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
      alert("Mark out of range");
    } else {
      console.log("Assignment marked successfully");
      fetchAssignmentSubmissions();
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const ungradedSubmissions = assignmentSubmissions.filter(
    (submission) => !submission.score && submission.score !== 0
  );
  const gradedSubmissions = assignmentSubmissions.filter(
    (submission) => submission.score || submission.score === 0
  );

  return (
    <>
      <NavBar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5">Assignment Submissions</Typography>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Ungraded" />
          <Tab label="Graded" />
        </Tabs>
        {tabValue === 0 && (
          <>
            <Typography variant="h5">Ungraded Submissions</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Submission File</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ungradedSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.student_email}</TableCell>
                      <TableCell>
                        {" "}
                        <Link onClick={() => handleGetFile(submission.file_id)}>
                          Submission
                        </Link>
                      </TableCell>

                      <TableCell>
                        <TextField
                          type="number"
                          value={scores[submission.id] || ""}
                          onChange={(e) =>
                            handleScoreChange(submission.id, e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleMarkAssignment(submission.id)}
                        >
                          Mark
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {tabValue === 1 && (
          <>
            <Typography variant="h5">Graded Submissions</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Submission File</TableCell>
                    <TableCell>Grade</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gradedSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>{submission.student_email}</TableCell>
                      <TableCell>
                        <Link onClick={() => handleGetFile(submission.file_id)}>
                          Submission
                        </Link>
                      </TableCell>

                      <TableCell>{submission.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </>
  );
};

export default TeacherGradeAssignment;
