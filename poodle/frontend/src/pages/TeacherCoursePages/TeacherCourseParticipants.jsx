import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  Paper,
  Box,
  Toolbar,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import CourseSidebar from "../../components/CourseSidebar";
import { useParams } from "react-router-dom";
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

const TeacherCourseParticipants = () => {
  const [students, setStudents] = useState([]);
  const [email, setEmail] = useState("");

  const token = localStorage.getItem("token");
  const courseId = useParams().courseId;

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const fetchStudents = async () => {
    const response = await fetch(
      new URL(`/courses/${courseId}/students`, "http://localhost:5000"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      setStudents(data);
    }
  };

  const handleAddStudent = async () => {
    if (email) {
      const response = await fetch(
        new URL(`/courses/${courseId}/invite`, "http://localhost:5000/"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: email }),
        }
      );
      const data = await response.json();
      if (data.error) {
        console.log("ERROR");
        alert("Please input a valid student email address");
      } else {
        fetchStudents();
        setEmail("");
      }
    } else {
      alert("Please input a valid student email address");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <CourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <h1>Course Participants</h1>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            paddingBottom: "15px",
          }}
        >
          <h2>Add a student:</h2>
          <TextField
            id="outlined-basic"
            label="Student Email"
            variant="outlined"
            value={email}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddStudent}
          >
            Add
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>First Name</StyledTableCell>
                <StyledTableCell>Last Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {students.map((student, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{student.first_name}</StyledTableCell>
                  <StyledTableCell>{student.last_name}</StyledTableCell>
                  <StyledTableCell>{student.email}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TeacherCourseParticipants;
