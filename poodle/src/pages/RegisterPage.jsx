import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Button, FormControl, InputLabel, Input, Typography, Paper, Box, Link, Dialog, DialogTitle, Container } from '@mui/material';

const RegisterPage = () => {
  // const history = useHistory();
  const navigate = useNavigate();
  const [role, setRole] = useState('Student');
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const validateInputs = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


    if (!formValues.firstName || !/^[a-zA-Z]+$/.test(formValues.firstName)) errors.firstName = "First name must consist of letters only";
    if (!formValues.lastName || !/^[a-zA-Z]+$/.test(formValues.lastName)) errors.lastName = "Last name must consist of letters only";
    if (!formValues.email || !emailRegex.test(formValues.email)) errors.email = "Email must be valid";
    if (!formValues.password || !passwordRegex.test(formValues.password)) errors.password = "Password must contain at least one character from each of the groups: letters, numbers, special characters";
    if (formValues.password !== formValues.confirmPassword) errors.confirmPassword = "Passwords must match";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validateInputs()) {
      // You might want to connect to your backend here
      console.log('succesfully registered');
      console.log(formValues);
      console.log(role);
      navigate('/login')
      // history.push('/Login');
    } else {
      setOpen(true);
    }
  };

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
  };

  return (
    <Container sx={{
      display: 'flex',
      alignItems: 'center',
      justfiyContent: 'center',
      height: '100vh',
      width: '100vw',
    }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 3,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          backgroundColor: '#D8BFD8',
          width: '30rem',
          height: '50rem',
          boxShadow: 4,
          borderRadius: 5,
        }}
      >
        <Typography variant="h2" sx={{ mb: 4 }}>Poodle</Typography>
        <Typography variant="h4">Register</Typography>
        <Paper
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
            '& div': {
              flex: 1,
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: role === 'Student' ? 'pink' : 'inherit',
              },
              '&:last-of-type': {
                bgcolor: role === 'Teacher' ? 'pink' : 'inherit',
              },
            },
          }}
        >
          <Box onClick={() => handleRoleSelect('Student')}>
            Student
          </Box>
          <Box onClick={() => handleRoleSelect('Teacher')}>
            Teacher
          </Box>
        </Paper>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 300,
            mb: 2,
            '& > :not(:last-child)': {
              mb: 2, // This replaces the marginBottom from makeStyles
            },
          }}
          onSubmit={handleRegister}
        >
          <FormControl>
            <InputLabel htmlFor="firstName">First Name</InputLabel>
            <Input id="firstName" name="firstName" type="text" value={formValues.firstName} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="lastName">Last Name</InputLabel>
            <Input id="lastName" name="lastName" type="text" value={formValues.lastName} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" name="email" type="email" value={formValues.email} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input id="password" name="password" type="password" value={formValues.password} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <Input id="confirmPassword" name="confirmPassword" type="password" value={formValues.confirmPassword} onChange={handleInputChange} />
          </FormControl>
          <Button variant="contained" color="primary" type="submit">Register</Button>
        </Box>
        <Typography>
          Have an account? <Link href="/Login" variant="body1" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Login now</Link>
        </Typography>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
        >
          <DialogTitle id="alert-dialog-title">
            {Object.entries(formErrors).map(([key, value]) => {
              return (<p>{key} {value}</p>);
            })}
          </DialogTitle>
        </Dialog>
      </Box>
    </Container>
  );
};

export default RegisterPage;
