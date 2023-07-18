import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import Box from "@mui/material/Box";
import AccessibleForwardIcon from "@mui/icons-material/AccessibleForward";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { BrowserRouter, Link } from "react-router-dom";
import { ListItemText, Typography } from "@mui/material";

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

const CourseChatbot = ({courseId}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

    
    const WikiSearch = (props) => {
        const searchInput = props.steps["wiki-input"].value;
    
        const [firstParagraph, setFirstParagraph] = useState("searching...");

        function removeHtmlTags(str) {
            let doc = new DOMParser().parseFromString(str, 'text/html');
            return doc.body.textContent || "";
        }
        

        useEffect(() => {
            const fetchData = async () => {
            try {
                const response = await fetch(
                `https://en.wikipedia.org/w/api.php?&origin=*&action=query&prop=extracts&format=json&exintro=&titles=${searchInput}`
                );
                const data = await response.json();
                const pages = data.query.pages;
                const pageId = Object.keys(pages)[0];
                console.log(pages[pageId]);
                const extract = pages[pageId].extract;
                const regex = /<p>(.*?)<\/p>/; // Regex to extract the first paragraph
                const match = regex.exec(extract);
                const firstPara = match ? match[1] : ""; // First paragraph extracted from the response

                setFirstParagraph(firstPara);
            } catch (error) {
                console.log("Error fetching data:", error);
            }
            };

            fetchData();
        }, []);

        return (
            <div>
            {firstParagraph === "" ? <p>Sorry, no results found</p> :
                <>
                <h2>First Paragraph from Wikipedia API:</h2>
                <p>{removeHtmlTags(firstParagraph)}</p>
                </>
            }
            </div>
        );
    };

  const SearchResult = (props) => {
    const searchInput = props.steps["search-input"].value;

  const [searchFiles, setSearchFiles] = useState([]);

  const fetchSearchFiles = async () => {
    console.log(courseId);
    console.log(searchInput);
    console.log(localStorage.getItem("token"));
    const response = await fetch(
      new URL(`/course/${courseId}/content/search/${searchInput}`, "http://localhost:5000"),
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
      console.log("error");
    } else {
        console.log(data);
      setSearchFiles(data);
    }
  };

  useEffect(() => {
    fetchSearchFiles();
  }, [searchInput]);

  const handleOpenFile = async (fileId) => {
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
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">Content Files</Typography>
        {searchFiles.map((file, index) => (
          <Box>
            <ListItemText primary={file.name} sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }} onClick={() => handleOpenFile(file.id)}/>
          </Box>
        ))}
      </Box>
    </>
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

  return (
    <>
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zindex: 9999 }}>
        <IconButton onClick={toggleChat} sx={{ backgroundColor: "#ffafcc", height: '70px', width: '70px' }}>
          <SmartToyIcon sx={{ color: "white", fontSize: 50 }} />
        </IconButton>
      </Box>
      {isChatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            right: -30,
            width: 400,
            height: 510,
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