import React, {useState, useEffect} from 'react';
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
  const [departureRide, setDepartureRide] = useState(props.location.state.selectedDepartRide);
  const [roundTrip, setRoundTrip] = useState(props.location.state.roundTrip);
  const [returnRide, setReturnRide] = useState(props.location.state.selectedReturnRide);
  const [departSuccess, setdepartSuccess] = useState(false);
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [ridesRequested, setRidesRequested] = useState(false);
  const [seats, setSeats] = useState(props.location.state.seats);

  const notify = (toastString) => {
      toast(toastString);
    };
    useEffect(() => {
          console.log("in Ride summarry useEffect");
          console.log(seats);
      });

  var totalCost = parseFloat(seats) * (parseFloat(departureRide.pricePerSeat) + (roundTrip?parseFloat(returnRide.pricePerSeat):0.0) )
  const formatDepartureDate = (date) => {
      var t = date.split('T')
      var time = t[1].split(':')
      var meridian = (parseInt(time[0]) < 12) ? "AM" : "PM"
      var t_date = new Date(date)
      var dateString = t_date.getDate() + " " + monthNames[t_date.getMonth()] + " • "
                       + time[0] + ":"+ time[1] + " " + meridian
      return dateString
  }


  const handleConfirm = (event) => {
      console.log("Ride confirmed...")
      if(roundTrip){
          handleRoundTrip();
      }else{
          handleSingleRide();
      }
  }
  const handleRoundTrip = () => {
        console.log("handling roundtrip");
        chooseRidePost(departId,handleDepartResponse);
        chooseRidePost(returnId,handleReturnResponse);
  }
  const handleSingleRide = () => {
      chooseRidePost(departId,handleDepartResponse);
  }
  const handleDepartResponse = (resp) =>{
      console.log("handling depart ride response");
    if(resp.error_code == 0){
        setdepartSuccess(true);
        if(!roundTrip){
            console.log("handling depart ride response but not roundTrip");
            setRidesRequested(true);
        }
    }
  }
  const handleReturnResponse= (resp) => {
      console.log("handling return ride response");
      if(resp.error_code == 0){
        setReturnSuccess(true);
      }
  }
  const chooseRidePost = (rid,successCallback) => {
      console.log("choose ride post");
      console.log(rid);
      var body = {uid:localStorage.getItem('uid'),
                  rid:rid,
                  seats:seats};
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
      { ((!roundTrip && departSuccess) || (roundTrip && departSuccess && returnSuccess))  ? <Redirect to={{ pathname : "/rideconfirmed",
                                    state : {roundTrip :{roundTrip},
                                            departSuccess: {departSuccess},
                                            returnSuccess: {returnSuccess}
                                    }
        }} />: null}
      <ToastContainer />
    <Container component = "main" maxWidth='md'>
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
              <ListItem key={departureRide._id} alignItems="flex-start">
                <ListItemAvatar className = {classes.avatarBlock}>
                  <Avatar alt="No Image" src={departureRide.host.avatar} className={classes.avatar}>
                     {departureRide.host.first_name[0]}
                  </Avatar>
                  <Typography variant="body1" color="textSecondary">{departureRide.host.first_name}</Typography>
                  <ThemeProvider theme={headingTheme}>
                    <Button variant="contained" color = "primary" className={classes.chatButton} component = {Link} to={{

                    pathname:'/chat', state: { to: departureRide.host.first_name, name: localStorage.getItem('first_name')}}}>
                      Chat
                    </Button>
                  </ThemeProvider>
                </ListItemAvatar>
                <Grid container spacing={1}>
                  <Grid item xs>
                    <ListItemText key={departureRide._id}>
                      <Typography variant="body1" color="textSecondary">⦿ {departureRide.originCity}</Typography>
                      <Typography variant="body1" color="textSecondary"><span>&nbsp;</span>|</Typography>
                      <Typography variant="body1" color="textSecondary">⦿ {departureRide.originCity}</Typography>
                      <Typography variant="subtitle2" align='justify' color="textSecondary">
                        {formatDepartureDate(departureRide.departDate)}
                      </Typography>
                    </ListItemText>
                  </Grid>
                  <Grid item md>
                    <ListItemText>
                      <Typography variant="h6" align = "center" color="textSecondary">Price</Typography>
                      <Typography variant="h6" align = "center" color="textSecondary">{seats*departureRide.pricePerSeat}$</Typography>
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
                  <ListItem key={returnRide._id} alignItems="flex-start">
                    <ListItemAvatar className = {classes.avatarBlock}>
                      <Avatar alt="No Image" src={returnRide.host.avatar} className={classes.avatar}>
                         {returnRide.host.first_name[0]}
                      </Avatar>
                      <Typography variant="body1" color="textSecondary">{returnRide.host.first_name}</Typography>
                      <ThemeProvider theme={headingTheme}>
                        <Button
                          variant="contained"
                          color = "primary"
                          className={classes.chatButton}
                          component = {Link} to={{

                          pathname:'/chat', state: { to: returnRide.host.first_name, name: localStorage.getItem('first_name')}}}
                        >
                          Chat
                        </Button>
                      </ThemeProvider>
                    </ListItemAvatar>
                    <Grid container spacing={1}>
                      <Grid item xs>
                        <ListItemText key={returnRide._id}>
                          <Typography variant="body1" color="textSecondary">⦿ {returnRide.destinationCity}</Typography>
                          <Typography variant="body1" color="textSecondary"><span>&nbsp;</span>|</Typography>
                          <Typography variant="body1" color="textSecondary">⦿ {returnRide.originCity}</Typography>
                          <Typography variant="subtitle2" align='justify' color="textSecondary">
                            {formatDepartureDate(returnRide.departDate)}
                          </Typography>
                        </ListItemText>
                      </Grid>
                      <Grid item md>
                        <ListItemText>
                          <Typography variant="h6" align = "center" color="textSecondary">Price</Typography>
                         <Typography variant="h6" align = "center" color="textSecondary">{seats*returnRide.pricePerSeat}$</Typography>
                        </ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                </div></div> : null}
            </div>
            <Divider style = {{marginTop: '5%'}}/>
            <div className = {classes.card}>
              <ListItem key={departureRide._id} alignItems="flex-start">
                <Grid container direction="row" justify="space-between" alignItems="flex-start">
                 <Typography variant="h6" color="textSecondary">Total</Typography>
                 <Typography variant="h6" color="textSecondary" className = {classes.priceTag}>{totalCost}$</Typography>
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
