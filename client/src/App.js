import React from 'react';
import './App.css';
import Landing from "./components/Landing";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ResendTokenPage from "./components/resendTokenPage";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PostRide from './components/PostRide';
import ErrorNotFound from './components/ErrorNotFound';
import AccountVerified from './components/AccountVerifiedPage';
import ChangePassword from './components/changepassword';
import FriendList from './components/FriendList';
import Dashboard from './components/Dashboard';
import TermsOfService from './components/TermsOfService';
import ConfirmRideEmail from './components/confirmRideEmail';
import { Switch, Route, Link } from 'react-router-dom'

function App(app) {

  return (
  	<Switch>
      <Route exact path="/" component={Landing}/>
      <Route exact path="/signin" component={SignIn}/>
      <Route exact path="/resendToken" component={ResendTokenPage}/>
      <Route exact path="/forgotpassword" component={ForgotPassword}/>
      <Route exact path="/resetpassword" component={ResetPassword}/>
      <Route exact path="/termsofservice" component={TermsOfService} />
      <Route exact path="/home" component={Home}/>
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/verifyaccount" component={AccountVerified}/>
      <Route exact path="/resetpassword" component={ChangePassword}/>
      <Route exact path = '/friendList' component = {FriendList}/>
      <Route exact path = '/chat' component = {Dashboard}/>
      <Route exact path = '/confirmride' component = {ConfirmRideEmail}/>

      /* add 404 page */
      <Route path="*" component={ErrorNotFound} />
    </Switch>
  );
}

export default App;
