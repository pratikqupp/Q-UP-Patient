import React from 'react'
import { useHistory } from 'react-router-dom'

import { Helmet } from 'react-helmet'
import axios from "axios";
import './login.css'
var finalMobileNumber = "";
const Login = (props) => {
  var drId = localStorage.getItem('drId');
  var drName = localStorage.getItem('drName');
  var specality =localStorage.getItem('specality')
  var photourl="http://68.183.83.230:8765/provider-service/doctor/" + drId+ "/photo"

  //for work
  const history = useHistory();

  const signIn = async () => {
    if (finalMobileNumber.length == 10) {
      const payload = {
        requestedRole: "PATIENT",
      };
      const responce = await axios({
        method: "post",
        // url: `https://api.qupdev.com/userauth/users/sign-in/` + finalMobileNumber,
        url: `http://68.183.83.230:8765/userauth/users/sign-in/` + finalMobileNumber,
        data: payload,

        headers: {
          "Content-Type": "application/json",
        },
      }).then((responce) => {
        console.log('responce sucess', responce.data);
        localStorage.setItem('PatientData', JSON.stringify(responce.data));
        localStorage.setItem('mobileNumber', finalMobileNumber);
        alert("Welcome " + responce.data.firstName + " " + responce.data.lastName+"\nCheck SMS For OTP")
        history.push("/verify-o-t-p");
      }).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log("Error api status",error.response.status);
          if (error.response.status == 404) {
            localStorage.setItem('mobileNumber', finalMobileNumber);
            history.push("/sign-up");
          }
          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });

    } else {
      alert("required 10 digits");
    }
  };
  const handleMobileNumber = (event) => {
    if(event.target.value.length>10){
      alert("Enter 10 digit mobile number")
      event. target.value = "";
    }else if(event.target.value.length==10){
      finalMobileNumber = event.target.value;
    }
  };
  return (
    <div className="login-container">
      <Helmet>
        <title>Login</title>
        <meta property="og:title" content="Login - Planical modern template" />
      </Helmet>
      <section className="login-section">
        <div className="login-hero">
          <div className="login-content">
            <main className="login-main">
              <img
                alt="image"
                src={photourl}
                className="login-image"
              />
              <header className="login-header">
                <h1 className="login-heading">{drName}</h1>
                <span className="login-caption">
                  {specality}
                </span>
                <input
                  type="number"
                  name="Mobile number"
                  required
                  autoFocus
                  onChange={handleMobileNumber}
                  placeholder="Mobile number"
                  autoComplete="on"
                  className="login-textinput input"
                  pattern="[1-9]{1}[0-9]{9}"
                />
              </header>
              <div className="login-buttons">

                <div onClick={signIn} className="login-get-started button">
                  <span className="login-text">
                    <span>Send OTP</span>
                    <br></br>
                  </span>
                </div>

              </div>
              <span className="login-caption1">Powered by Q UP</span>
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
