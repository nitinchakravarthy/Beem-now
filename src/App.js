import React from 'react';
import './App.css';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import { Switch, Route, Link } from 'react-router-dom'

function App() {
  return (
  	<Switch>
      <Route exact path="/" component={SignIn}/>
      <Route exact path="/home" component={Home}/>
      <Route exact path="/signup" component={SignUp}/>
      <Route exact path="/forgotpassword" component={ForgotPassword}/>
    </Switch>
  );
}

export default App;
