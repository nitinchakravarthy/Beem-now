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

export default function AccountVerified() {
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
  const openStripe = (event) => {

        event.preventDefault();
        console.log("openstripe");
        fetch('/payments/openStripe',{
            method: 'GET',
        })
  }
  // const handleSubmit = (event) => {
  //     event.preventDefault();
  //     const data = new FormData(event.target);
  //
  //     const body = {
  //         email : data.get('email'),
  //     }
  //     console.log(body);
  //
  //     fetch('/users/requestPasswordReset', {
  //       method: 'POST',
  //       headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(body),
  //     }).then(response => response.json())
  //     .then(data => {
  //        console.log(data);
  //     });
  // }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img src = {CompanyLogo} />
        </div>
        <form className={classes.form} onSubmit={openStripe}>
        <Typography component="h1" variant="h5" align='center'>
          Account Verified
        </Typography>
        <Typography variant="body1" align='center' style={{marginTop: '60px'}}>
          Your account has been verified. Now you can login
        </Typography>
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
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

// export default function AccountVerified(props) {
//     const classes = useStyles();
//     const theme = useTheme();
//
//      return (
//          <div className={classes.root}>
//             <CssBaseline />
//             <Toolbar>
//             <Typography variant="h6" noWrap>
//               Beem Now
//             </Typography>
//             </Toolbar>
//             <Typography variant="body1">
//                 Your account has been verified. You can sign in now.
//             </Typography>
//             <center><Link to="/signin">Return to sign in page</Link></center>
//             <Typography variant="body1">
//                 Before you head back to the sign in page, Please take a minute to make your payment profile.
//             </Typography>
//             <a href = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_FSUf1KMzn4Q4NBDihoOGkrzFKD3CYkzw&scope=read_write&reditect_uri=http://localhost:3001/payments/ConnectedToStripe">
//             <Button type="button" color="primary" id= "connectStripeButton" >Connect to Stripe</Button>
//             </a>
//
//          </div>
//      );
//
// }
