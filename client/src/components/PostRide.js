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
import { ToastContainer, toast } from 'react-toastify';

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

export default function PostRide() {
  const classes = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedDateReturn, handleDateChangeReturn] = useState(new Date());
  const [selectedTime, handleTimeChange] = useState("2019-01-01T00:00:00.000Z");
  const [selectedTimeReturn, handleTimeChangeReturn] = useState("2019-01-01T00:00:00.000Z");
  const [originCityError, setOriginCityError] = useState('');
  const [destinationCityError, setDestinationCityError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [maxCapacityError,setmaxCapacityError ] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const[postSuccess, setPostSuccess] = useState(false);
  // const [state, setState] = useState({
  //   checkedA: true,
  //   checkedB: true,
  // });
  const handleInputChange = event => {
    let name = event.target.name
    let value = event.target.value
    if(name === 'originCity'){
      if (value === '') {
          setOriginCityError('First name is required')
      } else{
          setOriginCityError('')
      }
    } else if(name === 'destinationCity'){
      if (value === '') {
          setDestinationCityError('Last Name is required')
      } else{
          setDestinationCityError('')
      }
    } else if(name === 'maxCapacity'){
      if (value === '') {
          setmaxCapacityError('Enter capacity of your ride')
      } else if (isNaN(value) || parseInt(value) <= 0){
          setmaxCapacityError('Capacity should be a positive number')
      } else {
        setmaxCapacityError('')
      }
      } else if (name === 'pricePerSeat'){
        if (value === '' || value === '0') {
            setAmountError('Do you want to give free ride?')
        } else if (isNaN(value) || parseInt(value) < 0){
            setAmountError('Price should be a positive number')
        } else {
          setAmountError('')
        }
      }
    }

  const handleEmptySubmission = data => {
    var success = true
    if (originCityError !== '' || destinationCityError !== '' ||
        amountError !== '' || maxCapacityError !== '') {
          success = false
          return success
        }

    if(data.get('originCity') === ''){
      setOriginCityError('Origin city is required')
      success = false
    }
    if(data.get('destinationCity') === ''){
      setDestinationCityError('Destination city is required')
      success = false
    }
    if(data.get('pricePerSeat') === ''){
      setAmountError('Do you want to give free ride?')
      success = false
    }
    if(data.get('maxCapacity') === ''){
      setmaxCapacityError('Ride capacity is required')
      success = false
    }
    return success
  }

  const handleSwitch  =  () =>{
    setIsChecked(prev => !prev);
  };
  const handleSubmit = (event) => {
      event.preventDefault();
      const uid = localStorage.getItem('uid');
      console.log(uid);
      const data = new FormData(event.target);
      const success = handleEmptySubmission(data);
      // if(data.get('email') === 'A' &&  data.get('password') === 'B'){
      //   setIsAuthenticated(true);
      // }
      if (success) {
        const body = {
          uid: uid,
          originCity : data.get('originCity'),
          destinationCity: data.get('destinationCity'),
          pricePerSeat: data.get('pricePerSeat'),
          departDate: data.get('departDate'),
          roundTrip: data.get('roundTrip') ? true: false,
          maxCapacity: data.get('maxCapacity'),
          occupiedCapacity : data.get('maxCapacity'),
          departTime: data.get('departTime'),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
        if (data.get('roundTrip')) {
          body['returnDate'] = data.get('returnDate');
          body['returnTime'] = data.get('returnTime');
        }
        fetch('/rides/createRide', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body:  JSON.stringify(body)
        }).then(response => response.json())
        .then((data) => {
           console.log(data);
           if(data.rideStatus) {
               notify("Ride Posted Successfully.")
               setPostSuccess(true);
               setIsAuthenticated(true);
           }else{
               setIsAuthenticated(false);
               notify("There is some error. Please try again later.")
           }
       }).catch((error) => {
           setIsAuthenticated(false);
           console.log(error.msg);
           notify("There is some error. Please try again later.")
       });
        const notify = (toastString) => {
        toast(toastString);
      };
    }

  }
  const [expanded, setExpanded] = useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
 const [value, setValue] = useState();
  return (
    <div>
    {isAuthenticated ? <Redirect to={{pathname:"/" , state: {postSuccess:true} }}/> : null}
    <ToastContainer />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Post Ride
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
            error = {originCityError != ''}
            helperText = {originCityError}
            onChange = {handleInputChange}
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
            error = {destinationCityError != ''}
            helperText = {destinationCityError}
            onChange = {handleInputChange}
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="capacity"
            label="Max Capacity"
            name="maxCapacity"
            //autoComplete=""
            autoFocus
            error = {maxCapacityError != ''}
            helperText = {maxCapacityError}
            onChange ={handleInputChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="amount"
            label="Amount/seat"
            name="pricePerSeat"
            type= "number"
            autoComplete="$"
            autoFocus
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              inputProps: { min: 0, max: 200 },
            }}
            error = {amountError != ''}
            helperText ={amountError}
            onChange ={handleInputChange}
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
                label = "Depart Date"
                name = "departDate"
                value={selectedDate}
                onChange={date => handleDateChange(date)}
                minDate={new Date()}
                format="MM/dd/yyyy"
                autoFocus
              />
              </Grid>
              <Grid item xs={6}>
                <KeyboardTimePicker
                  margin="normal"
                  clearable
                  required
                  ampm={true}
                  inputVariant="outlined"
                  label="Depart Time"
                  name="departTime"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  autoFocus
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
            <FormControlLabel
              control={
                <Switch
                  checked={isChecked}
                  onChange={handleSwitch}
                  value={isChecked}
                  color="primary"
                  name ="roundTrip"
                />
              }
              label = "Make This a Round Trip"
              labelPlacement="start"
              name ="roundTrip"
            />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2}>
             <Grid item xs={6}>
              <KeyboardDatePicker
                margin="normal"
                clearable
                disabled = {!isChecked}
                disablePast
                inputVariant = "outlined"
                label = "Return Date"
                name = "returnDate"
                value={selectedDateReturn}
                onChange={date => handleDateChangeReturn(date)}
                minDate={isChecked? selectedDate:null}
                minDateMessage="Return Date should be after Depart Date"
                format="MM/dd/yyyy"
                autoFocus
              />
              </Grid>
              <Grid item xs={6}>
                <KeyboardTimePicker
                  margin="normal"
                  clearable
                  disabled = {!isChecked}
                  ampm={true}
                  inputVariant="outlined"
                  label="Return Time"
                  name = "returnTime"
                  value={selectedTimeReturn}
                  onChange={handleTimeChangeReturn}
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
            Post
          </Button>
        </form>
      </div>
    </Container>
    </div>
  );
}
