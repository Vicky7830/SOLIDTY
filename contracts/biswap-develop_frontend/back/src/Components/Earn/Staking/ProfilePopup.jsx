import React, { useState, useEffect } from 'react';
import './ProfilePopup.css';
import logo from '../../../assets/coin1.png';
import { FaIdBadge, FaUserFriends, FaWallet, FaTimes } from 'react-icons/fa';

// Generate or reuse avatar ID (cached per session)
const getRandomAvatar = () => {
  const storedId = localStorage.getItem('avatarId');
  const randomId = storedId || Math.floor(Math.random() * 1000).toString();
  if (!storedId) localStorage.setItem('avatarId', randomId);
  return `https://api.multiavatar.com/${randomId}.svg`;
};

// Fallback avatar image
const fallbackAvatar = {logo};

const ProfilePopup = ({ memberId, sponsorId, balance, bnbBalance }) => {
  const [avatar, setAvatar] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setAvatar(getRandomAvatar());
  }, []);

  const handleImgError = (e) => {
    e.target.src = fallbackAvatar;
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button className="profiles" onClick={() => setIsOpen(true)}>
        <FaWallet /> Wallet
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="profiles-card animate-popup">
            <button className="close-btns" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
            <img
              src={logo}
              alt="AI Avatar"
              className="avatar"
              onError={handleImgError}
            />
            <div className="info">
              <div className="info-item">
                <FaIdBadge className="icon" />
                <span>Member ID: {memberId}</span>
              </div>
              <div className="info-item">
                <FaUserFriends className="icon" />
                <span>Sponsor ID: {sponsorId}</span>
              </div>
              <div className="info-item">
                <FaWallet className="icon" />
                <span>Balance: ${balance}</span>
              </div>
              <div className="info-item">
                <FaWallet className="icon" />
                <span>Balance BNB: {bnbBalance}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePopup;
