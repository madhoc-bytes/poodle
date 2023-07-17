import React, { useState } from "react";
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
  const navigate = useNavigate();

  //   const [assignments, setAssignments] = useState([]);
  const assignments = [
    {
      id: 1,
      title: "yeehaw",
      description: "meowmeowmeowmoeawiopemawiomewaoe",
      dueDate: "2023-07-18T02:20",
      maxMarks: 100,
    },
    {
      id: 2,
      title: "rawr",
      description: "lets fucking ggooooo",
      dueDate: "2023-07-18T02:20",
      maxMarks: 3000,
    },
  ];
  const [openModal, setOpenModal] = useState(false);

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);
  const [description, setDescription] = useState("");
  const [fileId, setFileId] = useState();

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
    setFileId();
    setSelectedAssignmentId(-1);
  };

  const handleCreateAssignment = () => {};

  const handleEditAssignment = () => {};

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
                    Due Date: {assignment.dueDate}
                  </Typography>
                  <Typography variant="body2">
                    Max mark: {assignment.maxMarks}
                  </Typography>
                  <input type="file" />
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
              <TextField
                readonly
                type="number"
                label="Max mark"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                fullWidth
                margin="normal"
                variant="standard"
                inputProps={{
                  readOnly: true,
                }}
              />
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
              <TextField
                label="Due date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                margin="normal"
                variant="standard"
                InputLabelProps={{ shrink: true, readonly: true }}
              />
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
            <Input type="file" onChange={setFileId} fullWidth />
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
                selectedAssignmentId
                  ? handleEditAssignment
                  : handleCreateAssignment
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
