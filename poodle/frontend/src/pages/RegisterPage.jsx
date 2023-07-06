import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  Input,
  Typography,
  Paper,
  Box,
  Link,
  Alert,
} from "@mui/material";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isTeacher, setIsTeacher] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [alertError, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState("");

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!formValues.firstName || !/^[a-zA-Z]+$/.test(formValues.firstName)) {
      setAlertContent("First name must consist of letters only");
      setAlert(true);
    } else if (
      !formValues.lastName ||
      !/^[a-zA-Z]+$/.test(formValues.lastName)
    ) {
      setAlertContent("Last name must consist of letters only");
      setAlert(true);
    } else if (!formValues.email || !emailRegex.test(formValues.email)) {
      setAlertContent("Email must be valid");
      setAlert(true);
    } else if (
      !formValues.password ||
      !passwordRegex.test(formValues.password)
    ) {
      setAlertContent(
        "Password must be at least 8 characters and contain at least one character from each of the groups: letters, numbers and special characters"
      );
      setAlert(true);
    } else if (formValues.password !== formValues.confirmPassword) {
      setAlertContent("Passwords must match");
      setAlert(true);
    } else {
      return true;
    }
    return false;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      formValues.isTeacher = isTeacher;

      const response = await fetch(
        new URL("/register", "http://localhost:5000/"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );
      const data = await response.json();
      if (data.error) {
        setAlert(true);
        setAlertContent("Email taken. Please use a different email");
      } else {
        console.log("Success");
        navigate("/login");
        alert("Successfully registered an account");
      }
    }
  };

  const handlerole = (newRole) => {
    setIsTeacher(newRole);
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
        <h2>Register</h2>
        <Paper
          sx={{
            display: "flex",
            justifyContent: "center",
            borderRadius: "50px",
            mb: 2,
            "& div": {
              borderRadius: "50px",
              flex: 1,
              p: 2,
              width: "150px",
              textAlign: "center",
              cursor: "pointer",
              "&:first-of-type": {
                bgcolor: isTeacher === false ? "rgb(156,39,176)" : "inherit",
              },
              "&:last-of-type": {
                bgcolor: isTeacher === true ? "rgb(156,39,176)" : "inherit",
              },
            },
          }}
        >
          <Box onClick={() => handlerole(false)}>Student</Box>
          <Box onClick={() => handlerole(true)}>Teacher</Box>
        </Paper>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: 300,
            mb: 2,
            "& > :not(:last-child)": {
              mb: 2, // This replaces the marginBottom from makeStyles
            },
          }}
          onSubmit={handleRegister}
        >
          <FormControl>
            <InputLabel>First Name</InputLabel>
            <Input
              name="firstName"
              value={formValues.firstName}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <InputLabel>Last Name</InputLabel>
            <Input
              name="lastName"
              value={formValues.lastName}
              onChange={handleInputChange}
            />
          </FormControl>
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
          <FormControl>
            <InputLabel>Confirm Password</InputLabel>
            <Input
              name="confirmPassword"
              type="password"
              value={formValues.confirmPassword}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button variant="contained" color="secondary" type="submit">
            Register
          </Button>
        </Box>
        <Typography>
          Have an account? &nbsp;
          <Link
            href="/login"
            sx={{
              fontWeight: "bold",
              textDecoration: "underline",
              color: "rgb(156,39,176)",
            }}
          >
            Login now
          </Link>
        </Typography>
        {alertError ? <Alert severity="error">{alertContent}</Alert> : <></>}
      </Box>
    </Box>
  );
};

export default RegisterPage;
