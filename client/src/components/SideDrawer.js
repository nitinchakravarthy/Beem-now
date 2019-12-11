import React, {useState} from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SvgIcon from '@material-ui/core/SvgIcon';
import homeIcon from '../icons/home.svg';
import profileIcon from '../icons/profile.svg';
import { Redirect, withRouter } from 'react-router-dom';
import ridePostIcon from '../icons/ridepost.svg';
import historyIcon from '../icons/history.svg';
import messageIcon from '../icons/message.svg';
import signOutIcon from '../icons/signout.svg';
import {NavLink} from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import {Link } from 'react-router-dom'

const drawerWidth = 240;

// const myName = prompt("Whats your username buddy?")


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    justifyContent: 'flex-end',
  },
  drawerFooter: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    left: '0'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  inline: {
    display: 'inline',
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />
}

export default withRouter ( function Home(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [driverRides, setDriverRides] = useState([]);
  const [passengerRides, setPassengerRides] = useState([]);
  const [isRideHistoryClicked, setIsRideHistoryClicked] = useState(false);
  var redirect = null
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const clearLocalStorage = () => {
      console.log('clearing local storage');
      localStorage.clear();
      props.history.clear();
  };

  const handleSelect = () => {
      setIsRideHistoryClicked(false)
      const params = {
        user_id: localStorage.getItem('uid'),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
      fetch('/rides/rideHistory', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:  JSON.stringify(params)
      }).then(response => response.json())
      .then((data) => {
         console.log(data);
         if(data.error_code == 0){
             var obj_d, obj_p
             try {
                obj_d = JSON.parse(data.driver_rides);
                obj_p = JSON.parse(data.passenger_rides);
              } catch (ex) {
                console.error(ex);
              }

             setDriverRides(obj_d)
             setPassengerRides(obj_p)
             setIsRideHistoryClicked(true);
         }else{
             //notify(data.msg)
         }
     }).catch((error) => {
         console.log(error);
         //notify(error.msg)
     });
     handleDrawerClose()
  };

  if (isRideHistoryClicked) {
    redirect = props.history.push({pathname: "/home/ridehistory",state: {driverRides: driverRides,passengerRides: passengerRides}});
    setIsRideHistoryClicked(false);
    console.log(redirect)
  }
  else {
    redirect = null;
  }

  return (
    <div className={classes.root}>
    {redirect}
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Beem Now
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List component="nav">

          <ListItemLink key={"Home"} href = "/home" onClick = {handleDrawerClose}>
              <ListItemIcon>
                <Icon><img src={homeIcon}/></Icon>
              </ListItemIcon>
              <ListItemText primary={"Home"} />
          </ListItemLink >

          <ListItemLink key={"profile"} href="/home/profile" onClick = {handleDrawerClose}>
              <ListItemIcon>
                <Icon><img src={profileIcon}/></Icon>
              </ListItemIcon>
              <ListItemText primary={"My Profile"} />
          </ListItemLink>

          <ListItemLink key = {"postride"} href="/home/postride" onClick = {handleDrawerClose}>
              <ListItemIcon>
                <Icon><img src={ridePostIcon}/></Icon>
              </ListItemIcon>
            <ListItemText primary={"Post a Ride"} />
          </ListItemLink>

          <ListItem button key = {"ridehistory"} onClick = {handleSelect}>
              <ListItemIcon>
                <Icon><img src={historyIcon}/></Icon>
              </ListItemIcon>
              <ListItemText primary={"Ride History"} />
          </ListItem>

          <ListItem button key={"Messages"}  onClick = {handleDrawerClose} component={Link} to={{
            pathname:'/home/friendList', state: {name: localStorage.getItem('first_name')}}}>
              <ListItemIcon><img src={messageIcon}/></ListItemIcon>
              <ListItemText primary={"Messages"} />
          </ListItem>

          <ListItem button key={"Sign Out"} component="a" href = "/signin" onClick = {clearLocalStorage}>
              <ListItemIcon>
                <Icon><img src={signOutIcon}/></Icon>
              </ListItemIcon>
              <ListItemText primary={"Sign Out"} />
          </ListItem>

        </List>
        <Divider />
        <div className = {classes.drawerFooter}>
        <List>
          <ListItemLink key={"Terms of service"} href = "/termsofservice" target="_blank" style = {{textAlign: 'center'}}>
              <ListItemText primary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    <Box fontStyle="italic" m={1}>
                      Terms of service
                    </Box>
                  </Typography>
                </React.Fragment>
              }/>
          </ListItemLink>
        </List>
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

      </main>
    </div>
  );
})
