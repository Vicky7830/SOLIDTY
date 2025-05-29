import React from "react";
import as from "./Landing1.module.css";
import gif from "../../assets/3dgifmaker13490.gif";
import { useNavigate } from "react-router-dom";

// import gif from "../../assets/icc.gif"

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className={as.IntroContainer}>
      {/* 1 sub contaier*/}
      <div
        className={`${as.Intro_SubContainer1} d-flex align-items-center justify-content-end flex-column `}
      >
        <h2 className="text-uppercase letter-spacing-2 d-flex justify-content-center ">
          Sikka coin{" "}
          <span className="fw-bolder d-flex align-items-center">
            {" "}
            <hr></hr>
          </span>
        </h2>
        <h5 className=" mt-0 pt-0">
        Sikka Coin is a next-generation digital currency built on secure, transparent blockchain technology.  </h5>

        {/* heres buttons  */}
        <div className={`${as.Intro_SubContainer1_btn_container}  `}>
          <button
            className={as.Intro_SubContainer1_btn} onClick={() => { navigate("/Register") }} >    Register     
          
            
          </button>
          <button className={as.Intro_SubContainer1_btn} onClick={() => { navigate("/login") }}>Login</button>
        </div>

        {/* features  */}
        <div className={`${as.Intro_SubContainer1_btn_container}  `}>
          {/* 1 */}
          <div className={`${as.feautute1}  `}>
            <div className={`${as.feature1_a}  `}>
              {/* <img      ></img> */}
            </div>

            <div className={`${as.feature1_b}  `}></div>
          </div>

          {/* 2 */}
        </div>
      </div>

      {/* 2sub contauiner */}
      <div className={as.Intro_SubContainer2}>
        <img src={gif} alt="icon" loading="lazy"></img>
      </div>
    </div>
  );
};

export default Intro;
