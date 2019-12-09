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
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { pink } from '@material-ui/core/colors';
import { Redirect } from 'react-router-dom';

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
    display: 'flex',
  },
  card: {
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24)',
    borderRadius: '15px',
    marginBottom: theme.spacing(2),
  },
}));

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];


export default function AlignItemsList(props) {
  const classes = useStyles();
  const [departId, setDepartId] = useState(props.departId);
  const [returnRides, setReturnRides] = useState(props.returnRides);
  const [originCity, setOriginCity] = useState(props.originCity);
  const [destinationCity, setDestinationCity] = useState(props.destinationCity);
  const [roundTrip, setRoundTrip] =  useState(props.roundTrip);
  const [returnId, setReturnId] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  const handleSelect = (item) => {
      console.log(item._id)
      setReturnId(item._id)
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
    {returnRides.length != 0 ?
    <div>
    {isClicked ? <Redirect to={{pathname:"/ridesummary", state: {roundTrip:roundTrip,departId:departId, returnId:returnId, originCity:originCity, destinationCity:destinationCity}}}/>:null}
    <Container component = "main" maxWidth='md'>
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
  );
}
