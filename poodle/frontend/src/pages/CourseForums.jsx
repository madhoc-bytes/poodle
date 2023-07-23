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
  Chip,
  Input,
  DialogActions,
} from "@mui/material";
import NavBar from "../components/NavBar";
import CourseSidebar from "../components/CourseSidebar";
import { useParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const formatDate = (dateString) => {

    // Remove the GMT part from the input date string
    const dateStrWithoutGMT = dateString.replace(' GMT', '');
    const date = new Date(dateStrWithoutGMT);
    const currentDate = new Date();

    const timeDifferenceInSeconds = (currentDate - date) / 1000;
    const timeDifferenceInMinutes = timeDifferenceInSeconds / 60;
    const timeDifferenceInHours = timeDifferenceInMinutes / 60;
    const timeDifferenceInDays = timeDifferenceInHours / 24;
    const timeDifferenceInWeeks = timeDifferenceInDays / 7;
    const timeDifferenceInMonths = timeDifferenceInDays / 30;

    if (timeDifferenceInMinutes < 60) {
    return `${Math.floor(timeDifferenceInMinutes)}m`;
    } else if (timeDifferenceInHours < 24) {
    return `${Math.floor(timeDifferenceInHours)}h`;
    } else if (timeDifferenceInDays < 7) {
    return `${Math.ceil(timeDifferenceInDays)}d`;
    } else if (timeDifferenceInMonths < 1) {
    return `${Math.floor(timeDifferenceInWeeks)}w`;
    } else {
    return `${Math.floor(timeDifferenceInMonths)}mth`;
    }
};

const formatDateForPost = (dateString) => {

    // Remove the GMT part from the input date string
    const dateStrWithoutGMT = dateString.replace(' GMT', '');
    const date = new Date(dateStrWithoutGMT);
    const currentDate = new Date();

    const timeDifferenceInSeconds = (currentDate - date) / 1000;
    const timeDifferenceInMinutes = timeDifferenceInSeconds / 60;
    const timeDifferenceInHours = timeDifferenceInMinutes / 60;
    const timeDifferenceInDays = timeDifferenceInHours / 24;
    const timeDifferenceInWeeks = timeDifferenceInDays / 7;
    const timeDifferenceInMonths = timeDifferenceInDays / 30;

    if (timeDifferenceInMinutes < 60) {
    return `${Math.floor(timeDifferenceInMinutes)} mins ago`;
    } else if (timeDifferenceInHours < 24) {
    return `${Math.floor(timeDifferenceInHours)} hrs ago`;
    } else if (timeDifferenceInDays < 7) {
    return `${Math.ceil(timeDifferenceInDays)} days ago`;
    } else if (timeDifferenceInMonths < 1) {
    return `${Math.floor(timeDifferenceInWeeks)} weeks ago`;
    } else {
    return `${Math.floor(timeDifferenceInMonths)} months ago`;
    }
};


const CourseForums = () => {
    const courseId = useParams().courseId;
    const token = localStorage.getItem("token");
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchPost, setSearchPost] = useState('')
    const [forumPosts, setForumPosts] = useState([]);
    const [currPostId, setCurrPostId] = useState(null);
    const [currPost, setCurrPost] = useState(null);
    const [replyAnswer, setReplyAnswer] = useState('');

    // Create new post popup
    const [newPostTitle, setNewPostTitle] = useState('');
    const categories = ['General', 'Quizzes', 'Lectures', 'Assignments'];
    const [newPostCategory, setNewPostCategory] = useState('General');
    const [newPostFile, setNewPostFile] = useState(null);
    const [newPostDescription, setNewPostDescription] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [errors, setErrors] = useState({});



    useEffect(() => {
        fetchForumPosts();
    }, [selectedCategory, searchPost]);

    const fetchForumPosts = async () => {
        console.log('hi')
        const response = await fetch(
        new URL(`/courses/${courseId}/forums/category/${selectedCategory}/search/${searchPost}`, "http://localhost:5000/"),
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
            console.log("ERROR");
        } else {
            console.log(data)
            setForumPosts(data);
            console.log('SUCCESS')
        }
    };

    useEffect(() => {
        fetchForumPostandAnswers();
    }, [currPostId]);

    const fetchForumPostandAnswers = async () => {
        if (currPostId === null) {
            return;
        }
        const response = await fetch(
            new URL(`/courses/${courseId}/forums/post/${currPostId}`, "http://localhost:5000/"),
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
            console.log("ERROR");
        } else {
            console.log(data)
            setCurrPost(data);
            console.log('SUCCESS')
        }
    };
    
    const handleCreatePost = async () => {
        let newErrors = {};

        if (newPostTitle.trim() === '') {
            newErrors.title = 'Title cannot be empty';
        }
        if (newPostDescription.trim() === '') {
            newErrors.description = 'Description cannot be empty';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const response = await fetch(
            new URL(`/courses/${courseId}/forums/post-forum`, "http://localhost:5000/"),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newPostTitle,
                    category: newPostCategory,
                    // file: newPostFile,
                    description: newPostDescription,
                }),
            }
        );
        const data = await response.json();
        if (data.error) {
            console.log("ERROR");
        } else {
            console.log("SUCCESS");
            handleUploadPostFile(data.post_id)
            setOpenModal(false);
            setNewPostTitle('');
            setNewPostCategory('General');
            // setNewPostFile(null);
            setNewPostDescription('');
            fetchForumPosts();

        }
    }

    const handleUploadPostFile = async (postId) => {
        console.log(postId)

        if (!newPostFile) {
            return;
        }
        const formData = new FormData();
        formData.append('file', newPostFile);

        const response = await fetch(
            new URL(`/courses/forums/post/${postId}/attach-file`, "http://localhost:5000/"),
            {
                method: "PUT",
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
            console.log("SUCCESS");
            setNewPostFile(null);
        }
    }

    const handleReplyPost = async (postId) => {
        if (replyAnswer.trim() === '') {
            alert("answer can't be empty")
            return;
        }
        const response = await fetch(
            new URL(`/courses/forums/${postId}/post-answer`, "http://localhost:5000/"),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    answer: replyAnswer,
                }),
            }
        );
        const data = await response.json();
        if (data.error) {
            console.log("ERROR");
        }
        else {
            console.log("SUCCESS");
            setReplyAnswer('');
            fetchForumPosts();
            fetchForumPostandAnswers();
        }
    }


    const PostCard = ({ post }) => {
        return (
            <Box sx={{ 
                width: "100%", 
                marginBottom: "10px", 
                backgroundColor: currPostId === post.post_id ? "green": "pink", 
                "&:hover": {
                    backgroundColor: "green", // Change background color on hover
                    cursor: "pointer" // Show pointer cursor on hover
                  }
            }}
            onClick={() => {setReplyAnswer(''); setCurrPostId(post.post_id);}} // Add click event listener
            >
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Typography variant="h6">{post.title}</Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <Typography variant="subtitle1">{post.category}</Typography>
                    <Typography variant="subtitle1">{post.first_name} {post.last_name}</Typography>
                </Box>
                <Typography variant="body1">{formatDate(post.date_posted)}</Typography>
                <Typography variant="body1">
                    <ChatBubbleIcon />
                    {post.num_replies}</Typography>
            </Box> 
        )
    }

    return (
        <Box sx={{ display: "flex" }}>
        <NavBar />
        <CourseSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}>
            <Toolbar />

            <Box sx={{display: 'flex'}}>
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
                            onChange={(e) => {setSearchPost(e.target.value);}}
                            label="Search"
                            // variant="outlined"
                            placeholder="Search..."
                            size="small"
                        />
                        {/* <IconButton type="submit" sx={{ borderRadius: 0, backgroundColor: 'purple'}} onClick={fetchForumPosts}>
                            <SearchIcon style={{ fill: "white" }} />
                        </IconButton> */}
                    </Box>
                    {/* Category Dropdown */}
                    <FormControl variant="filled">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="All">All</MenuItem>
                            {categories.map((category, index) => (
                                <MenuItem key={index} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* List of things - will overflow if it goes off the page*/}
                    <List sx={{ overflowY: 'auto', height: '100%' }}>
                        {forumPosts.map((post, index) => (
                            <PostCard key={index} post={post} />
                        ))}
                    </List>

                </Box>

                <Box sx={{flexGrow: 1, height: '89vh', overflowY: 'auto'}}>
                    {/* Post content */}
                    {currPost === null ? (
                        <Box sx={{backgroundColor: 'pink', display: 'flex', width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <>
                            <QuestionAnswerIcon sx={{ fontSize: 200 }} />
                            </>
                            <Typography variant="h4">
                            Select a thread
                            </Typography>
                                
                        </Box>
                    ) : (
                        // Display Post
                        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', overflowY: 'auto'}}>
                            <Typography variant="h2">{currPost.title}</Typography>
                            <Typography variant="h4">Category: {currPost.category}</Typography>
                            <Typography variant="h5">author: {currPost.first_name} {currPost.last_name}</Typography>
                            <Typography variant="h6">{formatDateForPost(currPost.date_posted)}</Typography>
                            <Typography variant="body1">{currPost.description}</Typography>

                            {/* Show answers */}
                            <Typography variant="h4">{currPost.replies.length} Answers</Typography>
                            {currPost.replies.map((reply, index) => (
                                <Box key={index} sx={{display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: 'pink', marginBottom: '10px'}}>
                                    <Typography variant="h6">{reply.first_name} {reply.last_name}</Typography>
                                    <Typography variant="body1">{reply.answer}</Typography>
                                    <Typography variant="body1">{formatDateForPost(reply.date_posted)}</Typography>
                                </Box>
                            ))}
                            <Typography variant="h4">Your Answer</Typography>
                            <TextField
                                label="Reply"
                                margin="normal"
                                multiline
                                fullWidth
                                rows={4}
                                value={replyAnswer}
                                onChange={(e) => setReplyAnswer(e.target.value)}
                            />
                            <Button variant="contained" color="secondary" onClick={() => handleReplyPost(currPostId)}>Post</Button>
                        </Box>
                    )}
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
                    Create New Post
                </DialogTitle>
                <DialogContent>
                    {/* Title */}
                    <TextField
                        autoFocus
                        error={!!errors.title}
                        helperText={errors.title}
                        label="Title"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        fullWidth
                        margin="dense"
                        variant="standard"
                    />
                    {/* Category */}
                    <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                        <Typography variant="subtitle1">Category:</Typography>
                        {categories.map((category, index) => (
                            <Chip
                                key={index}
                                label={category}
                                clickable
                                color={newPostCategory === category ? 'primary' : 'default'}
                                onClick={() => setNewPostCategory(category)}
                            />
                        ))}
                    </Box>
                    {/* Attachment */}
                    <InputLabel
                        sx={{
                            fontSize: 12,
                            mb: 0,
                            color: "black",
                        }}
                        >
                        Attach optional file (pdf, ppt, jpg, png)
                    </InputLabel>
                    <Input
                        type="file"
                        accept=".pdf,.ppt,.pptx,.jpg,.png"
                        onChange={(e) => setNewPostFile(e.target.files[0])}
                        fullWidth
                    />
                    {/* Description */}
                    <TextField
                    error={!!errors.description}
                    helperText={errors.description}
                    label="Description"
                    margin="normal"
                    multiline
                    fullWidth
                    rows={4}
                    value={newPostDescription}
                    onChange={(e) => setNewPostDescription(e.target.value)}
                    />
                </DialogContent>
                {/* Post button */}
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
                    onClick={handleCreatePost}
                    sx={{ marginBottom: "20px" }}
                >
                    Post
                </Button>
                </DialogActions>
                
            </Dialog>
        </Box>
    );
};

export default CourseForums;
