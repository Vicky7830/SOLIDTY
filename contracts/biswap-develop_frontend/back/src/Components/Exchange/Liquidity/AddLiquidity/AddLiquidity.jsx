import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import as from "./AddLiquidity.module.css";
// import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoSettings } from "react-icons/io5";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CgArrowsExchangeV } from "react-icons/cg";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaGift } from "react-icons/fa";
import TokenList from "../../TokenList/TokenList";
import Setting from "../../Setting/Setting";
import axios from "axios";

const AddLiquidity = () => {
  const navigate = useNavigate();

  // state
  const [tokenListVis, setTokenListVis] = useState(false);
  const [settingVis, setSettingVis] = useState(false);

  const [selectedTokenFirst, setSelectedTokenFirst] = useState(null);
  const [selectedTokenSecond, setSelectedTokenSecond] = useState(null);

  // token visibility toggler
  const TokenListVisHandler = () => {
    setTokenListVis(!tokenListVis);
  };

  // Setting visibility toggler

  const SettingVisHandler = () => {
    setSettingVis(!settingVis);
  };

  // Fetch connected accounts and their balances
  const fetchAccounts = async () => {
    if (window.ethereum) {
      try {
        // Request accounts from the wallet
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        // Update the state with the accounts
        // setAccounts(accounts);

        // Set the selected account to the first account (you can customize this logic)
        // setSelectedAccount(accounts[0]);

        // Fetch the token address associated with the selected account
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const [account] = await provider.listAccounts();

        const balance = await provider.getBalance(accounts[0]);
        const code = await provider.getCode(accounts[0]);
        getTokenList(accounts[0]);

        // If the account has code (i.e., a contract), consider it as a token address
        if (balance.eq(ethers.BigNumber.from(0)) && !code.includes("0x")) {
          console.log(accounts, "@@@@@@@");
        } else {
          console.log("No token address found for the selected account.");
        }
      } catch (error) {
        console.error("Error fetching accounts:", error.message);
      }
    }
  };

  async function getTokenList(walletAddress) {
    const apiKey = "PCP1YNRM6FXYJ698WX4CGWW3JRCFJJ3H9P";

    //   https://api.etherscan.io/api
    //  ?module=account
    //  &action=balance
    //  &address=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae
    //  &tag=latest
    //  &apikey=YourApiKeyToken

    const apiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${apiKey}`;
    try {
      const response = await axios.get(apiUrl);
      const tokenList = response.data.result;
      console.log(tokenList, "!!!!!");

      // tokenList.forEach((token) => {
      //   console.log(
      //     `Token Name: ${token.name}, Symbol: ${token.symbol}, Address: ${token.contractAddress}`
      //   );
      // });
    } catch (error) {
      console.error("Error fetching token list:", error.message);
    }
  }

  useEffect(() => {
    //fee apr box selection
    //  classs toggler
    const Navlinks = document.querySelectorAll(".feeTierPlan_addLiquidity");
    console.log(Navlinks);

    Navlinks.forEach((navLink) => {
      navLink.addEventListener("click", () => {
        // navLink.classList.toggle("active")
        document
          .querySelector(".feeTierPlanClicked_addLiquidity")
          ?.classList.remove("feeTierPlanClicked_addLiquidity");
        navLink.classList.add("feeTierPlanClicked_addLiquidity");
      });
    });
    fetchAccounts();
  }, []);

  return (
    <>
      {/* {setting container } */}

      {settingVis ? (
        <Setting SettingVisHandler={SettingVisHandler}></Setting>
      ) : null}

      {/* TokenList Componenet  */}
      {tokenListVis ? (
        <TokenList
          TokenListVisHandler={TokenListVisHandler}
          setSelectedTokenFirst={setSelectedTokenFirst}
          setSelectedTokenSecond={setSelectedTokenSecond}
          selectedTokenFirst={selectedTokenFirst}
        ></TokenList>
      ) : null}

      {/* add liquidity container  */}
      <div className={`${as.AddLiquidityCont}`}>
        {/* AddLiquidityHead */}
        <div
          className={`${as.AddLiquidityHead} d-flex align-items-center justify-content-between`}
        >
          <HiArrowNarrowLeft onClick={() => navigate("/Exchange/Liquidity")} />
          <span className="fw-bold">Add Liquidity</span>
          <span>
            <IoSettings onClick={() => setSettingVis(!settingVis)}></IoSettings>
          </span>
        </div>

        {/* pair& amount  */}
        <div
          className={`${as.pairAmount} mt-2 d-flex justify-content-between align-items-center`}
        >
          <span>Pair & Amount</span>
          <span className="mt-1">Clear All</span>
        </div>

        {/* coin $ balance Cont  1*/}
        <div className={`${as.coinSwapFromlCont}  d-flex flex-column`}>
          <div
            className={`${as.coinBalanceCont} mt-3 justify-content-between d-flex`}
          >
            {/* part 1 of 2 */}
            <div className={`${as.coinBalanceA} d-flex`}>
              <span>
                {/* <img
                  src={
                    selectedTokenFirst?.logo
                      ? selectedTokenFirst?.logo
                      : require("../../../../assets/icon.png")
                  }
                ></img> */}
              </span>
              <span className="d-flex align-items-center justify-content-center  pb-1">
                {selectedTokenFirst?.symbol
                  ? selectedTokenFirst?.symbol
                  : "BITS"}
              </span>
              <span onClick={() => setTokenListVis(!tokenListVis)}>
                {" "}
                <IoIosArrowDown></IoIosArrowDown>
              </span>
            </div>

            {/* part 2 of 2 */}
            <div
              className={`${as.coinBalanceB} d-flex align-items-center justify-content-end`}
            >
              <span className="me-1">Balance : 0.01265</span>
              <button>Max</button>
            </div>
          </div>

          {/* coin  swap from input */}
          <input className={`${as.liqSwapFromInput} mt-2`}></input>
        </div>

        {/* <reverse    */}
        <div className={`${as.exchangeSymboldCont}`}>
          <CgArrowsExchangeV className="cursor-pointer" />
        </div>

        {/* coin $ balance Cont 2 */}
        <div className={`${as.coinSwapFromlCont}  d-flex flex-column`}>
          <div
            className={`${as.coinBalanceCont} mt-3 justify-content-between d-flex`}
          >
            {/* part 1 of 2 */}
            <div className={`${as.coinBalanceA} d-flex`}>
              <span>
                {/* <img
                  src={
                    selectedTokenSecond?.logo
                      ? selectedTokenSecond?.logo
                      : require("../../../../assets/icon.png")
                  }
                ></img> */}
              </span>
              <span className="d-flex align-items-center justify-content-center  pb-1">
                {selectedTokenSecond?.symbol
                  ? selectedTokenSecond?.symbol
                  : "BITS"}
              </span>
              <span onClick={() => setTokenListVis(!tokenListVis)}>
                {" "}
                <IoIosArrowDown></IoIosArrowDown>
              </span>
            </div>

            {/* part 2 of 2 */}
            <div
              className={`${as.coinBalanceB} d-flex align-items-center justify-content-end`}
            >
              <span className="me-1">Balance : 0.01265</span>
              {/* <button>Max</button> */}
            </div>
          </div>

          {/* coin  swap from input */}
          <input className={`${as.liqSwapFromInput} mt-2`}></input>
        </div>

        {/* fies tier cont  */}
        <div className={`${as.FeesTierConst} mt-3 d-flex align-items-center`}>
          <h5 className="d-flex align-items-center gap-2">
            Fee tier <span className="d-flex ">0.28%</span>
          </h5>
          <AiOutlineQuestionCircle></AiOutlineQuestionCircle>
          <span className="ms-3 d-flex align-items-center">
            {" "}
            APR 59.76% <FaGift className="ms-1"></FaGift>
          </span>
        </div>

        {/* fies tier cont wpr plans */}
        <div
          className={`${as.FeesTierAprPlans} d-flex align-items-center justify-content-between gap-2`}
        >
          {/* plans  */}
          {/* 1 */}
          <div className={`${as.FeesAprPlan} feeTierPlan_addLiquidity `}>
            <h5 className="text-center p-0 m-0">0.015%</h5>
            <p className="text-center p-0 m-0">Best for stable pairs</p>
            <span className="mt-1">Not Created</span>
          </div>

          {/* 2 */}
          <div
            className={`${as.FeesAprPlan} feeTierPlan_addLiquidity  feeTierPlanClicked_addLiquidity`}
          >
            <h5 className="text-center p-0 m-0">0.015%</h5>
            <p className="text-center p-0 m-0">Best for stable pairs</p>
            <span className="mt-1 d-flex align-items-center">
              {" "}
              APR 59.76% <FaGift className="ms-1"></FaGift>
            </span>
          </div>

          {/* 3 */}
          <div className={`${as.FeesAprPlan} feeTierPlan_addLiquidity `}>
            <h5 className="text-center p-0 m-0">0.015%</h5>
            <p className="text-center p-0 m-0">Best for stable pairs</p>
            <span className="mt-1">Not Created</span>
          </div>

          {/* 4 */}
          <div className={`${as.FeesAprPlan} feeTierPlan_addLiquidity `}>
            <h5 className="text-center p-0 m-0">0.015%</h5>
            <p className="text-center p-0 m-0">Best for stable pairs</p>
            <span className="mt-1">Not Created</span>
          </div>
        </div>

        {/* Min Max Price Input  Cont   */}
        <div
          className={`${as.minMaxPriceCont} mt-2 d-flex justify-content-between`}
        >
          {/* MinPriceCont */}
          <div className={`${as.MinPriceCont} d-flex flex-column`}>
            <span className="fw-bold">Min Price </span>
            <input className="mt-1"></input>
          </div>

          {/* MaxPriceCont */}
          <div className={`${as.MaxPriceCont} d-flex flex-column`}>
            <span className="fw-bold">Max Price </span>
            <input className="mt-1"></input>
          </div>
        </div>

        {/* add liquidity btn  */}
        <button className={`${as.LiquiditySubmitbtn} mt-2 `}>
          Add Liquidity
        </button>
        {/* <button className={`${as.LiquiditySubmitbtn} mt-1 `}   >Your Liquidity</button> */}
      </div>
    </>
  );
};

export default AddLiquidity;
