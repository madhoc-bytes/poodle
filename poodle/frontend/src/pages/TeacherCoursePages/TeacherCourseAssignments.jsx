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
  const [errors, setErrors] = useState({});

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
    let newErrors = {};

    if (title.trim() === "") {
      newErrors.title = "Assignment title cannot be empty.";
    }

    if (maxMarks <= 0) {
      newErrors.maxMarks = "Max marks must be greater than 0.";
    }

    if (dueDate.trim() === "" || isNaN(new Date(dueDate).getTime())) {
      newErrors.dueDate = "Invalid due date.";
    }

    if (description.trim() === "") {
      newErrors.description = "Assignment description cannot be empty.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
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
        console.log(dueDate);
        setSelectedAssignmentId(data.assignment_id);
        handleUploadSpec(data.assignment_id);
        fetchAssignments();
        handleCloseModal();
      }
    }
  };

  const handleEditAssignment = async () => {
    let newErrors = {};

    if (title.trim() === "") {
      newErrors.title = "Assignment title cannot be empty.";
    }

    if (description.trim() === "") {
      newErrors.description = "Assignment description cannot be empty.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
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
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadSpec = async (assignmentId) => {
    if (!selectedFile) {
      return;
    } else {
      const formData = new FormData();
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
          p: 3,
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
                    Due Date: {assignment.due_date.slice(0, -7)}
                  </Typography>
                  <Typography variant="body2">
                    Max mark: {assignment.max_marks}
                  </Typography>
                  {assignment.spec_file_id && (
                    <>
                      <Typography variant="body2">
                        Spec:{" "}
                        <Link
                          onClick={() => handleGetFile(assignment.spec_file_id)}
                        >
                          {assignment.spec_name}
                        </Link>{" "}
                      </Typography>
                    </>
                  )}

                  <Button
                    sx={{ m: 1 }}
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
              error={!!errors.title}
              helperText={errors.title}
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="dense"
              variant="standard"
            />
            {selectedAssignmentId === -1 ? (
              <TextField
                error={!!errors.maxMarks}
                helperText={errors.maxMarks}
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
                error={!!errors.dueDate}
                helperText={errors.dueDate}
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
              error={!!errors.description}
              helperText={errors.description}
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
              accept=".pdf,.ppt,.pptx,.jpg,.png"
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
