import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './V.css';
import { Link } from 'react-router-dom';
import { MdHistory,MdDashboard } from "react-icons/md"; // import an additional icon
import logo from '../../../assets/coin1.png';

import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';



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
  DollarSign, Calendar
} from 'lucide-react';

import StakingABI from '../../../BlockchainApi/staking.json';
import { useNavigate } from 'react-router-dom';

const stakingContractAddress = "0x41e04448a16872ae400abfc055544933534946a8";

export default function DirectIncome() {
  const [referralData, setReferralData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

    const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
    const [coinDropdownOpen, setCoinDropdownOpen] = useState(false);

      const [open, setOpen] = useState(false);
    
  
   
   const handleLogout = () => {
      // Clear localStorage or any auth data
      localStorage.clear();
  
      // Redirect to login page
      navigate("/");
    };


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = ethProvider.getSigner();
        const address = await signer.getAddress();
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
      loadReferralIncomeDetails();
    }
  }, [userAddress, provider]);

  const loadReferralIncomeDetails = async () => {
    try {
      const signer = provider.getSigner();
      const stakingContract = new ethers.Contract(stakingContractAddress, StakingABI, signer);
      const [referralAddresses, incomes, timestamps] = await stakingContract.getReferralIncomeDetails(userAddress);

      const referralDetails = referralAddresses.map((address, index) => ({
        address,
        income: ethers.utils.formatUnits(incomes[index], 18),
        timestamp: new Date(timestamps[index].toNumber() * 1000).toLocaleDateString(),
      }));
      console.log("Fetched Referral Income Details:", referralDetails);

      setReferralData(referralDetails);
    } catch (err) {
      console.error("Error loading referral income details:", err);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = referralData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(referralData.length / itemsPerPage);

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
        <h3 className='bot'>📜 Referral Income Details</h3>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>👤 User Address</th>
                <th><DollarSign size={16} /> Income</th>
                <th><Calendar size={16} /> Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>No referral income records found.</td>
                </tr>
              ) : (
                currentItems.map((referral, index) => (
                  <tr key={index}>
                    <td>{referral.address.slice(0, 6)}...{referral.address.slice(-4)}</td>
                    <td>{referral.income}</td>
                    <td>{referral.timestamp}</td>
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
