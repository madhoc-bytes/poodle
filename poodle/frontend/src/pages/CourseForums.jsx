import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Divider,
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
  Link,
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
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const formatDate = (dateString) => {
  // Remove the GMT part from the input date string
  const dateStrWithoutGMT = dateString.replace(" GMT", "");
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
  const dateStrWithoutGMT = dateString.replace(" GMT", "");
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchPost, setSearchPost] = useState("");
  const [forumPosts, setForumPosts] = useState([]);
  const [currPostId, setCurrPostId] = useState(null);
  const [currPost, setCurrPost] = useState(null);
  const [replyAnswer, setReplyAnswer] = useState("");

  // Create new post popup
  const [newPostTitle, setNewPostTitle] = useState("");
  const categories = ["General", "Quizzes", "Lectures", "Assignments"];
  const [newPostCategory, setNewPostCategory] = useState("General");
  const [newPostFile, setNewPostFile] = useState(null);
  const [newPostDescription, setNewPostDescription] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchForumPosts();
  }, [selectedCategory, searchPost]);

  const fetchForumPosts = async () => {
    console.log("hi");
    const response = await fetch(
      new URL(
        `/courses/${courseId}/forums/category/${selectedCategory}/search/${searchPost}`,
        "http://localhost:5000/"
      ),
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
      console.log(data);
      setForumPosts(data);
      console.log("SUCCESS");
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
      new URL(
        `/courses/${courseId}/forums/post/${currPostId}`,
        "http://localhost:5000/"
      ),
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
      console.log(data);
      setCurrPost(data);
      console.log("SUCCESS");
    }
  };

  const handleCreatePost = async () => {
    let newErrors = {};

    if (newPostTitle.trim() === "") {
      newErrors.title = "Title cannot be empty";
    }
    if (newPostDescription.trim() === "") {
      newErrors.description = "Description cannot be empty";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const response = await fetch(
      new URL(
        `/courses/${courseId}/forums/post-forum`,
        "http://localhost:5000/"
      ),
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
      handleUploadPostFile(data.post_id);
      setOpenModal(false);
      setNewPostTitle("");
      setNewPostCategory("General");
      // setNewPostFile(null);
      setNewPostDescription("");
      fetchForumPosts();
    }
  };

  const handleUploadPostFile = async (postId) => {
    console.log(postId);

    if (!newPostFile) {
      return;
    }
    const formData = new FormData();
    formData.append("file", newPostFile);

    const response = await fetch(
      new URL(
        `/courses/forums/post/${postId}/attach-file`,
        "http://localhost:5000/"
      ),
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
  };

  const handleGetFile = async (fileId) => {
    const response = await fetch(
      new URL(`/courses/download-file/${fileId}`, "http://localhost:5000/"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const handleReplyPost = async (postId) => {
    if (replyAnswer.trim() === "") {
      alert("answer can't be empty");
      return;
    }
    const response = await fetch(
      new URL(
        `/courses/forums/${postId}/post-answer`,
        "http://localhost:5000/"
      ),
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
    } else {
      console.log("SUCCESS");
      setReplyAnswer("");
      fetchForumPosts();
      fetchForumPostandAnswers();
    }
  };

  const PostCard = ({ post }) => {
    return (
      <Box
        sx={{
          overflow: "hidden",
          paddingBottom: "20px",
          padding: "3px 5px 10px 5px",
          backgroundColor: currPostId === post.post_id && "#a6a6a6",
          borderTop: "1px solid rgba(0, 0, 0, 0.2)",
          "&:hover": {
            backgroundColor: "#a6a6a6", // Change background color on hover
            cursor: "pointer", // Show pointer cursor on hover
          },
        }}
        onClick={() => {
          setReplyAnswer("");
          setCurrPostId(post.post_id);
        }} // Add click event listener
      >
        <Typography variant="h6" sx={{ textOverflow: "clip" }}>
          {post.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }} gap={1}>
            <Chip
              label={post.category}
              color={"primary"}
              size={"small"}
              sx={{ fontSize: "9px" }}
            />{" "}
            <Typography variant="body1">
              {post.first_name} {post.last_name}
            </Typography>
            <Typography variant="body1">
              {formatDate(post.date_posted)}
            </Typography>
          </Box>

          <Typography variant="body1">
            <ChatBubbleIcon sx={{ fontSize: "14px" }} /> {post.num_replies}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <CourseSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          paddingLeft: 0,
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Toolbar />

        <Box sx={{ display: "flex" }}>
          {/* Sidebar with new thread button, search, category selection, and list of posts */}
          <Box
            sx={{
              display: "flex",
              width: "320px",
              flexDirection: "column",
              paddingLeft: "10px",
              height: "calc(100vh - 84px)",
              backgroundColor: "#d3d3d3",
              paddingTop: "20px",
              paddingRight: "10px",
            }}
            gap={1}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenModal(true)}
            >
              New Thread
            </Button>
            {/* Search */}
            <Box
              sx={{ display: "flex", marginTop: "10px", marginBottom: "10px" }}
            >
              <TextField
                onChange={(e) => {
                  setSearchPost(e.target.value);
                }}
                label="Search"
                size={"small"}
                fullWidth
              />
            </Box>
            {/* Category Dropdown */}
            <FormControl>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
                size={"small"}
              >
                <MenuItem value="All">All</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* List of things - will overflow if it goes off the page*/}
            <Box
              sx={{
                overflowY: "auto",
                height: "100%",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#888",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "#555",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#f1f1f1",
                  borderRadius: "4px",
                },
              }}
            >
              <List sx={{ marginRight: "7px" }}>
                {forumPosts.map((post, index) => (
                  <PostCard key={index} post={post} />
                ))}
              </List>
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />

          <Box
            sx={{
              flexGrow: 1,
              height: "89vh",
              overflowY: "auto",
              paddingLeft: "30px",
            }}
          >
            {/* Post content */}
            {currPost === null ? (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <>
                  <QuestionAnswerIcon sx={{ fontSize: 200 }} />
                </>
                <Typography variant="h2">
                  <b>Select a thread</b>
                </Typography>
              </Box>
            ) : (
              // Display Post
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "60vw",
                  overflowY: "auto",
                  wordWrap: "break-word",
                }}
              >
                <Box sx={{ p: 10, paddingTop: "20px", paddingBottom: "30px" }}>
                  <Typography variant="h3">{currPost.title}</Typography>
                  <Typography variant="h5">
                    {currPost.first_name} {currPost.last_name}
                  </Typography>
                  {formatDateForPost(currPost.date_posted)} in{" "}
                  <Chip
                    label={currPost.category}
                    color={"primary"}
                    size={"small"}
                    sx={{ maxWidth: "70px", fontSize: "10px" }}
                  />
                  <Typography variant="body1">
                    {currPost.description}
                  </Typography>
                  {/* {currPost} */}
                  {currPost.file_id && (
                    <Link onClick={() => handleGetFile(currPost.file_id)}>
                      Attachment
                    </Link>
                  )}
                </Box>

                <Box sx={{ p: 15, paddingTop: "0px" }}>
                  {/* Show answers */}
                  <Typography variant="h4" sx={{ paddingBottom: "20px" }}>
                    {currPost.replies.length}{" "}
                    {currPost.replies.length === 1 ? "Answer" : "Answers"}
                  </Typography>
                  {currPost.replies.map((reply, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100%",
                        marginBottom: "25px",
                        // borderTop: "1px solid grey",
                      }}
                    >
                      <Typography
                        variant="h5"
                        display={"inline"}
                        sx={{ marginBottom: "20px", color: "blue" }}
                      >
                        {reply.first_name} {reply.last_name} {"    "}
                      </Typography>
                      <Typography
                        variant="body2"
                        display={"inline"}
                        sx={{ color: "grey" }}
                      >
                        {formatDateForPost(reply.date_posted)}
                      </Typography>

                      <Typography variant="body1">{reply.answer}</Typography>
                    </Box>
                  ))}
                  <Typography variant="h5">Your Answer</Typography>
                  <TextField
                    label="Comment"
                    margin="normal"
                    multiline
                    fullWidth
                    rows={4}
                    value={replyAnswer}
                    onChange={(e) => setReplyAnswer(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleReplyPost(currPostId)}
                  >
                    Post
                  </Button>
                </Box>
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
          <Box display="flex" flexDirection="column" gap={2}>
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
                  color={newPostCategory === category ? "primary" : "default"}
                  onClick={() => setNewPostCategory(category)}
                />
              ))}
            </Box>
            {/* Attachment */}
            <Box>
              <InputLabel
                sx={{
                  fontSize: 12,
                  mb: 0,
                  color: "black",
                }}
              >
                Attach optional file (pdf, ppt, pptx, jpg, png)
              </InputLabel>
              <Input
                type="file"
                accept=".pdf,.ppt,.pptx,.jpg,.png"
                onChange={(e) => setNewPostFile(e.target.files[0])}
                fullWidth
              />
            </Box>

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
          </Box>
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
