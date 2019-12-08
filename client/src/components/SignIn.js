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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CompanyLogo from '../logo.png'
import BgImage from '../background.jpg'

toast.configure({
  autoClose: 8000,
  draggable: false,
  hideProgressBar :true,
  //etc you get the idea
});

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
      // backgroundImage: `url(${BgImage})`,
      // backgroundRepeat: "no-repeat",
      // backgroundPosition: "center center",
      // backgroundSize: "cover",
      // height: "100%"
    },
  },
  paper: {
    backgroundColor: theme.palette.common.white,
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    textAlign: 'center',
    marginBottom: theme.spacing(3)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccountCreated,setIsAccountCreated] = useState(props.location.state ? props.location.state.accountCreated : false);
  const [signUpSucess,setSignUpSuccess] = useState(props.location.state? props.location.state.signUpSucess : "");
  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target)
      const rememberme = data.get('rememberme');
      const body = {
          email : data.get('email'),
          password: data.get('password'),
      }
      fetch('/users/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then(response => response.json())
      .then((data) => {
         console.log(data);
         if(data.error_code == 0){
             //save the user object in the
             console.log(data.user);
             localStorage.setItem('user',data.user);
             localStorage.setItem('uid', data.user._id);
             localStorage.setItem('first_name', data.user.first_name);
             localStorage.setItem('last_name', data.user.last_name);
             localStorage.setItem('remember',rememberme);
             setIsAuthenticated(true);

         }else{
             notify(data.msg)
         }
     }).catch((error) => {
         console.log(error);
         notify(error.msg)
     });

  }

  React.useEffect(() => {
      console.log("log in notify");
      console.log(signUpSucess);
      if (signUpSucess.mailSent) {
          const toastString = "A confirmation email has been sent to " + signUpSucess.email + ". Please confirm before you login."
          notify(toastString);
      }
  }, []);

  const notify = (toastString) => {
      toast(toastString);
    };

  return (
    <div>
    {isAuthenticated ? <Redirect to="/home"/> : null}
    <ToastContainer />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img src = {CompanyLogo} />
        </div>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            id="rememberme"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            backgroundColor = '#62c9f2'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotpassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <div style = {{marginTop: '10%', marginBottom: '10%'}}>
        <Copyright />
      </div>
    </Container>
    </div>
  );
}
