import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Wallet, Copy, Check } from 'lucide-react'; // Lucide icon
import logo from '../../../assets/coin1.png'; // Logo imag
import { motion } from "framer-motion";


import { FaRegCopy } from "react-icons/fa"; // Copy icon
import { HiOutlineDocumentReport } from 'react-icons/hi';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faLink } from "@fortawesome/free-solid-svg-icons";
import video from '../../../assets/video.mp4'; // Background video

import './V.css'; // External CSS
import "./StakingCalculator.css";

import { Link } from 'react-router-dom';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import ProfilePopup from './ProfilePopup';


import {
  FaHome,
  FaExchangeAlt,
  FaPaperPlane,
  FaChartLine,
  FaFacebook,
  FaTwitter,
  FaTelegram,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaInstagram,
  FaShareAlt,


} from 'react-icons/fa'; // FontAwesome icons

import { FaSpinner, FaCheckCircle } from 'react-icons/fa';


import { MdHistory, MdDashboard, MdGroups } from "react-icons/md"; // import an additional icon


import TokenABI from '../../../BlockchainApi/ICCTokenABI.json'; // Replace with your token ABI
import StakingABI from '../../../BlockchainApi/staking.json'; // Replace with your staking contract ABI

import { FaPercentage, FaWallet, FaCoins, FaUserFriends, FaDollarSign } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const tokenAddress = "0xCCa556AecF1e8F368628c7543c382303887265eD"; // USDT or other token
const stakingContractAddress = "0x41e04448a16872ae400abfc055544933534946a8";

