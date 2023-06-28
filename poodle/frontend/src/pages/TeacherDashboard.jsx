import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Modal,
  TextField,
  Button
} from '@mui/material'
import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    //   alignItems: 'center',
    padding: '20px'
  },
  card: {
    width: '150px',
    height: '150px',
    margin: '5px'
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}

const TeacherDashboard = () => {
  const token = localStorage.getItem('token')

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [courseName, setCourseName] = useState('')
  const [courses, setCourses] = useState([])

  useEffect(() => {
    console.log(token);
    fetchCourses();
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleInputChange = (event) => setCourseName(event.target.value)
  

  const handleSubmit = async () => {
    const response = await fetch(
      new URL('/courses', 'http://localhost:5000/'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseName })
      }
    )
    const data = await response.json()
    if (data.error) {
      console.log('ERROR')
    }
    else {
      console.log(data);
    }

    if (courseName) {
      setCourses((prevCourses) => [...prevCourses, courseName])
      setCourseName('')
      handleClose()
    }


  }

  const handleCardClick = (course) => {
    navigate(`/teacher/${course}/Participants`)
  }

  const fetchCourses = async () => {
    const response = await fetch(
      new URL('/dashboard', 'http://localhost:5000/'),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({ 'email': localStorage.getItem('email') })
      }
    )
    const data = await response.json()
    if (data.error) {
      console.log('ERROR')
    }
    else {
      console.log(data);
    }
  }

  const body = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        bgcolor: 'background.paper'
      }}
    >
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
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  )

  return (
    <>
      <NavBar />
      <Container maxWidth="sm">
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Courses
        </Typography>
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {courses.map((course, index) => (
            <Card
              key={index}
              sx={styles.card}
              onClick={() => handleCardClick(course)}
            >
              <CardContent sx={styles.cardContent}>
                <Typography variant="h5" component="div">
                  {course}
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Card 
            sx={{
              height: '150px',
              width: '150px',
              m: 1,
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              border: '2px solid rgb(156,39,176)'
              
            }}
            onClick={handleOpen}
          >
            <AddIcon style={{ color: 'rgb(156,39,176)', fontSize: 65 }} />
          </Card>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
        >
          {body}
        </Modal>
      </Container>
    </>
  )
}

export default TeacherDashboard
