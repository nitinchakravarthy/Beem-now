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

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
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
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [gender, setGender] = useState(''); 

  // Parameters for UI effect of Gender label when in focus
  const genderLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(genderLabel.current.offsetWidth);
  }, []);

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
              setEmailError('Please enter a valid tamu email.')
          }
      }
  }
  const validatePassword = (event) => {
      let name = event.target.name
      let value = event.target.value
      setPassword(value)
      if(event.target.value==''){
          setPasswordError('Password Required')
      }
      else{
          var pass = event.target.value;
          var reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,32}$/;
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
  const handleGenderChange = event => {
    setGender(event.target.value)
  }
  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target)
      console.log(gender)

      // fetch('/api/form-submit-url', {
      //   method: 'POST',
      //   body: data,
      // });
      
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form}  onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" id = "gender-form-control" fullWidth className={classes.formControl}>
                <InputLabel ref={genderLabel} id="gender-label" required>
                  Gender
                </InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  labelWidth={labelWidth}
                  value={gender}
                  onChange={handleGenderChange}
                >
                  <MenuItem value={'Male'}>Male</MenuItem>
                  <MenuItem value={'Female'}>Female</MenuItem>
                  <MenuItem value={'Other'}>Prefer not to disclose</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={emailError !== ''}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
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
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive updates via email."
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}