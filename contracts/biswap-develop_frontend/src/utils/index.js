import { toast } from "react-toastify";
import Web3 from "web3";
let wallet = "";
let account = [];




//toaster
const toastAlert = (
  msg = "Error with toaster!",
  type,
  position = "top-right",
  autoClose = 5000,
  hideProgressBar = false,
  closeOnClick = true,
  pauseOnHover = false,
  draggable = true,
  progress = undefined,
  theme = "dark"
) => {
  toast[type](msg, {
    position,
    autoClose,
    hideProgressBar,
    closeOnClick,
    pauseOnHover,
    draggable,
    progress,
    theme,
  });
};




//check which account is connected
const checkWhichAccountIsConnected = async () => {
  try {
    // Check if already connected
    account = await window.ethereum.request({ method: "eth_accounts" });
    return account;
  } catch (error) {
    toastAlert("Error while checking accounts!", "error");
  }
};






//check if any account is connected
const checkIfAnyWalletIsConnected = async () => {
  checkWhichAccountIsConnected();
  if (account.length > 0) {
    disconnectWallet();
    toastAlert("Disconnect from other wallet!", "error");
    return;
  }
  if (checkIfMetaMaskExist()) {
    wallet = "metamask";
  } else if (checkIfBinanceWalletExist()) {
    wallet = "binance";
  } else if (checkIfCoinbaseWalletExist()) {
    wallet = "coinbase";
  } else if (checkIfTrustWalletExist()) {
    wallet = "trustwallet";
  } else if (checkIfWalletConnectExist()) {
    wallet = "walletconnect";
  }
};

// Check for MetaMask
const checkIfMetaMaskExist = () => {
  if (window.ethereum && window.ethereum.isMetaMask) {
    return true;
  } else {
    return false;
  }
};





// Check for Trust Wallet
const checkIfTrustWalletExist = () => {
  if (window.ethereum && window.ethereum.isTrust) {
    return true;
  } else {
    return false;
  }
};




// Check for Binance Chain Wallet
const checkIfBinanceWalletExist = () => {
  if (window.BinanceChain) {
    return true;
  } else {
    return false;
  }
};





// Check for Coinbase Wallet
const checkIfCoinbaseWalletExist = () => {
  if (window.coinbase) {
    return true;
  } else {
    return false;
  }
};




// Check for WalletConnect
const checkIfWalletConnectExist = () => {
  if (window.ethereum && window.ethereum.isWalletConnect) {
    return true;
  } else {
    return false;
  }
};





//check if selected wallet is exists
const checkWalletExistance = (selectedWallet) => {
  checkIfAnyWalletIsConnected();
  switch (selectedWallet) {
    case "metamask":
      if (checkIfMetaMaskExist()) {
        if (account.length < 1) {
          return connectToWallet(selectedWallet);
        }
      } else {
        redirectToWalletDownloadPage(selectedWallet);
      }
      break;
    case "trustwallet":
      if (checkIfTrustWalletExist()) {
        if (account.length < 1) {
          return connectToWallet(selectedWallet);
        }
      } else {
        redirectToWalletDownloadPage(selectedWallet);
      }
      break;
    case "binancechain":
      if (checkIfBinanceWalletExist()) {
        if (account.length < 1) {
          return connectToWallet(selectedWallet);
        }
      } else {
        redirectToWalletDownloadPage(selectedWallet);
      }
      break;
    case "coinbase":
      if (checkIfCoinbaseWalletExist()) {
        if (account.length < 1) {
          return connectToWallet(selectedWallet);
        }
      } else {
        redirectToWalletDownloadPage(selectedWallet);
      }
      break;
    case "walletconnect":
      if (checkIfWalletConnectExist()) {
        if (account.length < 1) {
          return connectToWallet(selectedWallet);
        }
      } else {
        redirectToWalletDownloadPage(selectedWallet);
      }
      break;
    default:
      break;
  }
};

//Redirect to specific wallet page
const redirectToWalletDownloadPage = (wallet) => {
  switch (wallet) {
    case "metamask":
      // Open MetaMask download page in another tab
      window.open("https://metamask.io/download.html", "_blank");
      break;
    case "trustwallet":
      // Open Trust Wallet download page in another tab
      window.open("https://trustwallet.com/download-page/", "_blank");
      break;
    case "binancechain":
      // Open Binance Chain download page in another tab
      window.open("https://www.binance.org/en/smartChain", "_blank");
      break;
    case "coinbase":
      // Open Coin Base download page in another tab
      window.open("https://www.coinbase.com/", "_blank");
      break;
    case "walletconnect":
      // Open Wallet Connect download page in another tab
      window.open("https://walletconnect.org/apps/", "_blank");
      break;

    default:
      break;
  }
};

