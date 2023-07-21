import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Toolbar,
  Card,
  CardContent,
  Drawer,
  List,
  ListItemButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  styled,
  TableCell,
  tableCellClasses,
  TableBody,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import { useParams } from "react-router-dom";
import CourseSidebar from "../../components/CourseSidebar";

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
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const TeacherCourseLeaderboards = () => {
  const courseId = useParams().courseId;
  const [leaderboards, setLeaderboards] = useState([]);
  const [currLeaderboard, setCurrLeaderboard] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    const response = await fetch(
      new URL(`/courses/${courseId}/leaderboards`, "http://localhost:5000/"),
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
      setLeaderboards(data);
        // If length of data greater than 0, set currLeaderboard to 0
        if (data.length > 0) {
            setCurrLeaderboard(0);
        }
      console.log(data)
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <CourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4">Leaderboards</Typography>
        <Box sx={{ display: "flex" }}>
            {/* Assessment Sidebar */}
            <Box
                sx={{
                    display: "flex",
                    marginRight: "20px",
                    // flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: 240,
                        boxSizing: "border-box",
                    },
                }}
            >
                <List>
                    {leaderboards.map((item, index) => (
                        <ListItemButton
                            key={index}
                            onClick={() => setCurrLeaderboard(index)}
                            sx={{
                                backgroundColor: index === currLeaderboard ? "yellow" : "white",
                                "&:hover": {
                                    backgroundColor: "yellow",
                                },
                                justifyContent: "center",
                            }}
                        >
                            <Typography>{item.name}</Typography>
                        </ListItemButton>
                    ))}
                </List>
            </Box>
            {/* Leaderboard table */}
            <Box>
                {currLeaderboard !== null && (
                    <Box>
                        {/* <Typography variant="h5">{leaderboards[currLeaderboard].name}</Typography> */}
                        <Box sx={{ display: "flex", marginTop: "10px", flexDirection: "column" }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ width: '40vw' }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="left">Rank</StyledTableCell>
                                            <StyledTableCell align="left">Student</StyledTableCell>
                                            <StyledTableCell align="right">Mark</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leaderboards[currLeaderboard].top_ten.map((student, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell component="th" scope="row" align="left">
                                                    {index + 1}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">{student.first_name} {student.last_name}</StyledTableCell>
                                                <StyledTableCell align="right">{student.mark}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                    
                                </Table>
                            </TableContainer>

                            <Toolbar />

                        </Box>
                    </Box>
                )}
            </Box>
            {/* Display median and mean */}
            <Box>
                {currLeaderboard !== null && (
                    <Box>
                        <Typography variant="h5">Median: {leaderboards[currLeaderboard].median}</Typography>
                        <Typography variant="h5">Mean: {leaderboards[currLeaderboard].mean}</Typography>
                    </Box>
                )}
            </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default TeacherCourseLeaderboards;
