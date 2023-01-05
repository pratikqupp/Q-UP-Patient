import React from 'react'
import { useHistory } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './verify-o-t-p.css'
import axios from "axios";

var finalOTP = "";

const VerifyOTP = (props) => {
  var drId =localStorage.getItem('drId');
  var drName =localStorage.getItem('drName');
  var specality =localStorage.getItem('specality');
  var mobileNumber =localStorage.getItem('mobileNumber');
  var photourl="http://68.183.83.230:8765/provider-service/doctor/" + drId+ "/photo"
  const history = useHistory();
  const verifyOtp = async () => {
    if (finalOTP.length == 6) {
      const data2 = new FormData();
    data2.append("scope", "openid");
    data2.append("grant_type", "password");
    data2.append("username", mobileNumber);
    data2.append("password", finalOTP);
    const responce = await axios({
      method: "post",
      url: `http://68.183.83.230:8765/userauth/oauth/token`,
      headers: {
        'Authorization': 'Basic '+btoa('qup-mobile:mob@46$qup'),
      },
      data: data2, // you are sending body instead
    }).then((responce) => {
      console.log('responce sucess', responce.data);
      localStorage.setItem('UserData', JSON.stringify(responce.data));
      alert("Login Succesfull")
      history.push("/booking-screen");
      }).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log("Error api status",error.response.status);
          alert("Provided OTP does not match try again");
          if (error.response.status == 404) {
          
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
      alert("required 6 digits");
    }
  };
  const handlefinalOTP = (event) => {
    if(event.target.value.length>6){
      alert("Enter 6 digit OTP")
      event. target.value = "";
    }else if(event.target.value.length==6){
      finalOTP = event.target.value;
    }
  };
    return (
    <div className="verify-o-t-p-container">
      <Helmet>
        <title>Verify-OTP</title>
        <meta
          property="og:title"
          content="Verify-OTP - Planical modern template"
        />
      </Helmet>
      <section className="verify-o-t-p-section">
        <div className="verify-o-t-p-hero">
          <div className="verify-o-t-p-content">
            <main className="verify-o-t-p-main">
              <img
                alt="image"
                src={photourl}   
                className="verify-o-t-p-image"
              />
              <header className="verify-o-t-p-header">
                <h1 className="verify-o-t-p-heading">{drName}</h1>
                <span className="verify-o-t-p-caption">
                  {specality}
                </span>
                <input
                  type="number"
                  name="OTP"
                  required
                  autoFocus
                  onChange={handlefinalOTP}
                  placeholder="Enter OTP"
                  className="verify-o-t-p-textinput input"
                />
              </header>
              <div className="verify-o-t-p-buttons">             
                  <div onClick={verifyOtp} className="verify-o-t-p-get-started button">
                    <span className="verify-o-t-p-text">
                      <span>Verify</span>
                      <br></br>
                    </span>
                  </div>
              </div>
              <span className="verify-o-t-p-caption1">Powered by Q UP</span>
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VerifyOTP
