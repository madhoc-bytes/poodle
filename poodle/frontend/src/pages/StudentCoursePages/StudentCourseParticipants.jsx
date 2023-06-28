import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Toolbar } from '@mui/material'
import NavBar from '../../components/NavBar'
import StudentCourseSidebar from '../../components/StudentCourseSidebar'

const StudentCourseParticipants = () => {
  const [students, setStudents] = useState([])
  // const [email, setEmail] = useState('')

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
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
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
