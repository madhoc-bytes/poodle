import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogActions,
  Toolbar,
  DialogContent,
  Input,
  InputLabel,
  List,
  ListItem,
  Link,
  ListItemText,
  Paper,
  Slide,
} from "@mui/material";
import NavBar from "../../components/NavBar";
import CourseSidebar from "../../components/CourseSidebar";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TeacherCourseAssignments = () => {
  const courseId = useParams().courseId;

  const [assignments, setAssignments] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(-1);

  const handleOpenModal = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    if (assignmentId != -1) {
      const editingAssignment = assignments.find(
        (assignment) => assignment.id === assignmentId
      );
      if (editingAssignment) {
        setTitle(editingAssignment.title);
        setDueDate(editingAssignment.dueDate);
        setMaxMarks(editingAssignment.maxMarks);
        setDescription(editingAssignment.description);
      }
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setTitle("");
    setMaxMarks(100);
    setDueDate("");
    setDescription("");
    setSelectedAssignmentId(-1);
    setSelectedFile();
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

  const handleCreateAssignment = async () => {
    const response = await fetch(
      // Change the URL when backend is ready
      new URL(
        `/courses/${courseId}/assignments/create`,
        "http://localhost:5000/"
      ),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, dueDate, maxMarks }),
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      setSelectedAssignmentId(data.assignment_id);
      handleUploadSpec(data.assignment_id);
      fetchAssignments();
      handleCloseModal();
    }
  };

  const handleEditAssignment = async () => {
    handleUploadSpec(selectedAssignmentId);

    const response = await fetch(
      new URL(
        `/courses/assignments/${selectedAssignmentId}/edit`,
        "http://localhost:5000/"
      ),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description }),
      }
    );
    const data = await response.json();
    if (data.error) {
      console.log("ERROR");
    } else {
      fetchAssignments();
      handleCloseModal();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadSpec = async (assignmentId) => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    // formData.append("fileName", "a");
    formData.append("file", selectedFile);

    const response = await fetch(
      new URL(
        `/courses/assignments/${assignmentId}/specification`,
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
      // }
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
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            handleOpenModal(-1);
          }}
        >
          Create Assignment
        </Button>

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
              <Card sx={{ width: "400px" }}>
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
                  <Link onClick={() => handleGetFile(assignment.spec_file_id)}>
                    Specification
                  </Link>
                  <br />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenModal(assignment.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      window.open(
                        `/teacher/${courseId}/assignment-grade/${assignment.id}`
                      )
                    }
                  >
                    Grade
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
            {selectedAssignmentId
              ? "Edit Assignment"
              : "Create a New Assignment"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="dense"
              variant="standard"
            />
            {selectedAssignmentId === -1 ? (
              <TextField
                type="number"
                label="Max mark"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                fullWidth
                margin="normal"
                variant="standard"
              />
            ) : (
              <></>
            )}
            {selectedAssignmentId === -1 ? (
              <TextField
                label="Due date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                margin="normal"
                variant="standard"
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <></>
            )}

            <TextField
              label="Description"
              margin="normal"
              multiline
              fullWidth
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <InputLabel
              sx={{
                fontSize: 12,
                mb: 0,
                color: "black",
              }}
            >
              Upload assignment specification
            </InputLabel>
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
              onClick={
                selectedAssignmentId === -1
                  ? handleCreateAssignment
                  : handleEditAssignment
              }
            >
              {selectedAssignmentId === -1 ? "Create" : "Edit"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default TeacherCourseAssignments;
