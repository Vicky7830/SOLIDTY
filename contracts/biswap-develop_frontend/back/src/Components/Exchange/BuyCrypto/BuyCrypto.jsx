import { useState } from "react";
import Footer from '../../Footer/Footer';
import { Link } from "react-router-dom";

import './BuyCrypto.css'; // Import the CSS file
import { FaRegCopy } from 'react-icons/fa';
import tokenLogo from '../../../assets/coin1.png'; // Token logo

import video from '../../../assets/video.mp4'; // Background video


const BuyCrypto = () => {



      const contractAddress = "0xcca556aecf1e8f368628c7543c382303887265ed";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };


  const displayAddress = `${contractAddress.slice(0, 15)}...${contractAddress.slice(-10)}`;
    return (
        <>

      
      
 
     <div className="conternt">

           <div className="token-info">
      <h3>Sikka coin  Contract Info</h3>
      <p>Use the details below to add the Sikka coin  token to your wallet.</p>
      <div className="token-grid">
        <div className="token-item">
                  <img src={tokenLogo} alt="Token Logo" className="token-logo" />

          <span className="label">Address</span>
          <div className="address-row">
            <p className="value">{displayAddress}</p>
            <button className="copy-btn" onClick={handleCopy} title="Copy Address">
              <FaRegCopy size={16} />
            </button>
          </div>
          {copied && <span className="copy-msg">Copied!</span>}
        </div>
        <div className="token-item">
          <span className="label">Decimal</span>
          <p className="value">18</p>
        </div>
        <div className="token-item">
          <span className="label">Network</span>
          <p className="value">BNB Smart Chain</p>
        </div>
        <div className="token-item">
          <span className="label">Coin Symbol</span>
          <p className="value">Sikka Coin</p>
        </div>
      </div>
    </div>
  <div className="buycrypto-wrapper">
    <div className="cardd animated-card">
      <h2 className="section-heading">Sikka Swap</h2>
      <p className="sub-txt">
        Buy and sell Sikka Coin, and other digital assets securely using bank transfers. Experience fast, reliable trading and staking on a trusted exchange platform.
      </p>

      <div className="iframe-container">
        <iframe
          src="https://pancakeswap.finance/swap?inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0xCCa556AecF1e8F368628c7543c382303887265eD"
          title="Sikka Swap"
          width="100%"
          height="500"
          allowFullScreen
        ></iframe>
      </div>

    
    </div>
  </div>
</div>

            <Footer />
        
        </>
    );
};

export default BuyCrypto;
