import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Toolbar } from '@mui/material';
import NavBar from '../../components/NavBar';
import CourseSidebar from '../../components/CourseSidebar';

const TeacherCourseParticipants = () =>  {
  const [students, setStudents] = useState([]);
  const [email, setEmail] = useState('');

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAddStudent = () => {
    if (email) {
      setStudents(prevStudents => [...prevStudents, {
        firstName: 'dummyFirstName',
        lastName: 'dummyLastName',
        email: email
      }]);
      setEmail('');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar />
      <CourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <h1>Add student:</h1>
            <TextField id="outlined-basic" label="Student Email" variant="outlined" value={email} onChange={handleInputChange} />
            <Button variant="contained" color="success" onClick={handleAddStudent}>Add</Button>
        </Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {students.map((student, index) => (
                <TableRow key={index}>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
      </Box>
    </Box>

  );
}

export default TeacherCourseParticipants
