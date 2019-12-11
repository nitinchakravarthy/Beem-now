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

import FriendList from './FriendList';
import Dashboard from './Dashboard';
import RideHistory from './RideHistoryPage'
import RideConfirmed from './rideConfirmedPage';

import { Switch, Route, Link, HashRouter, BrowserRouter} from 'react-router-dom';
export default function Home() {
  return (
      <BrowserRouter>
        <div className="container">
          <Route exact path="/home" component={SearchRide}/>
          <Route path="/home/departresults" component={DepartTrip}/>
          <Route path="/home/returnresults" component={ReturnTrip}/>
          <Route path="/home/postride" component={PostRide}/>
          <Route path="/home/ridesummary" component={RideSummary}/>
          <Route path="/home/rideconfirmed" component={RideConfirmed}/>
          <Route path="/home/ridehistory" component={RideHistory}/>
          <Route path = '/home/friendList' component = {FriendList}/>
          <Route path = '/home/chat' component = {Dashboard}/>
          <SideDrawer />
        </div>
       </BrowserRouter> 
    );
}
