import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, FormControl, InputLabel, Input, Typography, Paper, Box, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  roleSelect: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  roleOption: {
    flex: 1,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
  },
  selectedRole: {
    backgroundColor: 'pink',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 300,
    marginBottom: theme.spacing(2),
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [role, setRole] = useState('Student');

  const handleLogin = () => {
    // You might want to validate input or connect to your backend here
    history.push('/dummy-route');
  };

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
  };

  return (
    <Box className={classes.root}>
      <Typography variant="h2" className={classes.title}>Poodle</Typography>
      <Typography variant="h4">Login</Typography>
      <Paper className={classes.roleSelect}>
        <Box
          className={`${classes.roleOption} ${role === 'Student' ? classes.selectedRole : ''}`}
          onClick={() => handleRoleSelect('Student')}
        >
          Student
        </Box>
        <Box
          className={`${classes.roleOption} ${role === 'Teacher' ? classes.selectedRole : ''}`}
          onClick={() => handleRoleSelect('Teacher')}
        >
          Teacher
        </Box>
      </Paper>
      <form className={classes.form} onSubmit={handleLogin}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" type="email" />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" type="password" />
        </FormControl>
        <Button variant="contained" color="primary" type="submit">Login</Button>
      </form>
      <Typography>
        Don't have an account? <Link href="/register" variant="body1" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Register now</Link>
      </Typography>
    </Box>
  );
};

export default LoginPage;
