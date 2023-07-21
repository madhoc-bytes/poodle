import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import { Box, Typography, Link } from "@mui/material";

const DashboardTimeline = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    const response = await fetch(
      new URL("/dashboard/timeline", "http://localhost:5000/"),
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
      setTimeline(data);
      console.log(data);
    }
  };

  return (
    <Box sx={{ margin: "20px 30px" }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Timeline
      </Typography>
      {/* Desconstruct the timeline */}
      {timeline.map((item) => (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "20px",
            }}
            gap={1}
          >
            <Typography fontWeight={"bold"}>
              {new Date(item.due_date).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "flexe" }} gap={5}>
              <Typography>
                {new Date(item.due_date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </Typography>
              {item.type === "Assignments" ? <AssignmentIcon /> : <QuizIcon />}
              <Link
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={() =>
                  navigate(`/student/${item.course_id}/${item.type}`)
                }
              >
                <Typography variant="h5" align="centre">
                  {item.course_name} - {item.title}
                </Typography>
              </Link>
            </Box>
          </Box>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              borderLeft: "2px solid black",
            }}
          />{" "}
        </>
      ))}
    </Box>
  );
};

export default DashboardTimeline;
