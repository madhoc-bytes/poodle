import React, { useEffect, useState } from 'react'
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Toolbar } from '@mui/material'
import NavBar from '../../components/NavBar'
import TeacherCourseSidebar from '../../components/TeacherCourseSidebar'
import { useParams } from 'react-router-dom'

const TeacherCourseParticipants = () => {
  const [students, setStudents] = useState([])
  const [email, setEmail] = useState('')

  const token = localStorage.getItem('token');
  const courseId = useParams().courseId;

  useEffect(() => {
    fetchStudents();
  }, [])

  const handleInputChange = (event) => {
    setEmail(event.target.value)
  }

  const fetchStudents = async () => {
    const response = await fetch(
      new URL(`/courses/${courseId}/students`, 'http://localhost:5000'),
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
      setStudents(data)
    }
  }

  const handleAddStudent = async () => {
    if (email) {
      const response = await fetch(
        new URL(`/courses/${courseId}/invite`, 'http://localhost:5000/'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 'email': email })
        }
      )
      const data = await response.json()
      if (data.error) {
        console.log('ERROR')
        alert('Please input a valid student email address')
      }
      else {
        fetchStudents();
        setEmail('');
      }
    }
    else {
      alert('Please input a valid student email address')
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar />
      <TeacherCourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <h1>Add student:</h1>
            <TextField id="outlined-basic" label="Student Email" variant="outlined" value={email} onChange={handleInputChange} />
            <Button variant="contained" color="secondary" onClick={handleAddStudent}>Add</Button>
        </Box>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {students.map((student, index) => (
                <TableRow key={index}>
                    <TableCell>{student.first_name}</TableCell>
                    <TableCell>{student.last_name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
      </Box>
    </Box>

  )
}

export default TeacherCourseParticipants
