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
  paper: {
    display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
  },
}));


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

  return (
    <div>
    {returnRides.length != 0 ?
    <div>
    {isClicked ? <Redirect to={{pathname:"/ridesummary", state: {roundTrip:roundTrip,departId:departId, returnId:returnId, originCity:originCity, destinationCity:destinationCity}}}/>:null}
    <Container component = "main" maxWidth='md'>
    <CssBaseline />
    <List>
      {returnRides.map(item => (
      <div>
      <ListItem button key={item._id} alignItems="flex-start">
        <ListItemAvatar>
        <Avatar alt="No Image" src={item.avatar} className={classes.avatar}>
           {item.host.first_name[0]}
        </Avatar>
        </ListItemAvatar>
      <Container maxWidth='md'>
        <ListItemText key={item._id} onClick = {() => handleSelect(item)}>
          <Typography variant="body1" color="textSecondary">⦿ {item.originCity}</Typography>
          <Typography variant="body1" color="textSecondary"><span>&nbsp;</span>|</Typography>
          <Typography variant="body1" color="textSecondary">⦿ {item.destinationCity}</Typography>

          <Typography variant="subtitle2" align='justify' color="textPrimary">{item.departDate}</Typography>
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
