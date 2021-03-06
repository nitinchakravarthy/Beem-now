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

export default function RideConfirmed(props) {
  const classes = useStyles();
  const [roundTrip, setRoundTrip] = useState(props.location.state.roundTrip);
  const [departSuccess, setdepartSuccess] = useState(props.location.state.departSuccess);
  const [returnSuccess, setreturnSuccess] = useState(props.location.state.returnSuccess);
  const notify = (toastString) => {
      toast(toastString);
    };

  return (
  <div>
  <ToastContainer />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img src = {CompanyLogo} />
        </div>
        {roundTrip ?
        <Typography component="h1" variant="h5" align='center'>
          Your ride request has been sent succesfully.
        </Typography>
        :
        <Typography component="h1" variant="h5" align='center'>
          Your ride requests have been sent succesfully.
        </Typography>
        }
        {roundTrip ?
            <Typography variant="body2" align='center' style={{marginTop: '40px'}}>
              Your request has been succesfully sent to the host. You will recieve a ride confirmation email when the host accepts you ride request.
            </Typography>
            :
            <Typography variant="body2" align='center' style={{marginTop: '40px'}}>
               Your request has been succesfully sent to the host. You will recieve a ride confirmation emails for your departure ride and your return rides when the hosts accepts you ride request.
            </Typography>
        }
          <Grid container>
            <Grid item xs={12}>
             <Link href="/home" variant="body2" className={classes.centerAlign}>
              {"Go back to Home page"}
            </Link>
            </Grid>
          </Grid>

      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </div>
  );
}
