import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Toolbar } from '@mui/material';
import NavBar from '../../components/NavBar';
import CourseSidebar from '../../components/CourseSidebar';

const TeacherCourseClasses = () =>  {
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

       
        {/* Main container goes here */}
        <>this is the class page</>
    
      </Box>
    </Box>

  );
}

export default TeacherCourseClasses;
