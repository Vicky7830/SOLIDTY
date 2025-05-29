import Home from "./Components/Home/Home";
import Landing from "./Components/Landing/Landing";
import Swap from "./Components/Exchange/Swap/Swap";
import Exchange from "./Components/Exchange/Exchange";

// css
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Route
import { Route, Routes } from "react-router-dom";
import  AboutUs from "./Components/AboutUs";
import Register from "./Components/Register";

import Liquidity from "./Components/Exchange/Liquidity/Liquidity";
// import ExchangeHistory from "./Components/Exchange/History/ExchangeHistory";
import BuyCrypto from "./Components/Exchange/BuyCrypto/BuyCrypto";
import AddLiquidity from "./Components/Exchange/Liquidity/AddLiquidity/AddLiquidity";
import YourLiqPool from "./Components/Exchange/Liquidity/YourLiquidityPool/YourLiqPool";
import Staking from "./Components/Earn/Staking/Staking";
import Farm from "./Components/Earn/Farm/Farm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import { setListedTokens } from "./services/slice/listedTokenSlice";
import { tokenIds } from "./utils/constants";
import { useGetListedTokendetailsMutation } from "./services/api/listedToken";


import DirectIncome from './Components/Earn/Staking/DirectIncome';
import StakingHIstory from './Components/Earn/Staking/StakingHistory';
import LevelIncomeDetailsHistory from './Components/Earn/Staking/LevelIncomeDetailsHistory';
import Login from "./Components/Login";
import ProfilePopup from "./Components/Earn/Staking/ProfilePopup"

function App() {
  // const dispatch = useDispatch();
  // const listedToken = useSelector(

  //   (state) => state.listedTokenSlice.listedTokens
  // );

  // const [getListedTokendetails] = useGetListedTokendetailsMutation();

  // const handleFetchListedTokens = async () => {
  //   try {
  //     const result = await getListedTokendetails();
  //     dispatch(setListedTokens(extractToken(result.data.data)));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const extractToken = (tokens) => {
  //   let result = [];
  //   for (const key in tokens) {
  //     if (Object.hasOwnProperty.call(tokens, key)) {
  //       const element = tokens[key];
  //       let temp = element.filter((item) => tokenIds.includes(item.id));
  //       result.push(...temp);
  //     }
  //   }
  //   return result;
  // };

  // useEffect(() => {
  //   if (Object.entries(listedToken).length < 1) handleFetchListedTokens();
  // }, []);
  return (
    <>
      <Routes>
      <Route path="/Staking" element={<Staking></Staking>}></Route>
      <Route path='/DirectIncome' element={<DirectIncome></DirectIncome>}  />
    <Route path='/StakingHistory' element={<StakingHIstory></StakingHIstory>}  />
    <Route path='/LevelIncomeDetailsHistory' element={<LevelIncomeDetailsHistory></LevelIncomeDetailsHistory>}  />

        <Route path="/" element={<Home></Home>}>
          {/* default outlet :  landing page for home  */}
          <Route path="/" element={<Landing></Landing>}>
            {" "}
          </Route>

          <Route path="/AboutUs" element={<AboutUs></AboutUs>}></Route>
          <Route path="/Register" element={<Register></Register>}></Route>
          <Route path="/Login" element={<Login></Login>}></Route>
          <Route path="/ProfilePopup" element={<ProfilePopup></ProfilePopup>}></Route>



          {/* other outlets for home   */}

          {/* exchange/   */}
          <Route path="/Exchange" element={<Exchange></Exchange>}> </Route>            
            {/* default outlet for exchnage :  swap page  */}
            <Route path="/Exchange" element={<Swap></Swap>}></Route>
            <Route
              path="/Exchange/Liquidity"
              element={<Liquidity></Liquidity>}
            ></Route>
            <Route
              path="/Exchange/Liquidity/add"
              element={<AddLiquidity></AddLiquidity>}
            ></Route>


        
            <Route
              path="/Exchange/BuyCrypto"
              element={<BuyCrypto></BuyCrypto>}
            ></Route>
          </Route>

          {/* your pools  */}
          <Route
            path="/Exchange/Liquidity/YourPools"
            element={<YourLiqPool></YourLiqPool>}
          ></Route>

          {/* earn  */}
          <Route path="/Earn/Farm" element={<Farm></Farm>}></Route>
        
      </Routes>
    </>
  );
}

export default App;
