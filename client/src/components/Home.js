import React, { useState, Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import SideDrawer from './SideDrawer';
import PostRide from './PostRide';
import SearchRide from './SearchRide';
import DepartTrip from './DepartureRidesPage';
import ReturnTrip from './ReturnRidesPage';
import RideSummary from './RideSummary';
import RideConfirmed from './rideConfirmedPage';
import RideHistory from './RideHistoryPage';
import { Switch, Route, Link, HashRouter, NavLink} from 'react-router-dom';
export default function Home() {
  return (
      <HashRouter>
        <div>
          <div className="header">
            <SideDrawer>...</SideDrawer>
          </div>
          <div className="content">
            <Route exact path="/" component={SearchRide}/>
            <Route path="/departresults" component={DepartTrip}/>
            <Route path="/returnresults" component={ReturnTrip}/>
            <Route path="/postride" component={PostRide}/>
            <Route path="/ridesummary" component={RideSummary}/>
            <Route path="/rideconfirmed" component={RideConfirmed}/>
            <Route path="/ridehistory" component={RideHistory}/>
          </div>
        </div>
      </HashRouter>
    );
}
