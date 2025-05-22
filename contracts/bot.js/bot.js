import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ArrowLeftRight } from 'lucide-react';
import usdtLogo from '../../assets/usdt.jpg';
import sikkaLogo from '../../assets/sikka.jpg';
import './SwapBox.css';

const USDT_ADDRESS = '0x55d398326f99059ff775485246999027b3197955';
const SIKKA_ADDRESS = '0xcca556aecf1e8f368628c7543c382303887265ed';
const ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const FEE_ADDRESS = '0xd83af568C4FBeb558D37998b3d18D20aCd20349f';

const ERC20_ABI = [
  'function approve(address spender, uint value) external returns (bool)',
  'function transfer(address recipient, uint amount) external returns (bool)',
  'function balanceOf(address owner) external view returns (uint)',
  'function allowance(address owner, address spender) external view returns (uint)',
  'function decimals() view returns (uint8)',
];

const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) external returns (uint[] memory amounts)',
];

const SwapUSDTToSikka = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState('1');
  const [isUSDTToSikka, setIsUSDTToSikka] = useState(true);
  const [balances, setBalances] = useState({ usdt: '0', sikka: '0' });

  const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask');
    const accounts = await provider.send('eth_requestAccounts', []);
    setWalletAddress(accounts[0]);
  };

  const fetchBalances = async () => {
    if (!walletAddress) return;
    const signer = provider.getSigner();
    const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);
    const sikka = new ethers.Contract(SIKKA_ADDRESS, ERC20_ABI, signer);

    const [usdtBal, usdtDecimals] = await Promise.all([usdt.balanceOf(walletAddress), usdt.decimals()]);
    const [sikkaBal, sikkaDecimals] = await Promise.all([sikka.balanceOf(walletAddress), sikka.decimals()]);

    setBalances({
      usdt: ethers.utils.formatUnits(usdtBal, usdtDecimals),
      sikka: ethers.utils.formatUnits(sikkaBal, sikkaDecimals),
    });
  };

  useEffect(() => {
    fetchBalances();
  }, [walletAddress, isUSDTToSikka]);

  const swapTokens = async () => {
    try {
      setStatus('Preparing swap...');
      const signer = provider.getSigner();

      const tokenIn = isUSDTToSikka ? USDT_ADDRESS : SIKKA_ADDRESS;
      const tokenOut = isUSDTToSikka ? SIKKA_ADDRESS : USDT_ADDRESS;

      const tokenContract = new ethers.Contract(tokenIn, ERC20_ABI, signer);
      const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);

      const decimals = await tokenContract.decimals();
      const amountIn = ethers.utils.parseUnits(amount, decimals);
      const feeAmount = ethers.utils.parseUnits('0.01', decimals); // $0.01 fee

      // 1. Send $0.01 USDT fee if direction is USDT → SIKKA
      if (isUSDTToSikka) {
        setStatus('Sending fee...');
        const feeTx = await tokenContract.transfer(FEE_ADDRESS, feeAmount);
        await feeTx.wait();
      }

      const path = [tokenIn, tokenOut];

      const amountsOut = await router.getAmountsOut(amountIn, path);
      const amountOutMin = amountsOut[1].sub(amountsOut[1].div(20)); // 5% slippage

      const allowance = await tokenContract.allowance(walletAddress, ROUTER_ADDRESS);
      if (allowance.lt(amountIn)) {
        setStatus('Approving token...');
        const approveTx = await tokenContract.approve(ROUTER_ADDRESS, amountIn);
        await approveTx.wait();
      }

      setStatus('Swapping...');
      const tx = await router.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        walletAddress,
        Math.floor(Date.now() / 1000) + 600
      );
      await tx.wait();

      setStatus(`✅ Swap successful! Tx: https://bscscan.com/tx/${tx.hash}`);
      fetchBalances();
    } catch (err) {
      console.error(err);
      setStatus('❌ Swap failed: ' + err.message);
    }
  };

  const toggleSwapDirection = () => {
    setIsUSDTToSikka(prev => !prev);
  };

  const tokenInLogo = isUSDTToSikka ? usdtLogo : sikkaLogo;
  const tokenOutLogo = isUSDTToSikka ? sikkaLogo : usdtLogo;

  return (
    <div className="swap-container">
      <div className="swap-card">
        <h2>Swap </h2>
        <button className="connect-btn" onClick={connectWallet}>
          {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
        </button>


        <div className="swap-inputs">
          
                      <div className="fee-note">
 <p>USDT: {balances.usdt}</p>
  </div>
          <div className="token-input">
            
            <img src={tokenInLogo} alt="Token In" />
            <span>{isUSDTToSikka ? 'USDT' : 'SIKKA'}</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.0"
              min="0"
            />
          </div>

          <button className="switch-btn" onClick={toggleSwapDirection}>
            <ArrowLeftRight />
                <div className="fee-note">
  <p>SIKKA: {balances.sikka}</p>
  </div>
          </button>
      
          <div className="token-input">
            <img src={tokenOutLogo} alt="Token Out" />
            <span>{isUSDTToSikka ? 'SIKKA' : 'USDT'}</span>
            <input type="text" disabled value="~" />
          </div>
        </div>

        <div className="fee-note">
          {isUSDTToSikka && <small>Note: $0.01 USDT will be sent as a swap fee.</small>}
        </div>

        <button className="swap-btn" onClick={swapTokens}>Swap</button>
        <p className="status-msg">{status}</p>
      </div>
    </div>
  );
};

export default SwapUSDTToSikka;
