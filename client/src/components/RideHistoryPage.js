import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import RideHistoryList from "./RideHistoryList";
import Container from '@material-ui/core/Container';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default function FullWidthTabs(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [driverRides, setDriverRides] = React.useState(props.location.state.driverRides);
  const [passengerRides, setPassengerRides] = React.useState(props.location.state.passengerRides);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return (
  <Container component = "main" maxWidth='md'>
    <div className={classes.root}>
    <div className = {classes.paper}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Rides Posted" {...a11yProps(0)} />
          <Tab label="Rides Taken" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      </div>
      <TabPanel value={value} index={0} dir={theme.direction}>
        <RideHistoryList 
                rides={driverRides} 
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <RideHistoryList 
                rides={passengerRides} 
        />
      </TabPanel>
    </div>
    </Container>
  );
}
