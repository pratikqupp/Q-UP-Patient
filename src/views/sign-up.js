import React from 'react'
import { useHistory } from 'react-router-dom'

import { Helmet } from 'react-helmet'
import axios from "axios";
import './sign-up.css'
var finalFirstName= "";
var finalLastName= "";
const SignUp = (props) => {
  var drId =localStorage.getItem('drId');
  var drName =localStorage.getItem('drName');
  var specality =localStorage.getItem('specality');
  var mobileNumber =localStorage.getItem('mobileNumber');
  var photourl="http://68.183.83.230:8765/provider-service/doctor/" + drId+ "/photo"

  //for work
  const history = useHistory();

  const signUp = async () => {
    if (finalFirstName.length !=null&&finalLastName!=null&&mobileNumber!=null) {
      const payload = {
      firstName: finalFirstName,
      lastName: finalLastName,
      mobileNumber: mobileNumber,
      requestedRole:"PATIENT",
      preferredLanguageId:"5ad887231fd47a000d03368d"
      }
      const responce = await axios({
        method: "post",
        // url: `https://api.qupdev.com/userauth/users/sign-up` ,
        url: `http://68.183.83.230:8765/userauth/users/sign-up`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
           'Authorization': 'Basic '+btoa('qup-mobile:mob@46$qup'),
        },
      }).then((responce) => {      
        
        // alert("Sign UP Succesfull \nNow Login With Mobile number")
        history.push("/verify-o-t-p");
      }).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log("Error api status",error.response.status);
          console.log("ERROR",error.responce)
          alert("Something Went Wrong Try Again")
        
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

  const handelFirstName = (event) => {
   finalFirstName = event.target.value;
  };
  const handelLastName = (event) => {
   finalLastName = event.target.value;
  };
  return (
    <div className="sign-up-container">
      <Helmet>
        <title>SignUp - Q UP</title>
        <meta property="og:title" content="SignUp - Planical modern template" />
      </Helmet>
      <section className="sign-up-section">
        <div className="sign-up-hero">
          <div className="sign-up-content">
            <main className="sign-up-main">
              <img
                alt="image"
                src={photourl}
                className="sign-up-image"
              />
              <header className="home-header">
                <h1 className="home-heading">{drName}</h1>
                <span className="home-caption">
                  {specality}
                </span>
                <span className="home-caption">
                  {mobileNumber}
                </span>
                <input
                  type="text"
                  name="First Name"
                  required
                  autoFocus
                  onChange={handelFirstName}
                  placeholder="First Name"
                  autoComplete="on"
                  className="sign-up-textinput input"
                />
                <input
                  type="text"
                  name="Last Name"
                  required
                  placeholder="Last Name"
                  onChange={handelLastName}
                  autoComplete="on"
                  className="sign-up-textinput1 input"
                />
              </header>
              <div className="sign-up-buttons">
                  <div onClick={signUp} className="sign-up-get-started button">
                    <span className="sign-up-text">
                      <span>Next</span>
                      <br></br>
                    </span>
                  </div>
              </div>
              <span className="sign-up-caption1">Powered by Q UP</span>
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SignUp
