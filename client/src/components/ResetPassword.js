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
import { Redirect } from 'react-router-dom';
import CompanyLogo from '../logo.png'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ResetPassword() {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const validatePassword = (event) => {
      let name = event.target.name
      let value = event.target.value
      setPassword(value)
      if(event.target.value==''){
          setPasswordError('Password Required')
      }
      else{
          var pass = event.target.value;
          var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&]{8,32}$/;
          var test = reg.test(pass);
          if (test) {
              setPasswordError('')
          } else{
              setPasswordError('Password should contain a digit,small letter,capital letter and must be between 8 to 32 characters')
          }
      }
    }
  const validatePasswordComfirmation = (event) => {
      let name = event.target.name
      let value = event.target.value 
      var pass = event.target.value;
      if (pass === password) {
          setConfirmPasswordError('')
      } else{
          setConfirmPasswordError('Passwords do not match')
      }
  }
  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      if(data.get('password') === ''){
        setPasswordError('Password can not be empty.')
      } else if(data.get('confirmPassword') === ''){
        setConfirmPasswordError('Please confirm your password.')
      } else {
        setPasswordError('')
        setConfirmPasswordError('')
        // send new credentials to backend
        // fetch('/api/form-submit-url', {
        //   method: 'POST',
        //   body: data,
        // });
        setResetSuccess(true);
      }
      
  }
  return (
    <div>
      {resetSuccess ? <Redirect to="/"/> : null}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.logo}>
            <img src = {CompanyLogo} />
          </div>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={passwordError !== ''}
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  helperText = {passwordError}
                  onChange = {validatePassword}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error = {confirmPasswordError !== ''}
                  variant="outlined"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  autoComplete="confirm-password"
                  helperText = {confirmPasswordError}
                  onChange = {validatePasswordComfirmation}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Reset
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}