import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'
import './App.css'
import TeacherCourseParticipants from './pages/TeacherCoursePages/TeacherCourseParticipants'
import TeacherCourseClasses from './pages/TeacherCoursePages/TeacherCourseClasses'
import OnlineClass from './pages/OnlineClass'
import StudentCourseParticipants from './pages/StudentCoursePages/StudentCourseParticipants'
import StudentCourseClasses from './pages/StudentCoursePages/StudentCourseClasses'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Teacher Course pages */}
        <Route path="/teacher/:courseId/Participants" element={<TeacherCourseParticipants />} />
        <Route path="/teacher/:courseId/Content" element={<TeacherCourseParticipants />} />
        <Route path="/teacher/:courseId/Classes" element={<TeacherCourseClasses />} />

        <Route path="/teacher/:courseId/Quizzes" element={<TeacherCourseParticipants />} />
        <Route path="/teacher/:courseId/Assignments" element={<TeacherCourseParticipants />} />
        <Route path="/teacher/:courseId/Forums" element={<TeacherCourseParticipants />} />
        <Route path="/teacher/:courseId/Leaderboards" element={<TeacherCourseParticipants />} />

        {/* Student Course Pages */}
        <Route path="/student/:courseId/Participants" element={<StudentCourseParticipants />} />
        <Route path="/student/:courseId/Classes" element={<StudentCourseClasses />} />

        <Route path="/OnlineClass/:courseId/:roomId" element={<OnlineClass />} />

      </Routes>
    </BrowserRouter>

  )
}

export default App
