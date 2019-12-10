import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red,green } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import CompanyLogo from '../logo.png';
import Link from '@material-ui/core/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Beem Now
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const ColorButtonAccept = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[700],
    '&:hover': {
      backgroundColor: green[900],
    },
    marginLeft:50,
    marginRight:50
  },
}))(Button);
const ColorButtonReject = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[900],
    },
    marginLeft:50,
    marginRight:50
  },
}))(Button);
const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
},
  centerAlign: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
  },
  logo: {
    textAlign: 'center',
    marginBottom: theme.spacing(3)
},
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [dest, setDest] = useState('');
  return (
      <div className={classes.centerAlign}>
    <Card className={classes.card} >
      <CardHeader
        title="Someone wants to ride with you"/>

      <CardContent>
      <div className={classes.logo}>
        <img src = {CompanyLogo} />
      </div>
        <Typography variant="body2" color="textSecondary" component="p">
          {name} Wants to ride with you on {date} from {start} to {dest}.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
      <Grid container alignContent='flex-end' justify='flex-end'>
        <Grid item xs>
        <ColorButtonAccept size="small" variant="contained" color="primary" className={classes.margin}>
        ACCEPT
        </ColorButtonAccept>
        </Grid>
        <Grid item>
        <ColorButtonReject size="small" variant="contained" color="primary" className={classes.margin}>
        REJECT
        </ColorButtonReject>
        </Grid>
      </Grid>

      </CardActions>
        <CardContent>
        <div>
          <Copyright />
        </div>
        </CardContent>
    </Card>
    </div>
  );
}
