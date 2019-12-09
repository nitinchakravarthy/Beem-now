import React from 'react';
import './App.css';
import Landing from "./components/Landing";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PostRide from './components/PostRide';
import ErrorNotFound from './components/ErrorNotFound';
import AccountVerified from './components/AccountVerifiedPage';
import FriendList from './components/FriendList';
import Dashboard from './components/Dashboard';
import TermsOfService from './components/TermsOfService';
import { Switch, Route, Link } from 'react-router-dom'


function App(app) {

  return (
  	<Switch>
      <Route exact path="/" component={Landing}/>
      <Route exact path="/signin" component={SignIn}/>
      <Route exact path="/forgotpassword" component={ForgotPassword}/>
      <Route exact path="/resetpassword" component={ResetPassword}/>
      <Route exact path="/termsofservice" component={TermsOfService} />
      <Route exact path="/home" component={Home}/>
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/accountverified" component={AccountVerified}/>
      <Route exact path = '/friendList' component = {FriendList}/>
      <Route exact path = '/chat' component = {Dashboard}/>

      /* add 404 page */
      <Route path="*" component={ErrorNotFound} />
    </Switch>
  );
}

export default App;
