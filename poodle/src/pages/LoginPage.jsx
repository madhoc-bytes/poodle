import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { Button, FormControl, InputLabel, Input, Typography, Paper, Box, Link, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleLogin = () => {
    // You might want to validate input or connect to your backend here
    
    console.log('pressed login yes');
    navigate(`/${role}/dashboard`);
    // history.push('/dummy-route');
  };

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
  };

  return (
    <Container component='main' maxWidth='xs' sx={{display: 'flex', alignItems: 'center', minHeight: '100vh'}}>
      <Box
        sx={{
          display: 'flex',
          // margin: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // minHeight: '100vh',
          gap: 2,
          backgroundColor: '#D8BFD8',
          width: '25rem',
          height: '40rem',
          boxShadow: 4,
          borderRadius: 5,
        }}
      >
        <Typography variant="h2" sx={{ mb: 4 }}>Poodle</Typography>
        <Typography variant="h4">Login</Typography>
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
                bgcolor: role === 'student' ? 'pink' : 'inherit',
              },
              '&:last-of-type': {
                bgcolor: role === 'teacher' ? 'pink' : 'inherit',
              },
            },
          }}
        >
          <Box onClick={() => handleRoleSelect('student')}>
            Student
          </Box>
          <Box onClick={() => handleRoleSelect('teacher')}>
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
          onSubmit={handleLogin}
        >
          <FormControl>
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input id="email" type="email" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input id="password" type="password" />
          </FormControl>
          <Button variant="contained" color="primary" type="submit">Login</Button>
        </Box>
        <Typography>
          Don't have an account? <Link href="/register" variant="body1" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Register now</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
