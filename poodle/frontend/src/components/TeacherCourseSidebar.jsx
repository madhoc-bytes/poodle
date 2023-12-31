import React, { useState } from 'react'
import { Drawer, Box, List, ListItem, ListItemText } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

const drawerWidth = 240

const itemsList = [
  'Participants',
  'Content',
  'Classes',
  'Quizzes',
  'Assignments',
  'Forums',
  'Leaderboard'
]

const TeacherCourseSidebar = () => {
  const navigate = useNavigate()

  const [selected, setSelected] = useState(itemsList[0])
  const courseId = useParams().courseId

  const handleListItemClick = (item) => {
    setSelected(item)
    navigate(`/teacher/${courseId}/${item}`)
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginTop: '56px' }}>
        <List>
          {itemsList.map((item, index) => (
            <ListItem button key={index} selected={selected === item} onClick={() => handleListItemClick(item)}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default TeacherCourseSidebar
