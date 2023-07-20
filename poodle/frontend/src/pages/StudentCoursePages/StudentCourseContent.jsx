import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Box,
  Toolbar,
  Collapse,
  ListItemSecondaryAction,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "../../components/NavBar";
import CourseSidebar from "../../components/CourseSidebar";
import FolderIcon from "@mui/icons-material/Folder";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import DescriptionIcon from "@mui/icons-material/Description";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useParams } from "react-router";
import { render } from "react-dom";
import CourseChatbot from "../../components/CourseChatbot";

const folderListStyle = {
  backgroundColor: "#f5f5f5", // Set the background color to grey
  borderRadius: "4px", // Add some border radius
};

const listItemStyle = {
  marginBottom: "8px", // Add margin bottom between list items
};

const StudentCourseContent = () => {
  const token = localStorage.getItem("token");
  const [content, setContent] = useState([]);
  const courseId = useParams().courseId;

  useEffect(() => {
    const chatbotContainer = document.getElementById("chatbot");
    if (chatbotContainer) {
      render(<CourseChatbot courseId={courseId} />, chatbotContainer);
      console.log("chatbot container found");
    } else {
      console.log("chatbot container not found");
    }
  }, []);

  const FolderListItem = ({ folder }) => {
    const token = localStorage.getItem("token");

    const [open, setOpen] = useState(false);
    const handleToggle = () => {
      setOpen(!open);
    };

    return (
      <React.Fragment>
        <ListItem
          sx={{ margin: "10px", backgroundColor: "#a3a3a3" }}
          onClick={handleToggle}
          style={listItemStyle}
        >
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={folder.name} />
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={handleToggle}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {folder.files.map((file) => (
              <ListItem key={file.id} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <DescriptionIcon />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => handleOpenFile(file.id)}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </React.Fragment>
    );
  };

  const getContent = async () => {
    const response = await fetch(
      new URL(`/course/${courseId}/content`, "http://localhost:5000/"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("eerrrr");
    } else {
      console.log(data);
      setContent(data);
    }
  };

  useEffect(() => {
    getContent();
  }, []);

  const handleOpenFile = async (fileId) => {
    const response = await fetch(
      new URL(`/courses/download-file/${fileId}`, "http://localhost:5000/"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.blob();
    if (data.error) {
      console.log("error");
    } else {
      console.log(data);
      let url = window.URL.createObjectURL(data);
      window.open(url);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <NavBar />
        <CourseSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <h1>Course Content</h1>
          </Box>

          <List style={folderListStyle}>
            {content.map((folder) => (
              <FolderListItem key={folder.id} folder={folder} />
            ))}
          </List>
        </Box>
      </Box>
      <Box id="chatbot"></Box>
    </>
  );
};

export default StudentCourseContent;
