import React, { useEffect, useState } from 'react'
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Toolbar } from '@mui/material'
import NavBar from '../../components/NavBar'
import StudentCourseSidebar from '../../components/StudentCourseSidebar'
import { useParams } from 'react-router-dom'

const StudentCourseParticipants = () => {
  const [students, setStudents] = useState([])

  const token = localStorage.getItem('token');
  const courseId = useParams().courseId;

  useEffect(() => {
    fetchStudents();
  }, [])

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

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar />
      <StudentCourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
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

export default StudentCourseParticipants
