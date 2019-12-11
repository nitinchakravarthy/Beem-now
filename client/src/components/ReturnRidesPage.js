import React, {useState} from 'react';
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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { pink } from '@material-ui/core/colors';
import { Redirect, withRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';



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
  inline: {
    display: 'inline',
  },
  avatarBlock: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    marginBottom: theme.spacing(1),
    backgroundColor: pink[400],
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
    borderRadius: '15px',
    marginBottom: theme.spacing(2),
  },
}));

const headingTheme = createMuiTheme({
  typography: {
    h5: {
      fontWeight: 500,
    },
  },
});

export default withRouter ( function ReturnRidesPage(props) {
  const classes = useStyles();
  const [returnRides, setReturnRides] = useState(props.location.state.returnRides);
  const [originCity, setOriginCity] = useState(props.location.state.originCity);
  const [destinationCity, setDestinationCity] = useState(props.location.state.destinationCity);
  const [dates, setDates] = useState(props.location.state.dates)
  const [roundTrip, setRoundTrip] = useState(props.location.state.roundTrip);
  const [departId, setDepartId] = useState(props.location.state.departId);
  const [returnId, setReturnId] = useState('');
  const [selectedDepartRide, setSelectedDepartRide] = useState(props.location.state.selectedDepartRide);
  const [selectedReturnRide, setSelectedReturnRide] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const [seats, setSeats] = useState(props.location.state.seats);

  const [value, setValue] = useState(dates.length - 16);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

  const handleSelect = (item) => {
      console.log(item._id)
      setSelectedReturnRide(item)

      setIsClicked(true)
  }

  const formatDepartureDate = (date) => {
      var t = date.split('T')
      var time = t[1].split(':')
      var meridian = (parseInt(time[0]) < 12) ? "AM" : "PM"
      var t_date = new Date(date)
      var dateString = t_date.getDate() + " " + monthNames[t_date.getMonth()] + " • "
                       + time[0] + ":"+ time[1] + " " + meridian
      return dateString
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
    const params = {
          uid: localStorage.getItem('uid'),
          originCity: destinationCity,
          destinationCity: originCity,
          departDate: dates[newValue][1],
          selectedDepartTime: selectedDepartRide.departDate,
          roundTrip: false,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          seats:seats
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
              } catch (ex) {
                console.error(ex);
              }
             setReturnRides(obj)
             console.log("Authenticated")
             //save the user object in the
         }else{
             //notify(data.msg)
         }
         }).catch((error) => {
             console.log(error);
             //notify(error.msg)
         });
  };

  return (
  <div>
  {isClicked ? props.history.push({pathname:"/home/ridesummary", 
                                state: {
                                  roundTrip: roundTrip,
                                  originCity: originCity,
                                  destinationCity: destinationCity,
                                  selectedDepartRide: selectedDepartRide,
                                  selectedReturnRide: selectedReturnRide,
                                  seats:seats
                                },
                                }) : null}
  <Container component = "main" maxWidth='md'>
      <CssBaseline />
      <div className = {classes.paper}>
        <ThemeProvider theme={headingTheme}>
          <div style = {{marginBottom: '3%'}}>
            <Typography variant="h5" color = "primary">Return</Typography>
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
            <div>
            {returnRides.length != 0 ?
            <div>
            <Container component = "main" maxWidth='md' style = {{padding: '0 0 0 0'}}>
            <CssBaseline />
            <List>
              {returnRides.map(item => (
              <div className = {classes.card}>
                <ListItem button key={item._id} alignItems="flex-start">
                  <ListItemAvatar className = {classes.avatarBlock}>
                    <Avatar alt="No Image" src={item.avatar} className={classes.avatar}>
                       {item.host.first_name[0]}
                    </Avatar>
                    <Typography variant="body1" color="textSecondary">{item.host.first_name}</Typography>
                  </ListItemAvatar>
                  <Container maxWidth='md'>
                    <ListItemText key={item._id} onClick = {() => handleSelect(item)}>
                      <Typography variant="body1" color="textSecondary">⦿ {item.originCity}</Typography>
                      <Typography variant="body1" color="textSecondary"><span>&nbsp;</span>|</Typography>
                      <Typography variant="body1" color="textSecondary">⦿ {item.destinationCity}</Typography>
                      <Typography variant="body1" color="textSecondary">Seats Left : {item.maxCapacity}</Typography>
                      <Typography variant="subtitle2" align='justify' color="textSecondary">
                        {formatDepartureDate(item.departDate)}
                      </Typography>
                      <Typography variant="h6" align = "right">{item.pricePerSeat}$</Typography>
                    </ListItemText>
                    </Container>
                  </ListItem>
                </div>
                ))}
              </List> </Container></div> : <Typography variant="h3" color="textSecondary" align="center">No rides found</Typography>}
              </div>
                      </TabPanel>
                    ))}
                  </div>
                </div>
  </Container>
  </div>
  );
})
