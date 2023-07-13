import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import Box from "@mui/material/Box";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import { useParams } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import { Typography } from "@mui/material";

const SearchResult = (props) => {
  const searchInput = props.steps["search-input"].value;
  const courseId = useParams().courseId;

  const [searchFiles, setSearchFiles] = useState([
    {
      file_path: "1.pdf",
      name: "1.pdf",
    },
    {
      file_path: "1.pdf",
      name: "2.pdf",
    },
  ]);

  // useEffect(() => {
  //   const fetchSearchFiles = async () => {
  //     const response = await fetch(
  //       new URL(
  //         `course/${courseId}/content/search/${searchInput}`,
  //         "http://localhost:5000"
  //       ),
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authrorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       }
  //     );

  //     const data = await response.json();
  //     if (data.error) {
  //       console.log("error");
  //     } else {
  //       setSearchFiles(data);
  //     }
  //   };
  //   fetchSearchFiles();
  // }, [searchInput, courseId]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">Content Files</Typography>
        {searchFiles.map((file, index) => (
          <Box>
            <BrowserRouter>
              <Link to={file.file_path} target="_blank" download>
                {searchInput}
              </Link>
            </BrowserRouter>
          </Box>
        ))}
      </Box>
    </>
  );
};

const WikiSearch = (props) => {
  const [data, setData] = useState("hello there");
  const searchInput = props.steps["wiki-input"].value;

  useEffect(() => {
    fetch(
      `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${searchInput}&limit=1&format=json`
    )
      .then((response) => response.json())
      .then((data) => setData(data[1][0]))
      .catch(() => setData("failed to fetch data"));
  }, []);

  return (
    <div>
      {searchInput}
      {data !== null ? <p>Result: {data}</p> : <p>No results found.</p>}
    </div>
  );
};

const steps = [
  {
    id: "0",
    message: "Hi there!",
    trigger: "2",
  },
  {
    id: "2",
    message: "What would you like help with?",
    trigger: "3",
  },
  {
    id: "3",
    options: [
      { value: 1, label: "Search content", trigger: "4" },
      { value: 2, label: "WikiApi", trigger: "5" },
    ],
  },
  {
    id: "4",
    message: "What file content would you like to search for?",
    trigger: "search-input",
  },
  {
    id: "search-input",
    user: true,
    trigger: "search-result",
  },
  {
    id: "search-result",
    component: <SearchResult />,
    trigger: "2",
  },
  {
    id: "5",
    message: "Input a word to ask wiki about",
    trigger: "wiki-input",
  },
  {
    id: "wiki-input",
    user: true,
    trigger: "wiki-result",
  },
  {
    id: "wiki-result",
    component: <WikiSearch />,
    trigger: "2",
  },
];

const theme = {
  background: "#bde0fe",
  headerBgColor: "#cdb4db",
  headerFontSize: "20px",
  botBubbleColor: "#ffafcc",
  headerFontColor: "white",
  botFontColor: "white",
  userBubbleColor: "#ffc8dd",
  userFontColor: "white",
};

const CourseChatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zindex: 9999 }}>
        <IconButton onClick={toggleChat} sx={{ backgroundColor: "#ffafcc" }}>
          <AccessibleForwardIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
      {isChatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            right: -30,
            width: 400,
            height: 500,
            zIndex: 9998,
          }}
        >
          <ThemeProvider theme={theme}>
            <ChatBot steps={steps} />
          </ThemeProvider>
        </Box>
      )}
    </>
  );
};

export default CourseChatbot;
