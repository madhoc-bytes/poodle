import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import { Box, Typography } from "@mui/material";

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

        <Box sx={{backgroundColor: 'white', margin: '10px'}}>
            <Typography variant="h4" sx={{backgroundColor: 'yellow'}}>
                Timeline
            </Typography>
            {/* Desconstruct the timeline */}
            {timeline.map((item) => (
                <>
                <Box sx={{display: 'flex', flexDirection: 'Column'}}>
                    <Typography fontWeight={'bold'}>
                        {new Date(item.due_date).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </Typography>
                    <Box sx={{display: 'flex'}}>
                        <Typography>
                            {new Date(item.due_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </Typography>
                        {item.type === 'Assignments' ? <AssignmentIcon/> : <QuizIcon/>}
                        <Typography 
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                            onClick={() => navigate(`/student/${item.course_id}/${item.type}`)}
                        >
                            {item.course_name}: {item.title}
                        </Typography>

                    </Box>

                </Box>
                <hr/>
                </>
            ))}
        </Box>
    )
}


export default DashboardTimeline;


