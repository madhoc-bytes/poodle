import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  Typography,
  Box,
  Link,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState("");

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (formValues.email === "") {
      setAlert(true);
      setAlertContent("Please input valid credentials");
      return;
    }
    const response = await fetch(new URL("/login", "http://localhost:5000/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    const data = await response.json();
    if (data.error) {
      setAlert(true);
      setAlertContent("Please input valid credentials");
    } else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", formValues["email"]);

      navigate(`/${data.is_teacher ? "teacher" : "student"}/dashboard`);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
        marginBottom: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "25px",
          width: "500px",
          gap: 2,

          // from https://ishadeed.com/article/new-facebook-css/
          boxShadow:
            "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
          paddingBottom: "25px",
          marginTop: "50px",
          // wordBreak: "break-all",
          padding: "0 10px 25px 10px",
        }}
      >
        <h1 style={{ fontSize: "60px", marginBottom: "0" }}>Poodle</h1>
        <h2>Login</h2>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: 300,
            mb: 2,
            "& > :not(:last-child)": {
              mb: 2,
            },
          }}
          onSubmit={handleLogin}
        >
          <FormControl>
            <InputLabel>Email</InputLabel>
            <Input
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <InputLabel>Password</InputLabel>
            <Input
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button variant="contained" color="secondary" type="submit">
            Login
          </Button>
        </Box>
        <Typography>
          Don't have an account? &nbsp;
          <Link
            href="/register"
            sx={{
              fontWeight: "bold",
              textDecoration: "underline",
              color: "rgb(156,39,176)",
            }}
          >
            Register now
          </Link>
        </Typography>
        {alert ? <Alert severity="error">{alertContent}</Alert> : <></>}
      </Box>
    </Box>
  );
};

export default LoginPage;
