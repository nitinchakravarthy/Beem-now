import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';


import DepartureRideList from "./DepartureRideList"


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
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
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const headingTheme = createMuiTheme({
  typography: {
    h5: {
      fontWeight: 500,
    },
  },
});

export default function DepartureRidesPage(props) {
  const classes = useStyles();
  const [departureRides, setDepartureRides] = useState(props.location.state.departure_rides);
  const [returnRides, setReturnRides] = useState(props.location.state.return_ride);
  const [originCity, setOriginCity] = useState(props.location.state.originCity);
  const [destinationCity, setDestinationCity] = useState(props.location.state.destinationCity);
  const [returnDate, setReturnDate] = useState(props.location.state.returnDate);
  const [roundTrip, setRoundTrip] = useState(props.location.state.roundTrip);
  const [dates, setDates] = useState(props.location.state.dates);
  const [value, setValue] = React.useState(15);

  const handleChange = (event, newValue) => {
    setValue(newValue)
    const params = {
          originCity: originCity,
          destinationCity: destinationCity,
          departDate: dates[newValue][1],
          returnDate: null
    }
    fetch('/rides/searchRide', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:  JSON.stringify(params)
      }).then(response => response.json())
      .then((data) => {
         if(data.error_code == 0){
             var obj
             try {
                obj = JSON.parse(data.departure_rides);
                console.log(obj)
              } catch (ex) {
                console.error(ex);
              }
              setDepartureRides(obj)
             //save the user object in the
         }else{
             //notify(data.msg)
         }
      }).catch((error) => {
             console.log(error);
             //notify(error.msg)
      });
  }

  return (
  <Container component = "main" maxWidth='md'>
      <CssBaseline />
      <div className = {classes.paper}>
        <ThemeProvider theme={headingTheme}>
          <div style = {{marginBottom: '3%'}}>
            <Typography variant="h5" color = "primary">Departure</Typography>
          </div>
        </ThemeProvider>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
          {dates.map((date, index) => (
            <Tab label={date[0]} {...a11yProps(index)} />
          ))}
          </Tabs>
        </AppBar>
        <div style={{width: '100%'}}>
        {dates.map((date, index) => (
            <TabPanel value={value} index={index}>
              <DepartureRideList
                departureRides={departureRides}
                returnRides={returnRides}
                originCity={originCity}
                destinationCity={destinationCity}
                returnDate={returnDate}
                roundTrip={roundTrip}
                />
            </TabPanel>
          ))}
        </div>
      </div>
  </Container>
  );
}
