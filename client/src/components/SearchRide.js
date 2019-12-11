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
import CompanyLogo from '../logo.png';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

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
    var startDate = new Date()
    var stopDate = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        var t_date = new Date (currentDate);
        var actualDate = String(t_date.getMonth()+1)+"/"+String(t_date.getDate())+"/"+String(t_date.getYear()+1900);
        dateArray.push([String(t_date.getDate())+" "+monthNames[t_date.getMonth()], actualDate]);
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
export default function SearchRide() {
  const classes = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedDateReturn, handleDateChangeReturn] = useState(new Date());
  const [selectedTime, handleTimeChange] = useState("2019-01-01T00:00:00.000Z");
  const [dateArray, setDateArray] = useState('');
  const [departureRides, setDepartureRides] = useState([]);
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [roundTrip, setRoundTrip] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [seats, setSeats] = useState(1);
  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  const handleSwitch  =  () =>{
    setIsChecked(prev => !prev);
  };
  const handleseatChange = event => {
      setSeats(event.target.value);
    };
  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.target);
      const uid = localStorage.getItem('uid');
      console.log(uid);
      console.log(seats);
      const params = {
          uid: uid,
          roundTrip: false,
          originCity: data.get('originCity'),
          destinationCity: data.get('destinationCity'),
          departDate: data.get('departDate'),
          selectedDepartTime: null,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          seats:data.get('seats')
          //returnDate: data.get('returnDate')
      }
      setOriginCity(data.get('originCity'));
      setDestinationCity(data.get('destinationCity'));
      setDateArray(getDates(selectedDate));
      setRoundTrip(data.get('roundTrip'));
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
             var obj_d;
             try {
                obj_d = JSON.parse(data.departure_rides);
                console.log(obj_d);
              } catch (ex) {
                console.error(ex);
              }
             setDepartureRides(obj_d)
             setIsAuthenticated(true);
         }else{
             //notify(data.msg)
         }
     }).catch((error) => {
         console.log("in error");
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
                                roundTrip:roundTrip,
                                departure_rides: departureRides,
                                originCity: originCity,
                                destinationCity: destinationCity,
                                dates: dateArray,
                                returnDate: selectedDateReturn,
                                seats:seats
                              }
                              }}/> : null}
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
      <div className={classes.logo}>
        <img src = {CompanyLogo} />
      </div>
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
          <Grid container spacing={2}>
           <Grid item xs={6}>
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
           </Grid>

            <Grid item xs={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="seat_select">seats</InputLabel>
                   <Select
                    name = 'seats'
                     labelId="seat_select"
                     id="seats"
                     value={seats}
                     onChange={handleseatChange}
                     >
                     <MenuItem value={1}>1</MenuItem>
                     <MenuItem value={2}>2</MenuItem>
                     <MenuItem value={3}>3</MenuItem>
                     <MenuItem value={4}>4</MenuItem>
                     <MenuItem value={5}>5</MenuItem>
                     <MenuItem value={6}>6</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
          </Grid>

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
                minDate={isChecked? selectedDate:null}
                minDateMessage="Return Date should be after Depart Date"
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
