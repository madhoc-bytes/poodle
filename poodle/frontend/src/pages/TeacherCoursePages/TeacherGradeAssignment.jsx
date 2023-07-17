import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import {
  Toolbar,
  Typography,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  TextField,
  Button,
} from "@mui/material";

const TeacherGradeAssignment = () => {
  const assignmentSubmissions = [{ id: 1, studentName: "Handy", grade: 0 }];
  return (
    <>
      <NavBar />
      <Toolbar />
      <div>
        <Typography variant="h5">Ungraded Submissions</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Submission File</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignmentSubmissions.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.studentName}</TableCell>
                <TableCell>{assignment.submissionFile}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={assignment.grade}
                    onChange={(e) =>
                      handleMarkAssignment(assignment.id, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleMarkAssignment(assignment.id, assignment.grade)
                    }
                  >
                    Mark
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Typography variant="h5">Graded Submissions</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Submission File</TableCell>
              <TableCell>Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{/* Render the graded assignments here */}</TableBody>
        </Table>
      </div>
      );
    </>
  );
};

export default TeacherGradeAssignment;
