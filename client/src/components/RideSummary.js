import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Redirect } from 'react-router-dom';
import { pink, green } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';



const useStyles = makeStyles(theme => ({
   root: {
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
    marginRight: theme.spacing(3),
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
    width: '100%'
  },
  mainContainer: {
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  priceTag: {
    paddingRight: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  chatButton: {
    margin: theme.spacing(3, 0, 2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const headingTheme = createMuiTheme({
  typography: {
    h5: {
      fontWeight: 500,
    },
  },
});

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

export default function RideSummary(props) {
  const classes = useStyles();
  const [departId, setDepartId] = useState(props.location.state.departId);
  const [returnId, setreturnId] = useState(props.location.state.returnId);
  const [originCity, setOriginCity] = useState(props.location.state.originCity);
  const [destinationCity, setDestinationCity] = useState(props.location.state.destinationCity);
  const [roundTrip, setRoundTrip] = useState(props.location.state.roundTrip);
  const [departDriver, setDepartDriver] = useState('Mohinish');
  const [returnDriver, setReturnDriver] = useState('David');
  const [departDate, setDepartDate] = useState('2019-01-01T06:00:00.000Z');
  const [returnDate, setReturnDate] = useState('2019-01-02T07:30:00.000Z');
  const [departPrice, setDepartPrice] = useState(10);
  const [returnPrice, setReturnPrice] = useState(15);
  const [departSuccess, setdepartSuccess] = useState(false);
  const [returnSuccess, setreturnSuccess] = useState(false);
  const [ridesRequested, setRidesRequested] = useState(false);
  const notify = (toastString) => {
      toast(toastString);
    };

  const formatDepartureDate = (date) => {
      var t = date.split('T')
      var time = t[1].split(':')
      var meridian = (parseInt(time[0]) < 12) ? "AM" : "PM"
      var t_date = new Date(date)
      var dateString = t_date.getDate() + " " + monthNames[t_date.getMonth()] + " • "
                       + time[0] + ":"+ time[1] + " " + meridian
      return dateString
  }

  const calculateTotalPrice = () => {
      var total = 15
      if(roundTrip) total =  departPrice + returnPrice;
      else total = departPrice;
      return total.toString();
  }

  const handleConfirm = (event) => {
      console.log("Ride confirmed...")
      if(roundTrip){
          handleRoundTrip();

      }else{
      }
  }
  const handleRoundTrip = () => {
        chooseRidePost(departId,handleDepartResponse);
        chooseRidePost(returnId,handleReturnResponse);
  }
  const handleSingleRide = () => {
      chooseRidePost(departId,handleDepartResponse)
  }
  const handleDepartResponse = (resp) =>{
    if(resp.error_code == 0){
        setdepartSuccess(true);
        if(!roundTrip){
            setRidesRequested(true);
        }
        if(roundTrip && departSuccess && returnSuccess){
            setRidesRequested(true)
        }
    }
  }
  const handleReturnResponse= (resp) => {
      if(resp.error_code == 0){
        setReturnSuccess(true);
        if(roundTrip && departSuccess && returnSuccess){
            setRidesRequested(true)
        }
      }
  }
  const chooseRidePost = (rid,successCallback) => {
      var body = {uid:localStorage.get('uid'),
                  rid:rid};
      fetch('/rides/chooseride', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then(response => response.json())
      .then((resp) => {
          if(resp.error_code == 0){
              console.log(resp);
              successCallback(resp);
          }else{
              notify(resp.msg)
          }

     }).catch( (error) => {
        notify("Unable to request ride. Something has gone wrong");
         console.log(error);
     });
  }

  return (
      <div>
      {ridesRequested ?  <Redirect to={{ pathname : "/rideconfirmed",
                                    state : {roundTrip :{roundTrip},
                                            departSuccess: {departSuccess},
                                            returnSuccess: {returnSuccess}
                                    }
        }} />: null}
      <ToastContainer />
    <Container component = "main" maxWidth='xs'>
      <CssBaseline />
      <div className = {classes.paper}>
        <ThemeProvider theme={headingTheme}>
          <div style = {{marginBottom: '3%'}}>
            <Typography variant="h5" color = "primary">Ride Summary</Typography>
          </div>
        </ThemeProvider>
        <div className = {classes.mainContainer}>
          <List style = {{width: '95%'}}>
            <div>
              <Typography variant="h6" color="textSecondary">Departure:</Typography>
            </div>
            <Divider />
            <div className = {classes.card}>
              <ListItem key={departId} alignItems="flex-start">
                <ListItemAvatar className = {classes.avatarBlock}>
                  <Avatar alt="No Image" src={null} className={classes.avatar}>
                     {"Mohinish"[0]}
                  </Avatar>
                  <Typography variant="body1" color="textSecondary">{departDriver}</Typography>
                  <ThemeProvider theme={headingTheme}>
                    <Button variant="contained" color = "primary" className={classes.chatButton} component = {Link} to={{
                    pathname:'/chat', state: { to: departDriver, name: localStorage.getItem('first_name')}}}>
                      Chat
                    </Button>
                  </ThemeProvider>
                </ListItemAvatar>
                <Grid container spacing={1}>
                  <Grid item xs>
                    <ListItemText key={departId}>
                      <Typography variant="body1" color="textSecondary">⦿ {originCity}</Typography>
                      <Typography variant="body1" color="textSecondary"><span>&nbsp;</span>|</Typography>
                      <Typography variant="body1" color="textSecondary">⦿ {destinationCity}</Typography>
                      <Typography variant="subtitle2" align='justify' color="textSecondary">
                        {formatDepartureDate(departDate)}
                      </Typography>
                    </ListItemText>
                  </Grid>
                  <Grid item md>
                    <ListItemText>
                      <Typography variant="h6" align = "center" color="textSecondary">Price</Typography>
                      <Typography variant="h6" align = "center" color="textSecondary">{departPrice}$</Typography>
                    </ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            </div>
            <div>
              { roundTrip ?
                <div>
                <div>
                  <Typography variant="h6" color="textSecondary">Return:</Typography>
                </div>
                <Divider />
                <div className = {classes.card}>
                  <ListItem key={returnId} alignItems="flex-start">
                    <ListItemAvatar className = {classes.avatarBlock}>
                      <Avatar alt="No Image" src={null} className={classes.avatar}>
                         {"David"[0]}
                      </Avatar>
                      <Typography variant="body1" color="textSecondary">{returnDriver}</Typography>
                      <ThemeProvider theme={headingTheme}>
                        <Button
                          variant="contained"
                          color = "primary"
                          className={classes.chatButton}
                          component = {Link} to={{
                          pathname:'/chat', state: { to: returnDriver, name: localStorage.getItem('first_name')}}}
                        >
                          Chat
                        </Button>
                      </ThemeProvider>
                    </ListItemAvatar>
                    <Grid container spacing={1}>
                      <Grid item xs>
                        <ListItemText key={departId}>
                          <Typography variant="body1" color="textSecondary">⦿ {destinationCity}</Typography>
                          <Typography variant="body1" color="textSecondary"><span>&nbsp;</span>|</Typography>
                          <Typography variant="body1" color="textSecondary">⦿ {originCity}</Typography>
                          <Typography variant="subtitle2" align='justify' color="textSecondary">
                            {formatDepartureDate(returnDate)}
                          </Typography>
                        </ListItemText>
                      </Grid>
                      <Grid item md>
                        <ListItemText>
                          <Typography variant="h6" align = "center" color="textSecondary">Price</Typography>
                         <Typography variant="h6" align = "center" color="textSecondary">{returnPrice}$</Typography>
                        </ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                </div></div> : null}
            </div>
            <Divider style = {{marginTop: '5%'}}/>
            <div className = {classes.card}>
              <ListItem key={departId} alignItems="flex-start">
                <Grid container direction="row" justify="space-between" alignItems="flex-start">
                 <Typography variant="h6" color="textSecondary">Total</Typography>
                 <Typography variant="h6" color="textSecondary" className = {classes.priceTag}>{"25"}$</Typography>
                </Grid>
              </ListItem>
            </div>
          </List>
        </div>
      </div>
      <div>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            backgroundColor = '#62c9f2'
            className={classes.submit}
            onClick = {handleConfirm}
          >
            Confirm
          </Button>
      </div>
    </Container>
    </div>
  );
}
