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
  tableCellClasses,
  Button,
  Link,
  Tabs,
  Tab,
  TableContainer,
  Paper,
} from "@mui/material";
import { useParams } from "react-router";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
      <Box component="main" sx={{ flexGrow: 1, p: 20, paddingTop: 0 }}>
        <h1>Assignment Submissions</h1>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ paddingBottom: "20px" }}
        >
          <Tab label="Ungraded" />
          <Tab label="Graded" />
        </Tabs>
        {tabValue === 0 && (
          <>
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
              Ungraded Submissions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Student Name</StyledTableCell>
                    <StyledTableCell>Submission File</StyledTableCell>
                    <StyledTableCell>Grade</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {ungradedSubmissions.map((submission) => (
                    <StyledTableRow key={submission.id}>
                      <StyledTableCell>
                        {submission.student_email}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Link onClick={() => handleGetFile(submission.file_id)}>
                          Submission
                        </Link>
                      </StyledTableCell>

                      <StyledTableCell>
                        <TextField
                          type="number"
                          value={scores[submission.id] || ""}
                          onChange={(e) =>
                            handleScoreChange(submission.id, e.target.value)
                          }
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleMarkAssignment(submission.id)}
                        >
                          Mark
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {tabValue === 1 && (
          <>
            <Typography variant="h5" sx={{ marginBottom: "20px" }}>
              Graded Submissions
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Student Name</StyledTableCell>
                    <StyledTableCell>Submission File</StyledTableCell>
                    <StyledTableCell>Grade</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {gradedSubmissions.map((submission) => (
                    <StyledTableRow key={submission.id}>
                      <StyledTableCell>
                        {submission.student_email}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Link onClick={() => handleGetFile(submission.file_id)}>
                          Submission
                        </Link>
                      </StyledTableCell>

                      <StyledTableCell>{submission.score}</StyledTableCell>
                    </StyledTableRow>
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