//connect to wallet
const connectToWallet = async (wallet) => {
  // Specify other 
  const providerOptions = {
    chainId: "0x38", // Chain ID for BSC
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "bnb",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
  };
  try {
    switch (wallet) {
      case "metamask":
        // Check if MetaMask is installed
        if (window.ethereum) {
          // Prompt user to connect their MetaMask wallet
          await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [providerOptions],
          });

          // Get the connected account
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          const connectedAccount = accounts[0];

          // Now, the user is connected with MetaMask
          return connectedAccount;
        } else {
          // MetaMask not installed
          redirectToWalletDownloadPage(wallet);
        }
        break;

      case "trustwallet":
        // Check if Trust Wallet is installed
        if (window.ethereum && window.ethereum.isTrust) {
          // Prompt user to connect their Trust Wallet
          await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [providerOptions],
          });

          // Get the connected account
          const accountsTrust = await window.ethereum.request({
            method: "eth_accounts",
          });
          const connectedAccountTrust = accountsTrust[0];

          // Now, the user is connected with Trust Wallet
          return connectedAccountTrust;
        } else {
          // Trust Wallet not installed
          redirectToWalletDownloadPage(wallet);
        }
        break;

      case "binancechain":
        // Check if Binance Chain Wallet is installed
        if (window.BinanceChain) {
          // Prompt user to connect their Binance Chain Wallet
          const accountsBinance = await window.BinanceChain.request({
            method: "eth_requestAccounts",
            params: [providerOptions],
          });
          const connectedAccountBinance = accountsBinance[0];

          // Now, the user is connected with Binance Chain Wallet
          return connectedAccountBinance;
        } else {
          // Binance Chain Wallet not installed
          redirectToWalletDownloadPage(wallet);
        }
        break;

      case "coinbase":
        // Check if Coinbase Wallet is installed
        if (window.coinbase) {
          // Prompt user to connect their Coinbase Wallet
          await window.coinbase.request({
            method: "eth_requestAccounts",

            params: [providerOptions],
          });

          // Get the connected account
          const accountsCoinbase = await window.coinbase.request({
            method: "eth_accounts",
          });
          const connectedAccountCoinbase = accountsCoinbase[0];

          // Now, the user is connected with Coinbase Wallet
          return connectedAccountCoinbase;
        } else {
          // Coinbase Wallet not installed
          redirectToWalletDownloadPage(wallet);
        }
        break;

      case "walletconnect":
        // Check if WalletConnect is available
        if (window.ethereum && window.ethereum.isWalletConnect) {
          // Prompt user to connect their WalletConnect
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [providerOptions],
          });

          // Get the connected account
          const accountsWalletConnect = await window.ethereum.request({
            method: "eth_accounts",
          });
          const connectedAccountWalletConnect = accountsWalletConnect[0];

          // Now, the user is connected with WalletConnect
          return connectedAccountWalletConnect;
        } else {
          // WalletConnect not available
          redirectToWalletDownloadPage("walletconnect");
        }
        break;

      default:
        // Handle the default case or leave it empty
        toastAlert(`Unsupported wallet type: ${wallet}`, "error");
        break;
    }
  } catch (error) {
    toastAlert(`Error connecting to ${wallet}:`, "error");
  }
};

//disconnect from connected wallet
const disconnectWallet = async () => {
  try {
    // Check if a wallet is connected
    if (account.length < 1) {
      console.error("No wallet connected.");
      return;
    }

    // Clear accounts to disconnect
    // await window.ethereum.request({
    //   method: "eth_requestAccounts",
    //   params: [{ eth_accounts: {} }],
    // });
    console.log(Web3);
    // if (Web3 && Web3.currentProvider && Web3.currentProvider.disconnect) {
    //   // Disconnect the current wallet
    //   Web3.currentProvider.disconnect();
    //   console.log("Disconnected from the wallet.");
    // }

    // Reset connected wallet state
    console.log(`Disconnected from ${wallet}.`);
  } catch (error) {
    toastAlert("Error disconnecting:", "error");
  }
};

export {

  checkIfBinanceWalletExist,
  checkIfCoinbaseWalletExist,
  checkIfMetaMaskExist,
  checkIfTrustWalletExist,
  checkIfWalletConnectExist,
  checkWalletExistance,
  disconnectWallet,
  checkWhichAccountIsConnected,

};
