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
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CompanyLogo from '../logo.png';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';

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

export default function ChangePassword(props) {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [token,setToken] = useState(this.props.location.query.token,"");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const validatePassword = (event) => {
      let name = event.target.name
      let value = event.target.value
      setPassword(value)
      if(event.target.value === ''){
          setPasswordError('Password Required')
      }
      else{
          var pass = event.target.value;
          var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*#?&]{8,32}$/;
          var test = reg.test(pass);
          if (test) {
              setPasswordError('')
          } else{
              setPasswordError('Password shoud contain a digit,small letter,capital letter and must be between 8 to 32 characters')
          }
      }
  }
  const validatePasswordComfirmation = (event) => {
      let name = event.target.name
      let value = event.target.value
      var pass = event.target.value
      if (pass === password) {
          setConfirmPasswordError('')
      } else{
          setConfirmPasswordError('Passwords do not match')
      }
  }

  const handleEmptySubmission = data => {
    var success = true
      if(data.get('password') === ''){
        setPasswordError('Password is required')
        success = false
      }
      if(data.get('confirmPassword') !== data.get('password')){
        setConfirmPasswordError('Passwords do not match')
        success = false
      }
      return success
  }

  const notify = (toastString) => {
      toast(toastString);
    };

  const restPassword = (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const success = handleEmptySubmission(data);
      if(success){
          const body = {
              token :token,
              newPassword: data.get('password'),
              newPasswordConf: data.get('password')
          }
          fetch('/users/resetPassword', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }).then(response => response.json())
          .then((data) => {
             console.log(data);
             setPasswordChanged(data.passwordUpdated);
         }).catch( (error) => {
            notify("unable to process your request. Please try again later.");
             console.log(error);
         });
     }

  }

  return (
      <div>
      {passwordChanged ? <Redirect to={{ pathname : "/signin"}} />: null }
      <ToastContainer />
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img src = {CompanyLogo} />
        </div>
        <form className={classes.form} onSubmit={restPassword}>
        <Typography component="h1" variant="h5" align='center'>
            Please enter your New password
        </Typography>
        <Grid item xs={12}>
          <TextField
            error={passwordError !== ''}
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            helperText = {passwordError}
            onChange = {validatePassword}
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Reset Password
        </Button>
          <Grid container>
            <Grid item xs={12}>
              <Link href="/signin" variant="body2" className={classes.centerAlign}>
                {"Go back to sign in page"}
              </Link>
            </Grid>
          </Grid>
          </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </div>
  );
}
