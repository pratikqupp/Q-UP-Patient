import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./style.css";
import SignUp from "./views/sign-up";
import VerifyOTP from "./views/verify-o-t-p";
import BookingScreen from "./views/booking-screen";
import Login from "./views/login";
import Home from "./views/home";
import GenralCheckup from "./views/genral-checkup";

const App = () => {
  return (
    <Router>
      <div>
        <Route component={SignUp} exact path="/sign-up" />
        <Route component={VerifyOTP} exact path="/verify-o-t-p" />
        <Route component={BookingScreen} exact path="/booking-screen" />
        <Route component={GenralCheckup} exact path="/genral-checkup" />
        <Route component={Login} exact path="/login" />
        <Route component={Home} exact path="/:drName/:drId/:specality" />
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
