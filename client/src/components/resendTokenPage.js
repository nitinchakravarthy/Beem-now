import React, { useState, useEffect } from 'react';
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

export default function ResendTokenPage(props) {
  const classes = useStyles();
  const [emailError, setEmailError] = useState('');
  const [isAccountCreated,setIsAccountCreated] = useState(props.location.state ? props.location.state.accountCreated : false);
  const [signUpSucess,setSignUpSuccess] = useState(props.location.state? props.location.state.signUpSucess : "");
  const [email,setEmail] = useState(props.location.state? props.location.state.email : "");
  const notify = (toastString) => {
      toast(toastString);
    };

  const resendToken = (event) => {

        event.preventDefault();
        console.log("resend token");
        fetch('/users/resendToken?email=' + email).then(response => response.json())
        .then((data) => {
            console.log(data);
            notify("Email sent to " + email + " with a new confirmation link.");
        })
        .catch(() => {
            notify("Could not send an email. Please try again");
        });
  }

  return (
  <div>
  <ToastContainer />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img src = {CompanyLogo} />
        </div>
        <form className={classes.form} onSubmit={resendToken}>
        <Typography component="h1" variant="h5" align='center'>
          Please go to your email and confirm you account. You can sign in once you do that.
        </Typography>
        <Typography variant="body2" align='center' style={{marginTop: '40px'}}>
          If your token has expired. click on the button below to resend a new confirmation email.
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Resend Token
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
