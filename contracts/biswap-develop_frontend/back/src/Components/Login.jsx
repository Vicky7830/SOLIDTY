import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link, useLocation } from "react-router-dom";
import "./Login.css";
import Logo from "../assets/coin1.png";
import video from "../assets/video.mp4";
import successLogo from "../assets/coin1.png"; // Add this image to your assets
import welcomeLogo from "../assets/coin1.png"; // Add this image to your assets

import CONTRACT_ABI from "../BlockchainApi/Staking.json";

const CONTRACT_ADDRESS = "0x41e04448a16872ae400abfc055544933534946a8";

const Register = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [referrer, setReferrer] = useState("0x4fbE77Dc92Ae215593c88063d49409a55b4f1318");
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", image: "" });

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sponsorParam = params.get("sponsor");
    if (sponsorParam) {
      setReferrer(sponsorParam);
    }
  }, [location.search]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("User rejected wallet connection:", err);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  const checkIfRegistered = async (address) => {
    try {
      const contract = getContract();
      return await contract.isRegistered(address);
    } catch (err) {
      console.error("Error calling isRegistered:", err);
      return false;
    }
  };

  const showModal = (title, image) => {
    setPopupContent({ title, image });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Auto close after 3 seconds
  };

  const registerUser = async () => {
    if (!walletAddress || !referrer) {
      alert("Please connect wallet and enter sponsor ID.");
      return;
    }

    if (referrer.toLowerCase() === walletAddress.toLowerCase()) {
      alert("❌ You cannot refer yourself.");
      return;
    }

    setLoading(true);
    try {
      const contract = getContract();

      const isUserRegistered = await contract.isRegistered(walletAddress);
      if (isUserRegistered) {
        alert("❌ Already registered.");
        return;
      }

      const isReferrerRegistered = await contract.isRegistered(referrer);
      if (!isReferrerRegistered) {
        alert("❌ Referrer is not registered.");
        return;
      }

      const tx = await contract.register(referrer);
      await tx.wait();

      showModal("🎉 Congratulations! Registration Successful!", successLogo);
      setActiveTab("login");
    } catch (err) {
      console.error("Registration error:", err);
      let errorMessage = "Transaction failed";

      if (err.message.includes("Referrer must stake before you can register")) {
        errorMessage = "Referrer must stake before you can register.";
      } else if (err.message.includes("Already registered")) {
        errorMessage = "You are already registered.";
      } else if (err.message.includes("Referrer not registered")) {
        errorMessage = "Referrer must be registered.";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    setLoading(true);
    try {
      if (!walletAddress) {
        alert("Please connect your wallet first.");
        return;
      }

      const isUserRegistered = await checkIfRegistered(walletAddress);
      if (isUserRegistered) {
        setLoginMessage("✅ Login Successful!");
        showModal("👋 Welcome Back!", welcomeLogo);
        setTimeout(() => {
          window.location.href = "/Staking";
        }, 3000);
      } else {
        setLoginMessage("❌ Wallet not registered. Please register first.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginMessage("Login error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) =>
    address.slice(0, 6) + "..." + address.slice(-4);

  return (
    <div className="app-background">
      <video className="bg-video" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>

      <div className="glass-card text-center">
        <Link to="/">
          <img src={Logo} alt="Logo" className="logo mb-4" />
        </Link>

        <div className="d-flex justify-content-center mb-4">
          <button
            className={`btn ${
              activeTab === "login" ? "btn-light" : "btn-outline-light"
            } mx-2`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`btn ${
              activeTab === "register" ? "btn-light" : "btn-outline-light"
            } mx-2`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {activeTab === "register" ? (
          <>
            <div className="form-group mb-3 text-start">
              <label>Sponsor ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="optional"
                value={referrer}
                onChange={(e) => setReferrer(e.target.value)}
              />
            </div>

            {!walletAddress ? (
              <button className="bid-btn" onClick={connectWallet}>
                Connect Wallet
              </button>
            ) : (
              <>
                <div className="small text-light text-break mb-3">
                  Connected: {formatAddress(walletAddress)}
                </div>
                <button className="bid-btn" onClick={registerUser}>
                  Register
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {!walletAddress ? (
              <button className="bid-btn" onClick={connectWallet}>
                Connect Wallet
              </button>
            ) : (
              <>
                <div className="small text-light text-break mb-3">
                  Connected: {formatAddress(walletAddress)}
                </div>
                <button className="bid-btn" onClick={loginUser}>
                  Login
                </button>
                {loginMessage && (
                  <div className="mt-3 text-white">{loginMessage}</div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-light" role="status"></div>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <img src={popupContent.image} alt="Popup" className="popup-img" />
            <h4>{popupContent.title}</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
