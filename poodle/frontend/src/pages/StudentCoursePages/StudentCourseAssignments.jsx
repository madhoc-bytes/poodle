import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  InputLabel,
  Input,
  DialogActions,
  Link,
  TextField,
  Container,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  CardContent,
  Typography,
  Slide,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import { useParams } from "react-router";
import CourseSidebar from "../../components/CourseSidebar";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StudentCourseAssignments = () => {
  const courseId = useParams().courseId;

  const [assignments, setAssignments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(-1);

  const handleOpenModal = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const response = await fetch(
      // Change the URL when backend is ready
      new URL(`/courses/${courseId}/assignments`, "http://localhost:5000/"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      setAssignments(data);
      console.log(data);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignmentId) {
      alert("Please select an assignment.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    console.log(selectedFile);

    const response = await fetch(
      new URL(
        `/courses/assignments/${selectedAssignmentId}/submit`,
        "http://localhost:5000/"
      ),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      console.log("success");
      handleCloseModal();
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

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar />
      <CourseSidebar />
      <Box
        sx={{
          p: 5,
          flexGrow: "1",
        }}
      >
        <Toolbar />
        <Box>
          <h1>Course Assignments</h1>
        </Box>

        <List sx={{ display: "flex", flexWrap: "wrap" }}>
          {assignments.map((assignment) => (
            <ListItem
              key={assignment.id}
              sx={{
                margin: "10px",
                padding: "10px",
                maxWidth: "400px",
                display: "flex",
                alignItems: "center",
                wordWrap: "break-word",
              }}
            >
              <Card
                sx={{
                  width: "400px",
                  borderRadius: "20px",
                  boxShadow:
                    "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
                }}
              >
                <CardContent>
                  <Typography variant="h5">{assignment.title}</Typography>
                  <Typography variant="body1">
                    {assignment.description}
                  </Typography>
                  <Typography variant="body2">
                    Due Date: {assignment.due_date}
                  </Typography>
                  <Typography variant="body2">
                    Max mark: {assignment.max_marks}
                  </Typography>
                  {assignment.spec_file_id && (
                    <Link
                      onClick={() => handleGetFile(assignment.spec_file_id)}
                    >
                      Specification
                    </Link>
                  )}
                  <br />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenModal(assignment.id)}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>

        <Dialog
          PaperProps={{
            style: { borderRadius: 15 },
          }}
          open={openModal}
          onClose={handleCloseModal}
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
            Submit Assignment
          </DialogTitle>
          <DialogContent sx={{ m: 2 }}>
            <Input
              type="file"
              accept=".pdf,.ppt,.pptx"
              onChange={handleFileChange}
              fullWidth
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
              sx={{ marginBottom: "20px" }}
              variant="contained"
              color="secondary"
              onClick={handleSubmitAssignment}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default StudentCourseAssignments;
