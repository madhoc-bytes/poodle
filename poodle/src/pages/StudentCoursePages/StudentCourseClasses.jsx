import React, { useState } from 'react';
import { Button, Box, Typography, Toolbar, Card, CardContent } from '@mui/material';
import NavBar from '../../components/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import StudentCourseSidebar from '../../components/StudentCourseSidebar';


const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
    //   alignItems: 'center',
      padding: '20px'
    },
    card: {
      width: '400px',
      marginBottom: '10px'
    },
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
};

const StudentCourseClasses = () =>  {
    const courseId = useParams().courseId;

    const names = ['class1', 'class2', 'class3', 'class4']

    const handleJoinClass = (name) => {
        window.open(`/${courseId}/OnlineClass/${name}`, '_blank');
    };

    return (
    <Box sx={{ display: 'flex' }}>
        <NavBar />
        <StudentCourseSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <h1>Active Classes</h1>
        </Box>

        <Box sx={styles.container}>
            {names.map((name, index) => (
                <Card key={index} sx={styles.card}>
                <CardContent sx={styles.cardContent}>
                    <Typography variant="h6">{name}</Typography>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleJoinClass(name)}
                    >
                    Join
                    </Button>
                </CardContent>
                </Card>
            ))}
        </Box>

        </Box>
    </Box>

  );
}

export default StudentCourseClasses;
