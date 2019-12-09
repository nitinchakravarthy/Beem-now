import React, { useState, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: '700',
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export default function Review(props) {
  const classes = useStyles();
  const [departId, setDepartId] = useState(props.location.state.departId);
  const [returnId, setreturnId] = useState(props.location.state.returnId);
  const [originCity, setOriginCity] = useState(props.location.state.originCity);
  const [destinationCity, setDestinationCity] = useState(props.location.state.destinationCity);
  const [roundTrip, setRoundTrip] = useState(props.location.state.roundTrip);

  return (
    <React.Fragment>
    <Typography variant="subtitle1" className={classes.total}>
      Bleu
    </Typography>
    </React.Fragment>
  );
}
