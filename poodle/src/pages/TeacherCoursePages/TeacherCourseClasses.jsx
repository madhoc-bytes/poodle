import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Toolbar } from '@mui/material';
import NavBar from '../../components/NavBar';
import TeacherCourseSidebar from '../../components/TeacherCourseSidebar';
import { useParams } from 'react-router-dom';

const TeacherCourseClasses = () =>  {
    const courseId = useParams().courseId;
    const [className, setClassName] = useState('');

    const handleInputChange = (event) => {
        setClassName(event.target.value);
    }

    const handleAddClass = () => {
        console.log('start class');
        // TODO: Need to make a fetch post for students.

        // Should be replaced with classId
        window.open(`/OnlineClass/${courseId}/${className}`, '_blank');

        setClassName('');
    }

    return (
    <Box sx={{ display: 'flex' }}>
        <NavBar />
        <TeacherCourseSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <h1>Start class:</h1>
            <TextField id="outlined-basic" label="Enter Class Name" variant="outlined" value={className} onChange={handleInputChange} />
            <Button variant="contained" color="success" onClick={handleAddClass}>Start</Button>
        </Box>

        </Box>
    </Box>

  );
}

export default TeacherCourseClasses;
