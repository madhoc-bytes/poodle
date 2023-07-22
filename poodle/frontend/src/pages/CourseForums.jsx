import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Toolbar,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import NavBar from "../components/NavBar";
import CourseSidebar from "../components/CourseSidebar";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const CourseForums = () => {
    const courseId = useParams().courseId;
    const token = localStorage.getItem("token");
    const [category, setCategory] = useState('All');
    const [searchPost, setSearchPost] = useState('')

    // Create new post popup
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('');
    const [newPostFile, setNewPostFile] = useState(null);
    const [newPostDescription, setNewPostDescription] = useState('');
    const [openModal, setOpenModal] = useState(false);


//   useEffect(() => {
//     fetchForumPosts();
//   }, []);

//   const fetchForumPosts = async () => {
//     const response = await fetch(
//       new URL(`/courses/${courseId}/forums/category/${category}/search/${searchPost}`, "http://localhost:5000/"),
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     const data = await response.json();
//     if (data.error) {
//       console.log("ERROR");
//     } else {
//       setActiveClasses(data);
//     }
//   };


  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <CourseSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}>
        <Toolbar />

        <Box>
            {/* Sidebar with new thread button, search, category selection, and list of posts */}
            <Box sx={{display: 'flex', width: '200px', flexDirection: 'column', padding: '10px', height: '89vh', overflowY: 'auto', backgroundColor: '#d3d3d3'}}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenModal(true)}
                >
                    New Thread
                </Button>
                {/* Search */}
                <Box sx={{ display: 'flex', marginTop: '10px', marginBottom: '10px'}}>
                    <TextField
                        onChange={(e) => setSearchPost(e.target.value)}
                        label="Search"
                        // variant="outlined"
                        placeholder="Search..."
                        size="small"
                    />
                    <IconButton type="submit" sx={{ borderRadius: 0, backgroundColor: 'purple'}}>
                        <SearchIcon style={{ fill: "white" }} />
                    </IconButton>
                </Box>
                {/* Category Dropdown */}
                <FormControl variant="filled">
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="Category"
                    >
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Quizzes">Quizzes</MenuItem>
                        <MenuItem value="Assignments">Assignments</MenuItem>
                    </Select>
                </FormControl>
                {/* List of things */}

            </Box>

        </Box>


      </Box>

        {/* Modal for new forum post */}
        <Dialog
        PaperProps={{
            style: { borderRadius: 15 },
            }}
            open={openModal}
            onClose={() => setOpenModal(false)}
            TransitionComponent={Transition}
            sx={{ borderRadius: "50px" }}
        >
            <DialogTitle
                sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: "-30px",
                }}
            >
                New Post
            </DialogTitle>
            <DialogContent>
                stuff here
            </DialogContent>
            
        </Dialog>
    </Box>
  );
};

export default CourseForums;
