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

const StudentDashboard = () => {
  const token = localStorage.getItem('token')

  const navigate = useNavigate()
  const [courses, setCourses] = useState([])

  useEffect(() => {
    console.log(token);
    fetchCourses();
  }, [])

  const handleCardClick = (course) => {
    navigate(`/student/${course}/Participants`)
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
      console.log(data);
    }
  }

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
    
        </Box>
       </Container>
    </>
  )
}

export default StudentDashboard
