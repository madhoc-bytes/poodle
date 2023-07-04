import React, { useState } from 'react';
import { Button, Box, TextField, Container, List, ListItem, ListItemText, Toolbar, Drawer, Grid, Typography } from '@mui/material';
import NavBar from '../../components/NavBar';
import TeacherCourseSidebar from '../../components/TeacherCourseSidebar';
import { useParams } from 'react-router';
// import AdapterDayjs from '@mui/x/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function CreateAssignmentForm({ onSave }) {
    const [assignment, setAssignment] = useState({ title: '', dueDate: '', maxMarks: '', description: '' });

    const handleChange = (e) => {
      setAssignment({ ...assignment, [e.target.name]: e.target.value });
    };
  
    const save = () => {
      onSave(assignment);
      setAssignment({ title: '', dueDate: '', maxMarks: '', description: '' });
    };
  
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '15px'}}>
            <Typography variant="h2">Create Assignment</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5">Title:</Typography>
                <TextField variant='outlined' label="Title" name="title" onChange={handleChange} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5">Title:</Typography>
                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker />
                </LocalizationProvider> */}
                {/* <TextField name="dueDate" type="date" onChange={handleChange} /> */}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5">Title:</Typography>
                <TextField label="Max Marks" name="maxMarks" type="number" onChange={handleChange} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5">Title:</Typography>
                <TextField label="Description" name="description" onChange={handleChange} />
            </Box>
            
            
            <Button variant="contained" color="secondary">Create</Button>
        {/* <form>
            <Button onClick={save}>Create</Button>
        </form> */}
    </Box>
    );
  }
  
function EditAssignmentForm({ assignment, onSave }) {
    const [currentAssignment, setCurrentAssignment] = useState(assignment);
  
    const handleChange = (e) => {
      setCurrentAssignment({ ...currentAssignment, [e.target.name]: e.target.value });
    };
  
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, margin: '15px'}}>
        {/* <TextField id="outlined-basic" label="Enter Assignment Name" variant="outlined" />
        <TextField id="outlined-basic" label="Enter Assignment Description" variant="outlined" />
        <TextField id="outlined-basic" label="Enter Assignment Due Date" variant="outlined" />
        <TextField id="outlined-basic" label="Enter Assignment Max Marks" variant="outlined" />
        <Button variant="contained" color="secondary">Create</Button> */}
        <form>
            <TextField label="Title" name="title" onChange={handleChange} />
            <TextField label="Due Date" name ="dueDate" type="date" onChange={handleChange} />
            <TextField label="Max Marks" name="maxMarks" type="number" onChange={handleChange} />
            <TextField label="Description" name="description" onChange={handleChange} />
            <Button>Update</Button>
        </form>
    </Box>
    );
}

const TeacherCourseAssignments = () => {
    // const courseId = useParams().courseId;

    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    const dummyList = ['Item 1', 'item 2', 'item 3']

    const addAssignment = (assignment) => {
        setAssignments([...assignments, assignment]);
    };

    const updateAssignment = (updatedAssignment) => {
        const newAssignments = assignments.map((assignment, index) =>
          index === selectedAssignment ? updatedAssignment : assignment
        );
        setAssignments(newAssignments);
    };

    const createAssignment = () => {
        setSelectedAssignment(null);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <NavBar />
            <TeacherCourseSidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3}}>
            <Toolbar />

            <Box sx={{ display: 'flex', height: '85vh'}}>
                <Box 
                    sx={{ 
                        width: 300, 
                        bgcolor: 'pink',
                        display: 'flex',
                        flexDirection: 'column',
                        alignContent: 'center'
                    }}
                >
                    {/* Content of the left section goes here */}
                    <Button 
                        variant="contained" color="secondary" sx={{ margin: '15px'}} 
                        onClick={() => {setSelectedAssignment(null)}}
                    >
                        Create Assignment
                    </Button>

                    <List>
                        {dummyList.map((text, index) => (
                        <ListItem 
                            key={index} 
                            style={{ 
                                margin: '10px', 
                                width: 280, 
                                backgroundColor: selectedAssignment === index ? '#a9a9a9' : '#d3d3d3' 
                            }}
                            onClick={() => setSelectedAssignment(index)}
                        >
                            <ListItemText primary={text} />
                        </ListItem>
                        ))}
                    </List>

                </Box>

                <Box sx={{ flexGrow: 1, bgcolor: 'lightblue' }}>
                    {/* Content of the right section goes here */}

                    {selectedAssignment === null ? (
                        <CreateAssignmentForm onSave={addAssignment} />
                    ) : (
                        <EditAssignmentForm assignment={assignments[selectedAssignment]} onSave={updateAssignment} />
                    )}

                </Box>
            </Box>

    
            {/* <Container>
            <Sidebar
                assignments={assignments}
                selectAssignment={selectAssignment}
                createAssignment={createAssignment}
            />
            {selectedAssignment === null ? (
                <CreateAssignmentForm onSave={addAssignment} />
            ) : (
                <EditAssignmentForm assignment={assignments[selectedAssignment]} onSave={updateAssignment} />
            )}
            </Container> */}
                   
            </Box>
        </Box>
    
      )
}

export default TeacherCourseAssignments;