import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Redirect } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  avatar: {
    marginBottom: theme.spacing(1),
  },
  paper: {
    display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
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

export default function DepartureRideList(props) {
  const classes = useStyles();
  const [departureRides, setDepartureRides] = useState(props.departureRides);
  const [returnRides, setReturnRides] = useState(props.returnRides);
  const [originCity, setOriginCity] = useState(props.originCity);
  const [destinationCity, setDestinationCity] = useState(props.destinationCity);
  const [returnDate, setReturnDate] = useState(props.returnDate);
  const [returnDateArray, setReturnDateArray] = useState(props.returnDate);
  const [isClicked, setIsClicked] = useState(false);
  const [departId, setDepartId] = useState('');
  const [roundTrip, setRoundTrip] =  useState(props.roundTrip);

  const handleSelect = (item) => {
      setReturnDateArray(getDates(returnDate))
      console.log(item._id)
      setDepartId(item._id)
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

  return (
    <div>
    {departureRides.length != 0 ?
    <div>
    {isClicked ?
        (roundTrip ?
            <Redirect to={{pathname: "/returnresults", state: {roundTrip:roundTrip,departId: departId, returnRides: returnRides,originCity: originCity,destinationCity: destinationCity,dates: returnDateArray}}}/> :
            <Redirect to={{pathname:"/ridesummary", state: {roundTrip:roundTrip,departId:departId, originCity:originCity, destinationCity:destinationCity}}}/>
        ): null}
    <Container component = "main" maxWidth='md'>
    <CssBaseline />
    <List>
      {departureRides.map(item => (
      <div>
        <ListItem button key={item._id} alignItems="flex-start">
          <ListItemAvatar>
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
            </ListItemText>
          </Container>
          <ListItemText>
            <Typography variant="h5" align="right">{item.pricePerSeat}$</Typography>
          </ListItemText>
        </ListItem>
        <Divider/>
      </div>
      ))}
    </List> </Container></div> : <Typography variant="h3" color="textSecondary" align="center">No rides found</Typography>}
    </div>
  );
}
