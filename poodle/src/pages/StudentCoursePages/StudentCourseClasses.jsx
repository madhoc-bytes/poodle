import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, Toolbar } from '@mui/material';
import NavBar from '../../components/NavBar';
import { useParams } from 'react-router-dom';
import StudentCourseSidebar from '../../components/StudentCourseSidebar';

const StudentCourseClasses = () =>  {
    const courseId = useParams().courseId;

    const handleJoinClass = () => {
        console.log('start class');
        // TODO: Need to make a fetch post for students.

        // Should be replaced with classId
        window.open(`/${courseId}/OnlineClass`, '_blank');

        // setClassName('');
    }

    return (
    <Box sx={{ display: 'flex' }}>
        <NavBar />
        <StudentCourseSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <h1>Join class:</h1>
            <Button variant="contained" color="success" onClick={handleJoinClass}>Start</Button>
        </Box>

        </Box>
    </Box>

  );
}

export default StudentCourseClasses;