export default function Staking() {
  const [amount, setAmount] = useState('');
  // const [amount1, setAmount1] = useState('');

  const [directReferralIncome, setDirectReferralIncome] = useState(null);

  const [getLevelIncome, setGetLevelIncome] = useState(null);

  const [getUpline, setGetUpline] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [coinDropdownOpen, setCoinDropdownOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [balanceBNB, setBalanceBNB] = useState(null);





  const [days, setDays] = useState(365);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedDays1, setSelectedDays1] = useState(30);

  const [result, setResult] = useState(null);
  const [interest, setInterest] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false)
  const [bidSpinner, setBidSpinner] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState(""); // for explorer link






  const [loading1, setLoading1] = useState(false);
  const [copied, setCopied] = useState(false);


  const [referralCount, setReferralCount] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [totalTeam, setTotalTeam] = useState(null);
  const [Balance, setBalance] = useState(null);

  const [referralLink, setReferralLink] = useState("");

  const navigate = useNavigate();



  const handleLogout = () => {
    // Clear localStorage or any auth data
    localStorage.clear();

    // Redirect to login page
    navigate("/");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };




  const stakeTokens = async () => {
    setBidSpinner(1)
    try {
      if (!window.ethereum) {
        alert('Please connect a wallet');
        return;
      }

      if (!amount || parseFloat(amount) < 10) {
        alert('Minimum stake is 10 tokens');
        return;
      }



      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const stakingContract = new ethers.Contract(stakingContractAddress, StakingABI, signer);
      const tokenContract = new ethers.Contract(tokenAddress, TokenABI, signer);

      const stakeAmount = ethers.utils.parseUnits(amount, 18);

      setLoading(true);

      // 1. Approve
      const approveTx = await tokenContract.approve(stakingContractAddress, stakeAmount);
      await approveTx.wait();

      // 2. Stake
      const stakeTx = await stakingContract.stake(parseInt(days), stakeAmount);
      await stakeTx.wait();

      // Show popup  
      setAmount('');
      setDays('365');
      setBidSpinner(0)
      setShowPopup(true);
      setTxHash(stakeTx.hash);
      setShowPopup(false);
      setShowSuccessModal(true); // Show modal


    } catch (err) {
      console.error("Error during stake:", err);
      alert("Stake failed: " + (err?.reason || err?.message || "Unknown error"));
    } finally {
      setLoading(false);
      setBidSpinner(0)
    }
  };



  const handleUnstake = (id) => {
    alert(`Unstake requested for Position ID: ${id}`);
  };



  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);



  useEffect(() => {

    const autoCalculatee = async () => {
      if (!window.ethereum);
      try {

        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
        setUserAddress(account);

        setReferralLink(`https://sikkacoin.org/register?sponsor=${account}`);



        // Check if the user is connected to the correct network


        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(stakingContractAddress, StakingABI, provider);
        const tokenContract = new ethers.Contract(tokenAddress, TokenABI, provider);
        const balanceBN = await tokenContract.balanceOf(account);
        const balance = ethers.utils.formatUnits(balanceBN, 18);

        setBalance(balance);
        //getUpline
        const upline = await contract.getUpline(account);
        setGetUpline(upline);

           // BNB Balance
        const bnbBalance = await provider.getBalance(account);
const formattedBNBBalance = parseFloat(ethers.utils.formatEther(bnbBalance)).toFixed(5);
        setBalanceBNB(formattedBNBBalance);





        // Fetch direct referral count and total income

        const getLevelIncome = await contract.getLevelIncome(account);
        const LIncome = ethers.utils.formatUnits(getLevelIncome, 18);
        setGetLevelIncome(LIncome)


        const referralCountBN = await contract.getDirectReferralCount(account);
        const totalIncomeBN = await contract.getTotalIncome(account);
        const referralIncomeBN = await contract.getDirectReferralIncome(account);
        const referralIncome = ethers.utils.formatUnits(referralIncomeBN, 18);
        const getTotalUsers = await contract.getTotalUsers();
        const totalUsers = ethers.utils.formatUnits(getTotalUsers, 0);
        setTotalTeam(totalUsers);
        setDirectReferralIncome(referralIncome);

        setReferralCount(referralCountBN.toString());
        setTotalIncome(ethers.utils.formatUnits(totalIncomeBN, 18));


      } catch (error) {
        console.error(error);
        alert("Error calculating reward.");
      }
    }
    autoCalculatee();

  },);



  useEffect(() => {
    const autoCalculate = async () => {
      if (!window.ethereum || !amount || Number(amount) <= 0) return;

      setLoading1(true);
      try {
        const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
        setUserAddress(account);
     





        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(stakingContractAddress, StakingABI, provider);
        const parsedAmount = ethers.utils.parseUnits(amount.toString(), 18);
        const [interestBN, totalReturnBN] = await contract.getEstimatedReturn(
          parsedAmount,
          selectedDays1
        );

        const interestVal = parseFloat(ethers.utils.formatUnits(interestBN, 18));
        const totalReturnVal = parseFloat(ethers.utils.formatUnits(totalReturnBN, 18));


        setInterest(interestVal.toFixed(4));
        setResult(totalReturnVal.toFixed(4));
      } catch (error) {
        console.error(error);
        alert("Error calculating reward.");
      } finally {
        setLoading1(false);
      }
    };

    autoCalculate();
  }, [amount, selectedDays1]);




  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("✅ Referral link copied to clipboard!");
    } catch (err) {
      console.error("❌ Failed to copy:", err);
    }
  };


  return (
    <div className="staking-container">
      <video autoPlay loop muted playsInline className="background-video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={`staking-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <nav className="nav-links">
          {/* Close icon inside sidebar */}
          <div className="close-icon" onClick={toggleSidebar}>
            <FaTimes />
          </div>




          <div className="logo-container">
            <img src={logo} alt="Sikka Logo" className="animated-logo" />
            <span className="logo-text">Sikka Coin</span>
          </div>


          <Link to="/" className="dropdown-button"><FaHome /> Home</Link>
          <Link to="/Staking" className="dropdown-button"><MdDashboard /> Dashboard</Link>

          <Link to="/Exchange/BuyCrypto" className="dropdown-button"><FaExchangeAlt />Buy & Sell </Link>
          <div className="dropdown-container">
            <div className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <HiOutlineDocumentReport />
              Income Report {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {dropdownOpen && (
              <div className="dropdown-list">
                <Link to="/StakingHistory" className="dropdown-button">
                  <MdHistory /> MY Staking History
                </Link>
                <Link to="/DirectIncome" className="dropdown-button">
                  <MdHistory /> Direct Team
                </Link>
                <Link to="/LevelIncomeDetailsHistory" className="dropdown-button">
                  <MdHistory /> Total Team
                </Link>
              </div>
            )}
          </div>



          {/* Coin Detail Dropdown */}
          <div className="dropdown-container">
            <div
              className="dropdown-button"
              onClick={() => setCoinDropdownOpen(!coinDropdownOpen)}
            >
              <FaChartLine />
              Coin Detail
              {coinDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {coinDropdownOpen && (
              <div className="dropdown-list">
                <div className="dropdown-button"><FaPaperPlane /> Whitepaper</div>
                <div className="dropdown-button"><FaChartLine /> Gecko Terminal</div>
              </div>
            )}
          </div>
          <div className="dropdown-container">
            <div className="dropdown-button" onClick={() => setOpen(!open)}>
              <FaShareAlt />
              Social Links
              {open ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {open && (
              <div className="dropdown-list">
                <a href="https://t.me/SikkaWorld" target="_blank" rel="noopener noreferrer" className="dropdown-button">
                  <FaTelegram /> Telegram
                </a>
                <a href="https://facebook.com/SikkaWorld" target="_blank" rel="noopener noreferrer" className="dropdown-button">
                  <FaFacebook /> Facebook
                </a>
                <a href="https://twitter.com/SikkaWorld" target="_blank" rel="noopener noreferrer" className="dropdown-button">
                  <FaTwitter /> Twitter
                </a>
                <a href="https://instagram.com/SikkaWorld" target="_blank" rel="noopener noreferrer" className="dropdown-button">
                  <FaInstagram /> Instagram
                </a>
              </div>
            )}
          </div>
          <div className="dropdown-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </div>
        </nav>

      </div>

      <div className={`staking-main ${sidebarOpen ? 'open-sidebar' : ''}`}>
        <div className="staking-header">

                      <img src={logo} alt="Sikka Logo" className="images" />




          {/* logo */}
          
     

       {/* <div style={{ padding: '40px', textAlign: 'center' }}> */}
<ProfilePopup
  memberId={
    userAddress
      ? `${userAddress.slice(0, 5)}...${userAddress.slice(-5)}`
      : 'Loading...'
  }
  sponsorId={
    getUpline
      ? `${getUpline.slice(0, 5)}...${getUpline.slice(-5)}`
      : 'Loading...'
  }
  balance={Balance}
  bnbBalance={balanceBNB}
/>

    {/* </div> */}
    
        </div>
      

        {/* Income & Referral Information */}
        <div className="income-cards">
          <div className="card" >

            <h4>
              <FaDollarSign style={{ marginRight: "8px" }} />
              Referral Income</h4>

            <p>{directReferralIncome ?? "--"}</p>
          </div>
          <div className="card">
            <h4>
              <FaUserFriends style={{ marginRight: "8px" }} />
              Total Referrals
            </h4>
            <p>{referralCount ?? "--"}</p>
          </div>

          <div className="card">
            <h4>
              <FaDollarSign style={{ marginRight: "8px" }} />
              Level Income
            </h4>
            <p>{getLevelIncome ?? "--"}</p>


          </div>
          <div className="card">
            <h4>
              <MdGroups style={{ marginRight: "5px" }} />
              Total Income</h4>
            <p>{totalIncome ?? "--"}</p>
          </div>
        </div>

        <div className="staking-grid">
          <div className="stake-form">
            <h3>Stake</h3>
            <label>Amount to Stake:</label>
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <label>Days to Stake:</label>
            <select
              value={days}
              placeholder="Select Duration"
              onChange={(e) => setDays(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            >
              <option value="30">1 Month</option>
              <option value="60">2 Months</option>
              <option value="90">3 Months</option>
              <option value="120">4 Months</option>

              <option value="180">6 Months</option>
              <option value="365">1 Year</option>
            </select>

            <button onClick={stakeTokens} > Stake Now
            </button>
            {bidSpinner === 1 && (
              <div className="overlay">
                <FaSpinner className="spinner-icon" />
                <p>Processing your Payment...</p>
              </div>
            )}



          </div>
          {showSuccessModal && (
            <div className="modal-overlay">
              <div className="modal-box">
                <span className="modal-close" onClick={() => setShowSuccessModal(false)}>×</span>

                <div className="checkmark-circle">
                  <svg viewBox="0 0 52 52">
                    <path d="M14 27 l10 10 l15 -15" />
                  </svg>
                </div>

                <h2>Payment Stake Successfully</h2>
                <p>Your Stake has been submitted. You're all set!</p>

                <a
                  href={`https://testnet.bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bid-btn">View in Explorer</button>
                </a>
              </div>
            </div>
          )}
          <div className="bonus-info">

            <div className="input-group">
              <label>Estimated Return</label>
              <input
                type="number"
                value={amount}
                placeholder="Enter Amount"
                onChange={(e) => setAmount(e.target.value)}

                className="styled-input"
              />
            </div>

            <div className="duration-selector">
              {[
                { label: "1 Month", value: 30 },
                { label: "2 Months", value: 60 },
                { label: "3 Months", value: 90 },
                { label: "4 Months", value: 120 },

                { label: "6 Months", value: 180 },
                { label: "1 Year", value: 365 },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedDays1(value)}
                  className={`duration-btn ${selectedDays1 === value ? "active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {loading1 && <p className="text-center">Calculating...</p>}

            {result && (
              <div className="results">
                <div className="result-item">
                  Next Reward Yield: <span>~{(interest / amount * 100).toFixed(4)}% || APY</span>
                </div>
                <div className="result-item">
                  Balance: <span>--</span>
                </div>
                <div className="result-item">
                  Total Return: <span>{result}</span>
                </div>
                <div className="result-item">
                  Interest Earned: <span>{interest}</span>
                </div>
              </div>
            )}




          </div>
        </div>




        <div className="claim-section">
          <FontAwesomeIcon icon={faLink} className="me-2" />
          <input type="text" value={referralLink} placeholder="Invite Link" readOnly />
          <button onClick={copyToClipboard}>
            <FontAwesomeIcon icon={faCopy} className="me-2" />
            Invite Friend Link</button>
        </div>


      </div>

      {/* Toggle Icon Button */}
      <div className="menu-icon" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </div>
    </div>
  );
}
