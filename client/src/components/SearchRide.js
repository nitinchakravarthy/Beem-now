import React, { Fragment, useState } from 'react';
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
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router-dom';
import { KeyboardDatePicker, MuiPickersUtilsProvider, KeyboardTimePicker} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import Switch from '@material-ui/core/Switch';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const dates = ["10 Dec", "11 Dec", "12 Dec", "13 Dec", "14 Dec",
"15 Dec", "16 Dec", "17 Dec", "18 Dec", "19 Dec", "20 Dec"]
const departure_rides = [
  {
     "_id": "5dbb9426341020625232cabc",
     "isActive": true,
     "roundTrip": false,
     "maxCapacity": 3,
     "seatsRemaining": 2,
     "costPerSeat": "$15.65",
     "picture": "http://placehold.it/32x32",
     "age": 27,
     "driverName": "Deanne Simpson",
     "driverGender": "female",
     "school": "TAMU",
     "driverEmail": "deannesimpson@plasmox.com",
     "driverPhone": "+1 (860) 456-3906",
     "initialAddress": "130 Lancaster Avenue, Mayfair, Puerto Rico, 4215",
     "finalAddress": "464 Brown Street, Brecon, Kentucky, 9163",
     "initialCity": "Houston",
     "finalCity" : "Austin",
     "initialLatitude": 3.947075,
     "initialLongitude": -148.546124,
     "finalLatitude": -71.746849,
     "finalLongitude": 48.105426,
     "departureDate": "9/26/2019",
     "departureTime": "08:00am"
     }
]

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(date) {
    var days = 15
    var startDate = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    var stopDate = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        var t_date = new Date (currentDate);
        var actualDate = String(t_date.getYear()+1900)+"-"+String(t_date.getMonth()+1)+"-"+String(t_date.getDate());
        dateArray.push([String(t_date.getDate())+" "+monthNames[t_date.getMonth()], actualDate]);
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

export default function SearchRide() {
  const classes = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedDateReturn, handleDateChangeReturn] = useState(new Date());
  const [selectedTime, handleTimeChange] = useState("2019-01-01T00:00:00.000Z");
  const [dateArray, setDateArray] = useState('');
  const [departureRides, setDepartureRides] = useState([]);
  const [returnRides, setReturnRides] = useState([]);
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');

  const [isChecked, setIsChecked] = useState(false);

  const handleSwitch  =  () =>{
    setIsChecked(prev => !prev);
  };

  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const params = {
          roundTrip: data.get('roundTrip'),
          originCity: data.get('originCity'),
          destinationCity: data.get('destinationCity'),
          departDate: data.get('departDate'),
          returnDate: data.get('returnDate')
      }
      setOriginCity(data.get('originCity'))
      setDestinationCity(data.get('destinationCity'))
      setDateArray(getDates(selectedDate))
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
             var obj_d, obj_r
             try {
                obj_d = JSON.parse(data.departure_rides);
                obj_r = JSON.parse(data.return_rides);
              } catch (ex) {
                console.error(ex);
              }
             setDepartureRides(obj_d)
             setReturnRides(obj_r)
             setIsAuthenticated(true);
         }else{
             //notify(data.msg)
         }
     }).catch((error) => {
         console.log(error);
         //notify(error.msg)
     });
  }
  const [expanded, setExpanded] = useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
 const [value, setValue] = useState();
  return (
    <div>
    {isAuthenticated ? <Redirect to={{
                              pathname: "/departresults",
                              state: {

                                departure_rides: departureRides,
                                return_ride: returnRides,
                                originCity: originCity,
                                destinationCity: destinationCity,
                                dates: dateArray,
                                returnDate: selectedDateReturn
                              }
                              }}/> : null}
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Search Ride
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="originCity"
            label="From"
            type="from"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="To"
            label="To"
            name="destinationCity"
            autoComplete="email"
            autoFocus
          />
          <FormControlLabel
              control={
                <Switch
                  checked={isChecked}
                  onChange={handleSwitch}
                  value={isChecked}
                  color="primary"
                />
              }
              name = 'roundTrip'
              label = "Round Trip"
              labelPlacement="start" 
            />
           <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2}>
             <Grid item xs={6}>
              <KeyboardDatePicker
                margin="normal"
                clearable
                required
                disablePast
                inputVariant = "outlined"
                name = 'departDate'
                label = "Travel Date"
                value={selectedDate}
                onChange={date => handleDateChange(date)}
                minDate={new Date()}
                format="MM/dd/yyyy"
                autoFocus
              />
              </Grid>
              <Grid item xs={6}>
                <KeyboardDatePicker
                margin="normal"
                clearable
                disabled = {!isChecked}
                disablePast
                inputVariant = "outlined"
                name = 'returnDate'
                label = "Return Date"
                value={selectedDateReturn}
                onChange={date => handleDateChangeReturn(date)}
                minDate={new Date()}
                format="MM/dd/yyyy"
                autoFocus
              />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Search
          </Button>
        </form>
      </div>
    </Container>
    </div>
  );
}