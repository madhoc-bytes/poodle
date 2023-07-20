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
import { Delete } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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

const TeacherCourseContent = () => {
  const token = localStorage.getItem("token");

  const [folderName, setFolderName] = useState("");
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

  const FolderListItem = ({ folder, onDelete, onDeleteFile }) => {
    const token = localStorage.getItem("token");

    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [newFileTitle, setNewFileTitle] = useState("");
    const [newFile, setNewFile] = useState(null);

    const handleToggle = () => {
      setOpen(!open);
    };

    const handleDeleteFolder = (event) => {
      event.stopPropagation();
      onDelete(folder.id);
    };

    const handleDeleteFile = (fileId) => {
      onDeleteFile(fileId);
    };

    const handleOpenModal = () => {
      setOpenModal(true);
    };

    const handleCloseModal = () => {
      setOpenModal(false);
      setNewFileTitle("");
      setNewFile(null);
    };

    const handleCreateFile = async () => {
      // Perform create file logic here
      const formData = new FormData();
      formData.append("fileName", newFileTitle);
      formData.append("file", newFile);

      console.log(formData);
      const response = await fetch(
        new URL(`/courses/${folder.id}/create-file`, "http://localhost:5000/"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.error) {
        console.log("ERROR");
      } else {
        console.log(data.message);
        getContent();
      }

      handleCloseModal();
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      setNewFile(file);
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
          {/* <IconButton edge="end" onClick={handleDeleteFolder}>
            <DeleteIcon />
          </IconButton> */}
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
                {/* <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction> */}
              </ListItem>
            ))}
            <ListItem sx={{ pl: 4 }}>
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={handleOpenModal}>
                  <AddCircleIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Collapse>

        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Add a file</DialogTitle>
          <DialogContent>
            {/* <TextField
              label="Title"
              value={newFileTitle}
              onChange={(e) => setNewFileTitle(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            /> */}
            <input
              type="file"
              accept=".pdf,.ppt,.pptx,.jpg,.png"
              onChange={handleFileChange}
            />
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreateFile}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
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

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleCreateFolder = async () => {
    // Make sure folder name isn't empty
    if (folderName.trim() !== "") {
      // TODO: Make a fetch request to create a folder when backend is ready
      const response = await fetch(
        new URL(`/courses/${courseId}/create-folder`, "http://localhost:5000/"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ folderName: folderName }),
        }
      );
      const data = await response.json();
      if (data.error) {
        console.log("eerrrr");
      } else {
        console.log(data.folder_id);
        console.log("Creating folder with name: " + folderName);
        setFolderName("");
        getContent();
      }
    } else {
      alert("Please provide a folder name");
    }
  };

  useEffect(() => {
    getContent();
  }, []);

  const handleDeleteFolder = (folderId) => {
    console.log("Deleting folder with id: " + folderId);
  };

  const handleDeleteFile = (fileId) => {
    console.log("Deleting file with id: " + fileId);
  };

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

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <h2>Create Folder:</h2>
            <TextField
              id="outlined-basic"
              label="Enter Folder Name"
              variant="outlined"
              value={folderName}
              onChange={handleFolderNameChange}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCreateFolder}
            >
              Create
            </Button>
          </Box>

          <List style={folderListStyle}>
            {content.map((folder) => (
              <FolderListItem
                key={folder.id}
                folder={folder}
                onDelete={handleDeleteFolder}
                onDeleteFile={handleDeleteFile}
              />
            ))}
          </List>
        </Box>
      </Box>
      <Box id="chatbot"></Box>
    </>
  );
};

export default TeacherCourseContent;
