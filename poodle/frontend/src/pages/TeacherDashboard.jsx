import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Modal,
  TextField,
  Button,
  Alert
} from '@mui/material'
import NavBar from '../components/NavBar'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  },
  card: {
    width: '150px',
    height: '150px',
    margin: '5px',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}

const TeacherDashboard = () => {
  const token = localStorage.getItem('token')

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [courseName, setCourseName] = useState('')
  const [courses, setCourses] = useState([])
  const [alert, setAlert] = React.useState(false)
  const [alertContent, setAlertContent] = React.useState('')

  const handleOpen = () => {
    setOpen(true)
    setAlert(false)
  }
  const handleClose = () => setOpen(false)
  const handleInputChange = (event) => setCourseName(event.target.value)
  
  const handleSubmit = async () => {
    let courseNames = courses.map(obj => obj.name)
    if (!courseNames.includes(courseName)) {
      const response = await fetch(
        new URL('/courses/create', 'http://localhost:5000/'),
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
        fetchCourses();
        setCourseName('');
        handleClose();
      }
    }
    else {
      setAlert(true);
      setAlertContent('Please submit a unique course name')
    }
  }

  useEffect(() => {
    fetchCourses();
  }, [])

  const handleCardClick = (course) => {
    navigate(`/teacher/${course}/Participants`)
  }

  const fetchCourses = async () => {
    const response = await fetch(
      new URL('/dashboard/course-list', 'http://localhost:5000/'),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await response.json()
    if (data.error) {
      console.log('ERROR')
    }
    else {
      setCourses(data);
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
      {alert ? <><br /><Alert severity="error">{alertContent}</Alert></> : <></>}
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
          {courses.map((course) => (
            <Card
              key={course.id}
              sx={styles.card}
              onClick={() => handleCardClick(course.id)}
            >
              <CardContent sx={{
                wordWrap: 'break-word',
              }}>
                <Typography variant="h7" component="div">
                  <strong>{course.name}</strong>
                </Typography>
              </CardContent>
            </Card>
          ))}
          <Card 
            sx={{
              height: '150px',
              width: '150px',
              margin: '5px',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              border: '2px solid rgb(156,39,176)',
              boxSizing: 'border-box',
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
