import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './home.css'
const Home = (props) => {
  const { drName, drId ,specality} = props.match.params;
  console.log("drName, drId,specality ", drName, drId,specality);
  var photourl="http://68.183.83.230:8765/provider-service/doctor/" + drId+ "/photo"
  localStorage.setItem('drName', drName);
  localStorage.setItem('drId', drId);
  localStorage.setItem('specality', specality);
  return (
   
    <div className="home-container">
      <Helmet>
        <title>Q UP</title>
        <meta property="og:title" content="Planical modern template" />
      </Helmet>
      <section className="home-section">
        <div className="home-hero">
          <div className="home-content">
            <main className="home-main">
              <img
                alt="image"
                src={photourl}
                className="home-image"
              />
              <header className="home-header">
                <h1 className="home-heading">{drName}</h1>
                <span className="home-caption">
                  {specality}
                </span>
              </header>
              <div className="home-buttons">
                <Link to="/login" className="home-navlink">
                  <div className="home-get-started button">
                    <span className="home-text">Proceed for booking</span>
                  </div>
                </Link>
              </div>
              <span className="home-caption1">Powered by Q UP</span>
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
