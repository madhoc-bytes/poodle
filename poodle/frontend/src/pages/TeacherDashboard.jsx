import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Modal, TextField, Button } from '@mui/material';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [courses, setCourses] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleInputChange = (event) => setCourseName(event.target.value);

    const handleSubmit = () => {
        if (courseName) {
            setCourses(prevCourses => [...prevCourses, courseName]);
            setCourseName("");
            handleClose();
        }
    };

    const handleCardClick = (course) => {
        navigate(`/teacher/${course}/Participants`);
    };

    const body = (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h5" component="h2" align="center" gutterBottom>
                Create a new course
            </Typography>
            <TextField
                variant="outlined"
                margin="normal"
                required
                id="course"
                label="Course Name"
                name="course"
                autoFocus
                value={courseName}
                onChange={handleInputChange}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        </Box>
    );

    return (
        <>
            <NavBar />
            <Container maxWidth="sm">
                <Typography variant="h3" component="h1" align="center" gutterBottom>
                    Courses
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {courses.map((course, index) => (
                        <Card key={index} sx={{ m: 1 }} onClick={() => handleCardClick(course)}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {course}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                    <Card sx={{ m: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', border: '2px dashed grey' }} onClick={handleOpen}>
                        {/* <AddCircleOutlineIcon color="action" style={{ fontSize: 50 }} /> + */}
                        Add new course
                    </Card>
                </Box>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </Container>
        </>
    );
}

export default TeacherDashboard;
