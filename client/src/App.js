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
import TermsOfService from './components/TermsOfService';
import ConfirmRideEmail from './components/confirmRideEmail';
import { BrowserRouter  as Router, Switch, Route, Link } from 'react-router-dom'

function App(app) {

  return (
  	<Switch>
      <Route exact path="/" component={Landing}/>
      <Route path="/signin" component={SignIn}/>
      <Route path="/resendToken" component={ResendTokenPage}/>
      <Route path="/forgotpassword" component={ForgotPassword}/>
      <Route path="/resetpassword" component={ResetPassword}/>
      <Route path="/termsofservice" component={TermsOfService} />
      <Route component={Home}/>
      <Route path="/signup" component={SignUp}/>
      <Route path="/verifyaccount" component={AccountVerified}/>
      <Route path="/resetpassword" component={ChangePassword}/>
      <Route path="/verifyaccount/:token" component={AccountVerified}/>
      <Route path="/resetpassword/:token" component={ChangePassword}/>
      <Route path = '/confirmride' component = {ConfirmRideEmail}/>

      /* add 404 page */
      <Route path="*" component={ErrorNotFound} />
    </Switch>
  );
}

export default App;
