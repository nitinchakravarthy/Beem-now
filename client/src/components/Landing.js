import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import BgImageLarge from '../background_large.jpg';
import BgImageMedium from '../background_medium.jpg';
import BgImageSmall from '../background_small.jpg';
import Link from '@material-ui/core/Link';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  desktopImage: {
    marginTop: theme.spacing(6),
    backgroundImage: `url(${BgImageLarge})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    height: "450px"
  },
  mobileImage: {
    marginTop: theme.spacing(6),
    backgroundImage: `url(${BgImageSmall})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    height: "118px"
  },
  marginText: {
    float: 'right',  
    alignText: 'center', 
    height: '100%',
    marginRight: '5%', 
    //fontSize: 30, 
    fontFamily: 'Quicksand',
    right: 0, 
    top: 0, 
    // background: 'green'
  }
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = event => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

export default function Landing(props) {
  const classes = useStyles();
  const [directToSignIn, setDirectToSignIn] = useState(false);
  //const [isDesktop, setIsDesktop] = useState(false);
  var isDesktop = window.innerWidth > 1000 ? true : false;
  const sendToSignIn = event => {
    setDirectToSignIn(true)
  }
  return (
    <React.Fragment>
      {directToSignIn ? <Redirect to="/signin"/> : null}
      <CssBaseline />
      <AppBar>
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Beem Now
            </Typography>
            <Button color="inherit" onClick = {sendToSignIn}>Sign in</Button>
        </Toolbar>
      </AppBar>
      <div className = {isDesktop? classes.desktopImage : classes.mobileImage}>
        <div className = {classes.marginText}>
          <p style = {{marginTop: isDesktop? '100%': '50%', fontSize: isDesktop? 30: 12}}>
            <br/>Rides,
            <br/>For the students,
            <br/>By the students.
          </p>
        </div>
      </div>
      
      <Typography style = {{marginTop: '2%' ,textAlign: 'center', fontSize: 30, fontFamily: 'Quicksand'}}>
          Rides made easy and profitable !
      </Typography>
      
      <Container>
            <p> Need to be somewhere? Beem-Now has got you covered ! With our app, now search for rides offered by
            fellow students going to same destination. This service is exclusively for students. Our platform
            ensures value for money rides. Some descriptive text. Some descriptive text. Some descriptive text.
            Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text.
            Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text.
            Some descriptive text. Some descriptive text.</p>
            <p> Heading out somewhere? With our platform make extra money on the side by giving ride to a fellow student, 
            delivering small items or packages to or from those locations. Just post your travel details and number of
            people/packages you can take with you. User searching for a ride or item delivery to your destination 
            will get in touch with you. Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text.
            Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text. Some descriptive text.
            Some descriptive text. Some descriptive text.</p>
      </Container>
      
    </React.Fragment>
  );
}