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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { Redirect } from 'react-router-dom';
import CompanyLogo from '../logo.png'
import { ToastContainer, toast } from 'react-toastify';

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

const genderCategories = [
  {
    value: 'Male',
    label: 'Male',
  },
  {
    value: 'Female',
    label: 'Female',
  },
  {
    value: 'Other',
    label: 'Prefer not to disclose',
  },
];

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
    marginBottom: theme.spacing(1)
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

export default function SignUp() {
  const classes = useStyles();
  const [accountCreated, setAccountCreated] = useState(false);
  const [signUpSucess, setSignUpSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [fNameError, setFNameError] = useState('');
  const [lNameError, setLNameError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [agreementError, setAgreementError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [agreeToTermsOfUse, setAgreeToTermsOfUse] = useState(false);
  const [email,setEmail] = useState('');
  const validateEmailAddress = (event) =>{
      console.log("password")
      let name = event.target.name
      let value = event.target.value
      if(event.target.value === ''){
          setEmailError('University Email Required')
      }
      else{
          var email = event.target.value;
          var reg = /^[a-zA-Z0-9/_/g\.]+@tamu\.edu$/;
          var test = reg.test(email);
          if (test) {
              setEmailError('')
          } else{
              setEmailError('Please enter a valid tamu email.')
          }
      }
  }
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
  const handleInputChange = event => {
    let name = event.target.name
    let value = event.target.value
    if(name === 'firstName'){
      if (value === '') {
          setFNameError('First Name is required')
      } else{
          setFNameError('')
      }
    } else if(name === 'lastName'){
      if (value === '') {
          setLNameError('Last Name is required')
      } else{
          setLNameError('')
      }
    } else if(name === 'gender'){
      if (value === '') {
          setGenderError('Please make a selection')
      } else{
          setGenderError('')
      }
    }
  }
  const handleCheckBoxInputs = event => {
      let name = event.target.name
      if(name === 'agreeToTermsOfUse'){
        let currentVal = agreeToTermsOfUse
        setAgreeToTermsOfUse(!currentVal)
        setAgreementError('')
      }
  }
  const handleEmptySubmission = data => {
    var success = true
      if(data.get('firstName') === ''){
        setFNameError('First name is required')
        success = false
      }
      if(data.get('lastName') === ''){
        setLNameError('Last name is required')
        success = false
      }
      if(data.get('gender') === ''){
        setGenderError('Please make a selection')
        success = false
      }
      if (emailError !== '') {
        success = false
      }
      if(data.get('email') === ''){
        setEmailError('University email is required')
        success = false
      }
      if(data.get('password') === ''){
        setPasswordError('Password is required')
        success = false
      }
      if(data.get('confirmPassword') !== data.get('password')){
        setConfirmPasswordError('Passwords do not match')
        success = false
      }
      if(!agreeToTermsOfUse){
        setAgreementError('You must agree to our terms of service.')
        success = false
      }
      return success
  }

  const notify = (toastString) => {
      toast(toastString);
    };

  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const success = handleEmptySubmission(data);
      if(success){
          const body = {
              first_name : data.get('firstName'),
              last_name : data.get('lastName'),
              email : data.get('email'),
              password: data.get('password'),
              gender: data.get('gender')
          }
          //console.log(body);
          fetch('/users/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }).then(response => response.json())
          .then((resp) => {
              if(resp.error_code == 0){
                  console.log(resp);
                  console.log(resp.email);
                  setEmail(resp.email);
                  setSignUpSuccess(resp);
                  setAccountCreated(true);
              }else{
                  notify(resp.msg)
              }

         }).catch( (error) => {
            notify("unable to create a new account. Please try again later.");
             console.log(error);
         });
      }
  }
  return (
      <div>
      {accountCreated ? <Redirect to={{ pathname : "/resendToken",
                                    state : {accountCreated :{accountCreated},
                                            signUpSucess: {signUpSucess},
                                            email: {email}
                                    }
        }} />: null }
    <ToastContainer />
     <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className={classes.logo}>
            <img src = {CompanyLogo} />
          </div>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form}  onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  error = {fNameError !== ''}
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  helperText = {fNameError}
                  autoFocus
                  onChange = {handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error = {lNameError !== ''}
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  helperText = {lNameError}
                  autoComplete="lname"
                  onChange = {handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  error = {genderError !== ''}
                  onChange = {handleInputChange}
                  select
                  required
                  fullWidth
                  id="gender"
                  label="Gender"
                  name="gender"
                  autoComplete="email"
                  helperText = {genderError}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                >
                {genderCategories.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
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
                />
              </Grid>
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
              <Grid item xs={12}>
                <FormControlLabel style = {{marginRight: '5px'}}
                  control={<Checkbox name = "agreeToTermsOfUse" color="primary" onChange = {handleCheckBoxInputs}/>}
                  label="I have read and agree to the "
                />
                <Link href="/termsofservice" variant="body1" underline='always' target="_blank">Terms of service</Link>*
                <Typography variant = "body2" color = "error">{agreementError}</Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item >
                  <Link href="/signin" variant="body2">
                    {"Sign in"}
                  </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
     </div>
 );
}
