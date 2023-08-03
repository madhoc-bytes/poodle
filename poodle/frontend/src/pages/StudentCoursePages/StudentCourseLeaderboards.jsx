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
  Link,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import CourseSidebar from "../../components/CourseSidebar";
import UserAvatar from "../../components/UserAvatar";

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

const StudentCourseLeaderboards = () => {
  const courseId = useParams().courseId;
  const [leaderboards, setLeaderboards] = useState([]);
  const [currLeaderboard, setCurrLeaderboard] = useState(null);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

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
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <CourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <h1>Course Leaderboards</h1>
        <Box gap={5} sx={{ display: "flex", p: 1 }}>
          {/* Assessment Sidebar */}
          <Box
            sx={{
              display: "flex",
              marginRight: "20px",
              maxWidth: "300px",
            }}
          >
            <List>
              {leaderboards.map((item, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => setCurrLeaderboard(index)}
                  sx={{
                    backgroundColor:
                      index === currLeaderboard ? "rgb(149,117,222)" : "white",
                    color: index === currLeaderboard ? "white" : "black",
                    "&:hover": {
                      backgroundColor: "rgb(149,117,222)",
                    },
                    justifyContent: "center",
                  }}
                >
                  <Typography>
                    <b>{item.name}</b>
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          </Box>
          {/* Leaderboard table */}
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            {/* Display median and mean */}
            {currLeaderboard !== null && (
              <Box>
                {/* <Typography variant="h5">{leaderboards[currLeaderboard].name}</Typography> */}
                <Box
                  sx={{
                    display: "flex",
                    marginTop: "10px",
                    flexDirection: "column",
                  }}
                >
                  <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="left">Rank</StyledTableCell>
                          <StyledTableCell align="left">
                            Student
                          </StyledTableCell>
                          <StyledTableCell align="right">Mark</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {leaderboards[currLeaderboard].top_ten.map(
                          (student, index) => (
                            <StyledTableRow key={index}>
                              <StyledTableCell
                                component="th"
                                scope="row"
                                align="left"
                              >
                                {index + 1}
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <UserAvatar
                                    userId={student.id}
                                    token={token}
                                  />
                                  <Link
                                    sx={{ fontStyle: "none" }}
                                    onClick={() =>
                                      window.open(`/profile/${student.id}`)
                                    }
                                  >
                                    {student.first_name} {student.last_name}
                                  </Link>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {student.mark}
                              </StyledTableCell>
                            </StyledTableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {leaderboards[currLeaderboard].curr_student.mark !== -1 &&
                    leaderboards[currLeaderboard].curr_student.mark !==
                      null && (
                      <TableContainer
                        component={Paper}
                        sx={{ marginTop: "100px" }}
                      >
                        <Table aria-label="customized table">
                          <TableBody>
                            <StyledTableRow>
                              <StyledTableCell
                                component="th"
                                scope="row"
                                align="left"
                              >
                                {
                                  leaderboards[currLeaderboard].curr_student
                                    .rank
                                }
                              </StyledTableCell>
                              <StyledTableCell align="left">
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <UserAvatar
                                    userId={
                                      leaderboards[currLeaderboard].curr_student
                                        .id
                                    }
                                    token={token}
                                  />
                                  <Link
                                    sx={{ fontStyle: "none" }}
                                    onClick={() =>
                                      window.open(
                                        `/profile/${leaderboards[currLeaderboard].curr_student.id}`
                                      )
                                    }
                                  >
                                    {
                                      leaderboards[currLeaderboard].curr_student
                                        .first_name
                                    }{" "}
                                    {
                                      leaderboards[currLeaderboard].curr_student
                                        .last_name
                                    }
                                  </Link>
                                </Box>
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                {
                                  leaderboards[currLeaderboard].curr_student
                                    .mark
                                }
                              </StyledTableCell>
                            </StyledTableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                </Box>
              </Box>
            )}
          </Box>
          {leaderboards[0] && (
            <Box
              gap={3}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  backgroundColor: "rgb(149,117,222)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "10px",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5">Median</Typography>

                <Typography
                  variant="h5"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  {leaderboards[currLeaderboard].median.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    backgroundColor: "rgb(149,117,222)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: "10px",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h5">Mean</Typography>

                  <Typography
                    variant="h5"
                    sx={{ color: "black", fontWeight: "bold" }}
                  >
                    {leaderboards[currLeaderboard].mean.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentCourseLeaderboards;
