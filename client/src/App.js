import React from 'react';
import './App.css';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PostRide from './components/PostRide';
import TermsOfService from './components/TermsOfService'
import { Switch, Route, Link } from 'react-router-dom'

function App() {
  return (
  	<Switch>
      <Route exact path="/" component={SignIn}/>
      <Route exact path="/home" component={Home}/>
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/forgotpassword" component={ForgotPassword}/>
      <Route exact path="/resetpassword" component={ResetPassword}/>
      <Route exact path="/postride" component={PostRide} />
      <Route exact path="/termsofservice" component={TermsOfService} />
    </Switch>
  );
}

export default App;
