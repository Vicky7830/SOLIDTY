import { useState, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Link } from "react-router-dom";
import METAMASK_ICON from "../../assets/metamask-removebg-preview.png";
import TRUST_WALLET_ICON from "../../assets/trust-wallet.svg";
import { ethers } from "ethers";
import ad from "./WalletPopUp.module.css";
import Loader from "../Loader";

const BSC_MAINNET = {
  chainId: "0x38", // 56 in hex
  chainName: "Binance Smart Chain Mainnet",
  nativeCurrency: {
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
};

const WalletPopUp = ({ popUpVisHandler, setConnectedAddress }) => {
  const [trxInitiated, setTrxInitiated] = useState(false);

  const connectWallet = async (walletType) => {
    setTrxInitiated(true);
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let { chainId } = await provider.getNetwork();

        // If not BSC, attempt to switch
        if (chainId !== parseInt(BSC_MAINNET.chainId, 16)) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: BSC_MAINNET.chainId }],
            });

            // Refresh provider
            const newProvider = new ethers.providers.Web3Provider(window.ethereum);
            const newSigner = newProvider.getSigner();
            const address = await newSigner.getAddress();
            setConnectedAddress(address);
          } catch (switchError) {
            // If BSC not added, try to add it
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [BSC_MAINNET],
                });

                const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                const newSigner = newProvider.getSigner();
                const address = await newSigner.getAddress();
                setConnectedAddress(address);
              } catch (addError) {
                console.error("Failed to add BSC network:", addError);
                alert("Failed to add BSC network. Please try manually.");
              }
            } else {
              console.error("Error switching network:", switchError);
              alert("Please switch to Binance Smart Chain (BSC) in your wallet.");
            }
          }
        } else {
          // Already on BSC
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setConnectedAddress(address);
        }
      } else {
        // Handle mobile or no wallet installed
        const mobileURL = {
          metamask: "https://metamask.app.link/dapp/https://sikkacoin.org",
          trust: "https://link.trustwallet.com/open_url?url=https://sikkacoin.org",
        };

        const desktopInstallURL = {
          metamask: "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
          trust: "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph",
        };

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

        if (isMobile) {
          window.open(mobileURL[walletType]);
        } else {
          window.open(desktopInstallURL[walletType], "_blank");
        }
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Wallet connection failed. Please try again.");
    }

    setTrxInitiated(false);
    popUpVisHandler();
  };

  return (
    <div className={ad.main}>
      <div className={ad.popUp}>
        {trxInitiated ? (
          <>
            <Loader />
            <p className={ad.popds}>Sending request to wallet ...</p>
          </>
        ) : (
          <>
            <div className={ad.popupHeader}>
              <h4 className="fw-bold">Connect a Wallet</h4>
              <h1 onClick={popUpVisHandler}>
                <RxCrossCircled size={20} />
              </h1>
            </div>

            <p className={ad.terms}>
              By connecting a wallet, you agree to <Link to="#">Terms of Use</Link>
            </p>

            <div className={ad.contentGh}>
              <div className={ad.pannelCrypto}>
                <button
                  className={`${ad.buttonWallet} mt-4`}
                  onClick={() => connectWallet("metamask")}
                >
                  <span className={ad.buttonWalleta}>
                    <img src={METAMASK_ICON} alt="metamask" className={ad.buttonWalletaimg} />
                  </span>
                  <span className={ad.buttonWalletb}>MetaMask</span>
                </button>

                <button
                  className={`${ad.buttonWallet} mt-3`}
                  onClick={() => connectWallet("trust")}
                >
                  <span className={ad.buttonWalleta}>
                    <img src={TRUST_WALLET_ICON} alt="trust" className={ad.buttonWalletaimg} />
                  </span>
                  <span className={ad.buttonWalletb}>Trust Wallet</span>
                </button>
              </div>

              <div className={ad.htr}>
                <hr className="hrline" />
              </div>

              <div className={`${ad.walletquie} mt-2`}>
                <h5 className={ad.textr1}>New to Ethereum wallets?</h5>
                <h5 className={ad.textr2}>Learn More</h5>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletPopUp;
