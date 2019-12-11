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

export default function AccountVerified(props) {
  const classes = useStyles();
  const [emailError, setEmailError] = useState('');
  const [token,setToken] = useState(props.match.params.token,"");
  const [verificationText, setVerificationText] = useState("Verifying your account");
  const [verified, setVerified] = useState(false);

  const openStripe = (event) => {
        //TODO
        event.preventDefault();
        console.log("openstripe");
        // fetch('/payments/openStripe',{
        //     method: 'GET',
        // })
  };

  useEffect(() => {
        console.log("in component did mount");
        fetch( '/users/confirmation?token=' + token).then(response => response.json())
        .then((data) => {
            console.log(data);
            setVerificationText("Account Verified");
            setVerified(true);
        }).catch((error) => {
            console.log(error);
            setVerificationText("unable to verify your account. Please resend and email and verifiy again.");
            setVerified(false);
        });
    });

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img src = {CompanyLogo} />
        </div>
        <Typography component="h1" variant="h5" align='center'>
         {verificationText}
        </Typography>
        {verified ? <div>
        <Typography variant="body1" align='center' style={{marginTop: '60px'}}>
          Your account has been verified. Now you can login
        </Typography>
        <form className={classes.form} onSubmit={openStripe}>
        <Typography variant="body2" align='center' style={{marginTop: '40px'}}>
          Before continuing to login, please take a minute to connect your payments profile via stripe.
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Connect to Stripe
        </Button>
          <Grid container>
            <Grid item xs={12}>
              <Link href="/signin" variant="body2" className={classes.centerAlign}>
                {"Go back to sign in page"}
              </Link>
            </Grid>
          </Grid>
          </form>
          </div> : null}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
