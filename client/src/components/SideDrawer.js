import React from 'react';
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
import ridePostIcon from '../icons/ridepost.svg';
import historyIcon from '../icons/history.svg';
import messageIcon from '../icons/message.svg';
import signOutIcon from '../icons/signout.svg';
import {NavLink} from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';

const drawerWidth = 240;

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

export default function Home(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const clearLocalStorage = () => {
      console.log('clearing local storage');
      localStorage.clear();
  }

  return (
    <div className={classes.root}>
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

          <ListItemLink key={"Home"} href = "#" onClick = {handleDrawerClose}>
              <ListItemIcon>
                <Icon><img src={homeIcon}/></Icon>
              </ListItemIcon>
              <ListItemText primary={"Home"} />
          </ListItemLink >

          <ListItemLink key={"profile"} href="#profile" onClick = {handleDrawerClose}>
              <ListItemIcon>
                <Icon><img src={profileIcon}/></Icon>
              </ListItemIcon>
              <ListItemText primary={"My Profile"} />
          </ListItemLink>

          <ListItemLink key = {"postride"} href="#postride" onClick = {handleDrawerClose}>
              <ListItemIcon>
                <Icon><img src={ridePostIcon}/></Icon>
              </ListItemIcon>
            <ListItemText primary={"Post a Ride"} />
          </ListItemLink>

          <ListItemLink key = {"ridehistory"} href="#ridehistory" onClick = {handleDrawerClose}>
              <ListItemIcon>
                <Icon><img src={historyIcon}/></Icon>
              </ListItemIcon>
              <ListItemText primary={"Ride History"} />
          </ListItemLink>

          <ListItemLink key={"Messages"} href="#messages" onClick = {handleDrawerClose}>
              <ListItemIcon>
                <Icon><img src={messageIcon}/></Icon>
              </ListItemIcon>
              <ListItemText primary={"Messages"} />
          </ListItemLink>

          <ListItem button key={"Sign Out"} component="a" href = "/" onClick = {clearLocalStorage}>
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
}
