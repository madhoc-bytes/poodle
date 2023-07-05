import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, IconButton, Box, Toolbar, Collapse, ListItemSecondaryAction, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NavBar from '../../components/NavBar';
import TeacherCourseSidebar from '../../components/TeacherCourseSidebar';
import FolderIcon from '@mui/icons-material/Folder';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import DescriptionIcon from '@mui/icons-material/Description';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const folderListStyle = {
  backgroundColor: '#f5f5f5', // Set the background color to grey
  borderRadius: '4px', // Add some border radius
};

const listItemStyle = {
  marginBottom: '8px', // Add margin bottom between list items
};

const FolderListItem = ({ folder, onDelete, onDeleteFile }) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [newFileTitle, setNewFileTitle] = useState('');
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
    setNewFileTitle('');
    setNewFile(null);
  };

  const handleCreateFile = () => {
    // Perform create file logic here
    const formData = new FormData();
    formData.append('folderId', folder.id);
    formData.append('title', newFileTitle);
    formData.append('file', newFile);

    // TODO: Make a fetch request to create a file when backend is ready
    fetch('/createFile', {
      method: 'POST',
      body: formData
    })
      .then((response) => {
        if (response.ok) {
          // Handle successful file creation
          console.log('File created successfully');
        } else {
          // Handle error case
          throw new Error('Failed to create file');
        }
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
      });

    handleCloseModal();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewFile(file);
  };

  return (
    <React.Fragment>
      <ListItem sx={{margin: '10px', backgroundColor: '#a3a3a3'}} onClick={handleToggle} style={listItemStyle}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={folder.description} />
        <IconButton edge="end" onClick={handleDeleteFolder}>
          <DeleteIcon />
        </IconButton>
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
              <ListItemText primary={file.description} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteFile(file.id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          <ListItem sx={{ pl: 4 }}>
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={handleOpenModal}>
                <AddCircleIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Collapse>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Create new file</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={newFileTitle}
            onChange={(e) => setNewFileTitle(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <input
            type="file"
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleCreateFile}>Create</Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
};



const TeacherCourseContent = () => {
  const [folderName, setFolderName] = useState('');
  const [folders, setFolders] = useState([]);

  // Dummy content will be replaced by folders when backend is ready
  const dummyContent = [
    {
      "description": "This is a folder",
      "id": 1,
      "files": [
        {
          "description": "This is a file",
          "id": 1,
        },
        {
          "description": "This is another file",
          "id": 2,
        }
      ]
    }, 
    {
      "description": "This is another folder",
      "id": 2,
      "files": [
        {
          "description": "This is a file",
          "id": 3,
        },
      ]
    },
    {
      "description": "This is yet another folder",
      "id": 3,
      "files": []
    }
  ]

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleCreateFolder = () => {
    // Make sure folder name isn't empty
    if (folderName.trim() !== '') {
      // TODO: Make a fetch request to create a folder when backend is ready 

      console.log("Creating folder with name: " + folderName);
      setFolderName('');
    }
  };

  const handleDeleteFolder = (folderId) => {
    console.log("Deleting folder with id: " + folderId);
  }

  const handleDeleteFile = (fileId) => {
    console.log("Deleting file with id: " + fileId);
  }

  return (
    <>
    <Box sx={{ display: 'flex' }}>
        <NavBar />
        <TeacherCourseSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <h1>Course Content</h1>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <h2>Create Folder:</h2>
              <TextField id="outlined-basic" label="Enter Folder Name" variant="outlined" value={folderName} onChange={handleFolderNameChange} />
              <Button variant="contained" color="secondary" onClick={handleCreateFolder}>Create</Button>
          </Box>

          <List style={folderListStyle}>
            {dummyContent.map((folder) => (
              <FolderListItem key={folder.id} folder={folder} onDelete={handleDeleteFolder} onDeleteFile={handleDeleteFile} />
            ))}
          </List>

        </Box>
    </Box>
    </>

  )

};

export default TeacherCourseContent;
