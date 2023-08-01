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
    <Box
      sx={{
        margin: "20px 30px",
        height: "calc(100% - 64px)",
      }}
    >
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Timeline
      </Typography>
      <Box
        sx={{
          display: "flex",
          height: "90%",
          backgroundColor: "white",
          flexDirection: "column",
          borderRadius: "30px",
          overflowY: "auto",
          boxShadow:
            "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
        }}
      >
        {/* Desconstruct the timeline */}
        {timeline.map((item, index) => (
          <Box key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                minHeight: "70px",
                borderBottom: "1px solid #e0e0e0 ",
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "centre",
                  paddingTop: "10px",
                }}
              >
                <Box>
                  <Typography>
                    {new Date(item.due_date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </Typography>
                </Box>

                {item.type === "Assignments" ? (
                  <AssignmentIcon sx={{ marginLeft: "15px" }} />
                ) : (
                  <QuizIcon sx={{ marginLeft: "15px" }} />
                )}
                <Box sx={{ marginLeft: "20px" }}>
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
                    <Typography
                      variant="h5"
                      sx={{ wordWrap: "break-word", wordBreak: "break-word" }}
                    >
                      {item.course_name} - {item.title}
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardTimeline;
