import React from "react";
import as from "./landing.module.css";
import Footer from "../Footer/Footer";
import Landing1Intro from "./Landing1Intro";
import Landing2 from "./Landing2List";
import Landing3Fetaures from "./Landing3Fetaures";

const Landing = () => {
  return (
    <>
      <div className={as.LandingCont}>
        <Landing1Intro></Landing1Intro>
        <Landing2></Landing2>
        <Landing3Fetaures></Landing3Fetaures>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Landing;
