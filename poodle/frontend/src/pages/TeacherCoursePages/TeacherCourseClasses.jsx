import React, { useState, useEffect } from 'react'
import { TextField, Button, Box, Toolbar, Card, CardContent, Typography } from '@mui/material'
import NavBar from '../../components/NavBar'
import TeacherCourseSidebar from '../../components/TeacherCourseSidebar'
import { useParams } from 'react-router-dom'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
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
}

const TeacherCourseClasses = () => {
  const courseId = useParams().courseId
  const [className, setClassName] = useState('')
  const [activeClasses, setActiveClasses] = useState([])
  const token = localStorage.getItem('token');

  const handleInputChange = (event) => {
    setClassName(event.target.value)
  }

  useEffect(() => {
    fetchClasses();
  }, [])

  const handleJoinClass = (name) => {
    window.open(`/OnlineClass/${courseId}/${name}`, '_blank')
  }

  const fetchClasses = async () => {
    const response = await fetch(
      new URL(`/courses/${courseId}/classes`, 'http://localhost:5000/'),
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
      setActiveClasses(data)
    }
  }

  const handleAddClass = async () => {
    const response = await fetch(
      new URL(`/courses/${courseId}/create-class`, 'http://localhost:5000/'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 'className': className })
      }
    )
    const data = await response.json()
    if (data.error) {
      console.log('ERROR')
    }
    else {
      console.log(data)
      window.open(`/OnlineClass/${courseId}/${data.class_id}`, '_blank')
    }
    console.log('start class')
    
    // Make a fetch to get the classId from class name
      
    
    
    setClassName('')
    fetchClasses()
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
            <Button variant="contained" color="secondary" onClick={handleAddClass}>Start</Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <h1>Active Classes</h1>
        </Box>

        <Box sx={styles.container}>

            {activeClasses.map((activeClass) => (
                <Card key={activeClass.id} sx={styles.card}>
                <CardContent sx={styles.cardContent}>
                    <Typography variant="h6">{activeClass.name}</Typography>
                    <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleJoinClass(activeClass.id)}
                    >
                    Join
                    </Button>
                </CardContent>
                </Card>
            ))}
        </Box>

        </Box>
    </Box>

  )
}

export default TeacherCourseClasses
