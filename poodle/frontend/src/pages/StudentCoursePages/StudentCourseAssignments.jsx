import React, { useState } from 'react';
import { Button, Box, TextField, Container, List, ListItem, ListItemText, Toolbar, Card, CardContent, Typography } from '@mui/material';
import NavBar from '../../components/NavBar';
import TeacherCourseSidebar from '../../components/TeacherCourseSidebar';
import { useParams } from 'react-router';
import StudentCourseSidebar from '../../components/StudentCourseSidebar';


const assignments = [
    {
      title: "Assignment 1",
      description: "this is a mad assignment description",
      due_date: "2023-07-01T15:30:00.000Z",
      mark: 25,
      max_marks: 30,
      file: "dummy file here"
    },
    {
      title: "Assignment 2",
      description: "wassup baby bro",
      due_date: "2023-07-15T17:00:00.000Z",
      mark: null,
      max_marks: 30,
      file: "dummy file2"
    },
  ]

const AssignmentCard = ({assignment}) => {
    let due_date = new Date(assignment.due_date);
    let formatted_date = `${due_date.getDate()}/${due_date.getMonth()+1}/${due_date.getFullYear()} ${due_date.getHours()}:${due_date.getMinutes()} ${due_date.getHours() < 12 ? 'AM' : 'PM'}`;

    return (
        <Card sx={{ minWidth: 275, m: 2 }}>
        <CardContent>
            <Typography variant="h5">
            {assignment.title}
            </Typography>
            <Typography variant="body1">
            {assignment.description}
            </Typography>
            <Typography variant="body2">
            Due Date: {formatted_date}
            </Typography>
            <Typography variant="body2">
            Mark: {assignment.mark ? `${assignment.mark}/${assignment.max_marks}` : `?/${assignment.max_marks}`}
            </Typography>
                <input type='file'/>
            <Button variant="contained" component="label" color="secondary" style={{margin: "10px 0px"}}>
                Submit
            </Button>
        </CardContent>
        </Card>
    )
}

const StudentCourseAssignments = () => {
    // const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, selectAssignment] = useState(null);

    return (
        <Box sx={{ display: 'flex' }}>
            <NavBar />
            <StudentCourseSidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3}}>
            <Toolbar />

            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {assignments.map((assignment, index) => <AssignmentCard key={index} assignment={assignment}/>)}
            </Box>

            </Box>
        </Box>
    
      )
}

export default StudentCourseAssignments;