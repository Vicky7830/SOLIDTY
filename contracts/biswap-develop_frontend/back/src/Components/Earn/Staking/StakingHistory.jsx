import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './V.css';
import { Link } from 'react-router-dom';

import video from '../../../assets/video.mp4'; // Background video

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';


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
import {
  CheckCircle, XCircle,
   DollarSign, Calendar, ArrowDownCircle
} from 'lucide-react';
import logo from '../../../assets/coin1.png';

import { HiOutlineDocumentReport } from 'react-icons/hi';


import { MdHistory,MdDashboard } from "react-icons/md"; // import an additional icon


import TokenABI from '../../../BlockchainApi/ICCTokenABI.json';
import StakingABI from '../../../BlockchainApi/staking.json';
import { useNavigate } from 'react-router-dom';
const tokenAddress = "0xCCa556AecF1e8F368628c7543c382303887265eD";
const stakingContractAddress = "0x41e04448a16872ae400abfc055544933534946a8";




export default function StakingHistory() {


  
  const [stakingHistory, setStakingHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
    const [dropdownOpen, setDropdownOpen] = useState(false);
      const [coinDropdownOpen, setCoinDropdownOpen] = useState(false);
  
        const [open, setOpen] = useState(false);
  

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


   const handleLogout = () => {
    // Clear localStorage or any auth data
    localStorage.clear();

    // Redirect to login page
    navigate("/");
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = ethProvider.getSigner();
        const address = await signer.getAddress();
        console.log("Connected wallet:", address);
        setUserAddress(address);
        setProvider(ethProvider);
      } else {
        console.error("MetaMask not detected");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (userAddress && provider) {
      loadStakingHistory();
    }
  }, [userAddress, provider]);

  const loadStakingHistory = async () => {
    try {
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(stakingContractAddress, StakingABI, signer);
      const positionIds = await stakingContract.getPositionIds(userAddress);
      console.log("Fetched Position IDs:", positionIds);

      const stakeDetails = await Promise.all(
        positionIds.map(async (id) => {
          const stake = await stakingContract.getStakeByPositionId(id);
          return {
            id: id.toString(),
            address: stake.user,
            amount: ethers.utils.formatUnits(stake.amount, 18),
            apy: stake.apy + "%",
            dailyInterest: ethers.utils.formatUnits(stake.perDayInterest, 18),
            startDate: new Date(stake.startDate * 1000).toLocaleDateString(),
            endDate: new Date(stake.endDate * 1000).toLocaleDateString(),
            status: stake.status ? "Active" : "Inactive",
          };
        })
      );
      setStakingHistory(stakeDetails);
    } catch (err) {
      console.error("Error loading staking history:", err);
    }
  };

  const handleUnstake = async (positionId) => {
    try {
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(stakingContractAddress, StakingABI, signer);
      const tx = await stakingContract.claim(positionId);
      await tx.wait();
      alert("Unstake successful!");
      loadStakingHistory();
    } catch (err) {
      console.error("Unstake failed", err);

      let errorMessage = "Transaction failed";
      
      if (err.message.includes("Staking period not yet completed")) {
        errorMessage = "Staking period not yet completed";
      }
      alert(errorMessage);
    }
  };



  const handleEmergencyClaim = async (positionId) => {
  const confirm = window.confirm("⚠️ Are you sure you want to claimEmergency?\nNote: Only the staked amount will be returned.");
  if (!confirm) return;

  try {
    const signer = provider.getSigner();
    const stakingContract = new ethers.Contract(stakingContractAddress, StakingABI, signer);
    const tx = await stakingContract.claimEmergency(positionId);
    await tx.wait();
    alert("Emergency claim successful!");
    loadStakingHistory();
  } catch (err) {
    console.error("Emergency claim failed", err);
     let errorMessage = "Transaction failed";

     
    if (err.message.includes("Emergency claim allowed only after 20 days")) {
      errorMessage = "Emergency claim allowed only after 20 days";
    }

    alert(errorMessage);
  }
};


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = stakingHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(stakingHistory.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="staking-container">

     


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

      <div className="staking-history">
        
        <h3 className='bot'>📜 Staking History</h3>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>🆔 ID</th>
                <th>👤 Address</th>
                <th><DollarSign size={16} /> Amount</th>
                <th>% APY</th>
                <th>💰 Daily</th>
                <th><Calendar size={16} /> Start</th>
                <th><Calendar size={16} /> End</th>
                <th><ArrowDownCircle size={16} /> Unstake</th>
                  <th>🚨 Emergency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>No staking records found.</td>
                </tr>
              ) : (
                currentItems.map((stake) => (
                  <tr key={stake.id}>
                    <td>{stake.id}</td>
                    <td>{stake.address.slice(0, 6)}...{stake.address.slice(-4)}</td>
                    <td>{stake.amount}</td>
                    <td>{stake.apy}</td>
                    <td>{stake.dailyInterest}</td>
                    <td>{stake.startDate}</td>
                    <td>{stake.endDate}</td>
                    <td>
                      <button
                        className="unstake-btn"
                        disabled={stake.status === "Inactive"}
                        onClick={() => handleUnstake(stake.id)}
                      >
                        <ArrowDownCircle size={16} /> Unstake
                      </button>
                    </td>

                     <td>
                      <button
                        className="unstake-btn"
                        disabled={stake.status === "Inactive"}
                        onClick={() => handleEmergencyClaim(stake.id)}
                      >
                        🚨 Emergency
                      </button>
                    </td>
                    <td className={stake.status === "Active" ? "status-active" : "status-inactive"}>
                      {stake.status === "Active" ? (
                        <><CheckCircle color="green" size={18} /> Active</>
                      ) : (
                        <><XCircle color="red" size={18} /> Inactive</>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="menu-icon" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </div>
    </div>
  );
}
