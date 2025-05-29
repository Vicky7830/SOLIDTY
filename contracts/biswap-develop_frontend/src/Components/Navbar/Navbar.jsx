import React, { useState, useEffect } from "react";
import as from "./Navbar.module.css";
import LOGO from "../../assets/coin1.png";
import { FaWallet } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate, Link } from "react-router-dom";
import WalletPopUp from "./WalletPopUp";
import { ethers } from "ethers";
import MbSiddebar from "./MobileSidebar";

const Navbar = () => {
  const [walletPopupVisible, setWalletPopupVisible] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState("Connect Wallet");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const navigate = useNavigate();

  const toggleWalletPopup = () => setWalletPopupVisible(!walletPopupVisible);
  const mobileSideVis = () => setMobileSidebar(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setConnectedAddress(accounts[0]);
        }
      }
    };
    checkConnection();
  }, []);

  const displayAddress = (addr) => {
    if (!addr || addr === "Connect Wallet") return "Connect Wallet";
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  return (
    <>
      {walletPopupVisible && (
        <WalletPopUp
          popUpVisHandler={toggleWalletPopup}
          setConnectedAddress={setConnectedAddress}
        />
      )}

      {mobileSidebar && <MbSiddebar mobileSideVis={mobileSideVis} />}

      <div className={`${as.NavbarCont} d-flex`}>
        {/* Left Section */}
        <div className={`${as.NavbarSlice1} d-flex`}>
          <div className={`${as.LogoContainer} d-flex align-items-center gap-2`}>
            <Link to="/">
              <img className={as.logo} src={LOGO} alt="logo" />
            </Link>
            <GiHamburgerMenu
              className={as.Hamburger}
              onClick={() => setMobileSidebar(!mobileSidebar)}
            />
          </div>





        
          
                <div className={`${as.navBuyBtnCont} d-flex align-items-center`}>
                <button
                  className={`${as.navBuyCont} text-white`}
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
              </div>
           
       
        

        


          <div className={`${as.navBuyBtnCont} d-flex align-items-center`}>
                <button
                  className={`${as.navBuyCont} text-white`}
                  onClick={() => navigate("/Staking")}
                >
                  Staking
                </button>
              </div>


          

          <div className={`${as.navBuyBtnCont} d-flex align-items-center`}>
            <a
              href="/white.pdf"
              download="WhitePaper.pdf"
              className={`${as.navBuyCont} text-white text-decoration-none`}
            >
              <button className="btn text-white">WhitePaper</button>
            </a>
          </div>

          <div className={`${as.navBuyBtnCont} d-flex align-items-center`}>
            <button
              className={`${as.navBuyCont} text-white`}
              onClick={() => navigate("/AboutUs")}
            >
              About Us
            </button>
          </div>

          <div className={`${as.navBuyBtnCont} d-flex align-items-center`}>
            <button
              className={`${as.navBuyCont} text-white`}
              onClick={() => navigate("/Exchange/BuyCrypto")}
            >
              BuyCrypto
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className={`${as.NavbarSlice2} d-flex align-items-center justify-content-end`}>
          <div className={as.LangCont}></div>

          <div
            className={`${as.Walletbtn} d-flex align-items-center gap-2`}
            onClick={toggleWalletPopup}
          >
            <FaWallet className={as.Walleti} />
            <span id={as.walletAddress}>{displayAddress(connectedAddress)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
