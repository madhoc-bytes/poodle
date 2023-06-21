import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, FormControl, InputLabel, Input, Typography, Paper, Box, Link, Dialog, DialogTitle } from '@material-ui/core';
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

const schema = yup.object().shape({
  firstName: yup.string().matches(/^[a-zA-Z]+$/, "First name must consist of letters only").required(),
  lastName: yup.string().matches(/^[a-zA-Z]+$/, "Last name must consist of letters only").required(),
  email: yup.string().email().matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/, "Email must be valid").required(),
  password: yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one character from each of the groups: letters, numbers, special characters").required(),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const RegisterPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [role, setRole] = useState('Student');
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });

  const handleRegister = (data) => {
    if (Object.keys(errors).length === 0) {
      // You might want to validate input or connect to your backend here
      history.push('/Login');
    } else {
      setOpen(true);
    }
  };

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
  };

  return (
    <Box className={classes.root}>
      <Typography variant="h2" className={classes.title}>Poodle</Typography>
      <Typography variant="h4">Register</Typography>
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
      <form className={classes.form} onSubmit={handleSubmit(handleRegister)}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="firstName">First Name</InputLabel>
          <Input id="firstName" name="firstName" type="text" inputRef={register} />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="lastName">Last Name</InputLabel>
          <Input id="lastName" name="lastName" type="text" inputRef={register} />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" name="email" type="email" inputRef={register} />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input id="password" name="password" type="password" inputRef={register} />
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
          <Input id="confirmPassword" name="confirmPassword" type="password" inputRef={register} />
        </FormControl>
        <Button variant="contained" color="primary" type="submit">Register</Button>
      </form>
      <Typography>
        Have an account? <Link href="/Login" variant="body1" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Login now</Link>
      </Typography>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle id="alert-dialog-title">Please check your inputs!</DialogTitle>
      </Dialog>
    </Box>
  );
};

export default RegisterPage;
