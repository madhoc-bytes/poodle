import React, { useState } from "react";
import { Drawer, Box, List, ListItem, Typography } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const drawerWidth = 240;

const itemsList = [
  "Participants",
  "Content",
  "Classes",
  "Quizzes",
  "Assignments",
  "Forums",
  "Leaderboard",
];

const CourseSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selected, setSelected] = useState(itemsList[0]);
  const courseId = useParams().courseId;

  // Set the initially selected button based on the current location
  useState(() => {
    const currentPath = location.pathname.split("/").pop();
    if (itemsList.includes(currentPath)) {
      setSelected(currentPath);
    } else {
      setSelected(itemsList[0]);
    }
  }, [location.pathname]);

  const handleListItemClick = (item) => {
    setSelected(item);
    if (location.pathname.includes("/teacher")) {
      navigate(`/teacher/${courseId}/${item}`);
    } else {
      navigate(`/student/${courseId}/${item}`);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          marginTop: "56px",
        }}
      >
        <List>
          {itemsList.map((item, index) => (
            <ListItem
              key={index}
              onClick={() => handleListItemClick(item)}
              sx={{
                backgroundColor: selected === item ? "#9575DE" : "inherit",
                "&:hover": {
                  backgroundColor: "#9575DE",
                },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {item}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default CourseSidebar;
