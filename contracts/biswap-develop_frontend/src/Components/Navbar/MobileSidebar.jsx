import React from "react";
import as from "./MbSide.module.css";
import { RiExchangeFundsLine } from "react-icons/ri";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaTractor, FaEthereum } from "react-icons/fa";
import { PiCurrencyCircleDollarFill } from "react-icons/pi";
import { TbUserDollar } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from 'react-icons/ai'; // Import the home icon


const MbSiddebar = (props) => {
  const navigate = useNavigate();

  return (
    <div className={as.navList}>
      <ul
        className={`${as.navListul} d-flex align-items-start flex-column gap-3`}
      >
        {/* HOME */}
        <li id={as.trade}>
          <span className={as.navName}></span>
          <span className={`${as.NavSublist} NavList`}>
            <ul id={as.tradeDropdown}>

              <li
                className="d-flex"
                onClick={() => {
                  props.mobileSideVis();
                  navigate("/");
                }}
              >
                <div className={as.li1}>
                  <span>
                    <AiFillHome className={as.exchange_icon} />
                  </span>
                </div>
                <div className={`${as.li2} d-flex flex-column`}>
                  <div className={as.li2a}>Home</div>
                  <div className={as.li2b}>Click On Home Page</div>
                </div>
              </li>
              <li
                className="d-flex"
                onClick={() => {
                  props.mobileSideVis();
                  navigate("/Register");
                }}
              >
                <div className={as.li1}>
                  <span>
                    <RiExchangeFundsLine className={as.exchange_icon} />
                  </span>
                </div>
                <div className={`${as.li2} d-flex flex-column`}>
                  <div className={as.li2a}>Register</div>
                  <div className={as.li2b}>Join our staking platform</div>
                </div>
              </li>
            </ul>
          </span>
        </li>




        {/* STAKE */}
        <li id={as.trade}>
          <span className={as.navName}>Stake</span>
          <span className={`${as.NavSublist} NavList`}>
            <ul id={as.tradeDropdown}>
              <li
                className="d-flex"
                onClick={() => {
                  props.mobileSideVis();
                  navigate("/Earn/Farm");
                }}
              >
                <div className={as.li1}>
                  <span>
                    <FaTractor className={as.exchange_icon} />
                  </span>
                </div>
                <div className={`${as.li2} d-flex flex-column`}>
                  <div className={as.li2a}>Live Price</div>
                  <div className={as.li2b}>Earn double rewards</div>
                </div>
              </li>

              <li
                className="d-flex"
                onClick={() => {
                  props.mobileSideVis();
                  navigate("/Staking");
                }}
              >
                <div className={as.li1}>
                  <span>
                    <FaEthereum className={as.exchange_icon} />
                  </span>
                </div>
                <div className={`${as.li2} d-flex flex-column`}>
                  <div className={as.li2a}>Sikka Staking</div>
                  <div className={as.li2b}>Earn high returns, Easy Stake</div>
                </div>
              </li>
            </ul>
          </span>
        </li>

        {/* MORE */}
        <li id={as.trade}>
          <span className={as.navName}></span>
          <span className={`${as.NavSublist} NavList`}>
            <ul id={as.tradeDropdown}>
              <li className="d-flex">
                <div className={as.li1}>
                  <span>
                    <PiCurrencyCircleDollarFill className={as.exchange_icon} />
                  </span>
                </div>
                <div className={`${as.li2} d-flex flex-column`}>

                  {/* Whitepaper Download Button */}
                  <a
                    href="/white.pdf"
                    download="WhitePaper.pdf"
                    className={as.li2a1} style={{ color: "white" }}
                  >
                    WhitePaper
                  </a>

                  <div className={as.li2b1}>
                    WhitePaper Sikka Digital Assets
                  </div>
                </div>
              </li>



              <li
                className="d-flex"
                onClick={() => {
                  props.mobileSideVis();
                  navigate("/Exchange/BuyCrypto");
                }}
              >
                <div className={as.li1}>
                  <span>
                    <TbUserDollar className={as.exchange_icon} />
                  </span>
                </div>
                <div className={`${as.li2} d-flex flex-column`}>
                  <div className={as.li2a}>BuyCrypto</div>
                  <div className={as.li2b}>Project Documentation</div>
                </div>
              </li>

              <li
                className="d-flex"
                onClick={() => {
                  props.mobileSideVis();
                  navigate("/AboutUs");
                }}
              >
                <div className={as.li1}>
                  <span>
                    <AiFillDollarCircle className={as.exchange_icon} />
                  </span>
                </div>
                <div className={`${as.li2} d-flex flex-column`}>
                  <div className={as.li2a}>About Us</div>
                  <div className={as.li2b}>Know more about us</div>
                </div>
              </li>
            </ul>
          </span>
        </li>
      </ul>
    </div>
  );
};

export default MbSiddebar;
