import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './V.css';
import { Link } from 'react-router-dom';
import { MdHistory,MdDashboard } from "react-icons/md"; // import an additional icon
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/coin1.png';


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

import StakingABI from '../../../BlockchainApi/staking.json';
import { HiOutlineDocumentReport } from 'react-icons/hi';


const stakingContractAddress = "0x41e04448a16872ae400abfc055544933534946a8";

export default function LevelIncomeDetailsHistory() {
    const [levelIncomeData, setLevelIncomeData] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [provider, setProvider] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

      const [dropdownOpen, setDropdownOpen] = useState(false);
        const [coinDropdownOpen, setCoinDropdownOpen] = useState(false);
    
          const [open, setOpen] = useState(false);
    

      const navigate = useNavigate();
      
    
     
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
            loadLevelIncomeData();
        }
    }, [userAddress, provider]);

    const loadLevelIncomeData = async () => {
        try {
            const signer = provider.getSigner();
            const stakingContract = new ethers.Contract(stakingContractAddress, StakingABI, signer);
            const data = await stakingContract.getLevelIncomeDistribution(userAddress);

            const parsedData = data.map(item => ({
                receiverAddress: item.receiverAddress,
                stakeId: item.stakeId.toString(),
                stakeAmount: parseFloat(ethers.utils.formatUnits(item.stakeAmount, 18)).toFixed(4),
                incomeReceived: parseFloat(ethers.utils.formatUnits(item.incomeReceived, 18)).toFixed(4),
                uplineAddress: item.uplineAddress,
                timestamp: new Date(item.timestamp.toNumber() * 1000).toLocaleDateString(),
                level: item.level.toString(),
            }));

            setLevelIncomeData(parsedData);
        } catch (err) {
            console.error("Error loading level income data:", err);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = levelIncomeData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(levelIncomeData.length / itemsPerPage);

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
                <h3 className='bot'>📊 Level Income Distribution</h3>
                <div className="responsive-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Level</th>
                                <th>Stake ID</th>
                                <th>Stake Amount</th>
                                <th>Income Received</th>
                                <th>Receiver Address</th>
                                <th>Upline Address</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>No level income data available.</td>
                                </tr>
                            ) : (
                                currentItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.level}</td>
                                        <td>{item.stakeId}</td>
                                        <td>{item.stakeAmount}</td>
                                        <td>{item.incomeReceived}</td>
                                        <td>{item.receiverAddress.slice(0, 6)}...{item.receiverAddress.slice(-4)}</td>
                                        <td>{item.uplineAddress.slice(0, 6)}...{item.uplineAddress.slice(-4)}</td>
                                        <td>{item.timestamp}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

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
