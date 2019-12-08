import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CompanyLogo from '../logo.png'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Beem Now
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  centerAlign: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    textAlign: 'center',
    marginBottom: theme.spacing(3)
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [emailError, setEmailError] = useState('');

  const validateEmailAddress = (event) =>{
      let name = event.target.name
      let value = event.target.value
      if(event.target.value === ''){
          setEmailError('Email Address Required')
      }
      else{
          var email = event.target.value;
          var reg = /^[a-zA-Z0-9/_/g]+@tamu\.edu$/;
          var test = reg.test(email);
          if (test) {
              setEmailError('')
          } else{
              setEmailError('Not a valid email address')
          }
      }
  }
  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target);

      const body = {
          email : data.get('email'),
      }
      console.log(body);

      fetch('/users/requestPasswordReset', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then(response => response.json())
      .then(data => {
         console.log(data);
      });
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img src = {CompanyLogo} />
        </div>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Typography variant="body1" style={{marginTop: '60px', marginBottom: '30px'}}>
          Please enter your registered email ID.
          We will send you a verification email to reset your password.
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            error={emailError !== ''}
            variant="outlined"
            required
            fullWidth
            id="email"
            label="University Email"
            name="email"
            autoComplete="email"
            helperText = {emailError}
            onChange = {validateEmailAddress}
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
          <Grid container>
            <Grid item xs={12}>
              <Link href="/signin" variant="body2" className={classes.centerAlign}>
                {"Sign in here"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
