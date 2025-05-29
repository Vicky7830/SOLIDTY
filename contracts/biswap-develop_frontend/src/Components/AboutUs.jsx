import React from 'react';
import './AboutUs.css';
import { Link } from "react-router-dom";
import Footer from './Footer/Footer';
import Aboutus from "../assets/Aboutus.png";
import fun from "../assets/3SUMAU.jpg";
import fun1 from "../assets/CASCKD8.jpg";


const AboutUs = () => {
  return (
    <>
      <div className="conternt">
      <div className="about-wrapper">
        <div className="about-text">
          <h1>About Us</h1>
          <p>
          Sikka Coin is a next-generation digital currency built on secure, transparent blockchain technology. Designed to empower users globally, Sikka enables fast, low-cost, and borderless transactions with real-world utility.
          </p>
          <p>
          Mission:👉
Empowering individuals with accessible, high-quality crypto education and
services, fostering financial literacy, and promoting innovation through our
comprehensive Sikka Coin Academy ecosystem.
          </p>
          <p>
Vision:👉
To become the leading crypto education platform, bridging the knowledge gap and 2. Mission And Vision
driving global adoption, while creating a sustainable, community-driven ecosystem that rewards learning, innovation, and contribution
          </p>
          <p>👉 [Get Started] | [Whitepaper] | [Join Community]</p>

          <div className="team-section">
            <h2>Our Team</h2>
            <div className="team-grid">
              <div className="team-member">
                <img src={fun} alt="Jane" />
                <h3>Jane Doe</h3>
                <p>CEO & Founder</p>
              </div>
              <div className="team-member">
                <img src={fun1} alt="John" />
                <h3>John Smith</h3>
                <p>Manager</p>
              </div>
             
            </div>
          </div>
        </div>

        <div className="about-image">
          <img
            src={Aboutus}
            alt="Company Logo"
            className="about-logo"
          />
        </div>
      </div>
      <Footer />
      </div>
    </>
  );
};

export default AboutUs;
