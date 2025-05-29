import React, { useState } from 'react'

import as from "./Liquidity.module.css"
import { IoSettings } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillPlusCircle, AiOutlineQuestionCircle } from "react-icons/ai";
import { BiSolidGift } from "react-icons/bi";
import Setting from '../Setting/Setting';
import { MdHistory } from "react-icons/md";


const Liquidity = () => {

  const navigate = useNavigate();


  // state 
  const [settingVis, setSettingVis] = useState(false)


  // Setting visibility toggler 

  const SettingVisHandler = () => {
    setSettingVis(!settingVis)
  }




  return (
    <>

      {/* {setting container } */}

      {settingVis ? <Setting SettingVisHandler={SettingVisHandler}   ></Setting> : null}


      <div className={as.LiquidityContainer}    >

        {/* setting container  */}
  <div  className={`${as.topCont} d-flex align-items-center  justify-content-between`}      >

  <div className={`${as.settingCont} d-flex gap-1 align-items-center`}   >
          <IoSettings className='cursor-pointer ' onClick={() => setSettingVis(!settingVis)}  ></IoSettings>
          <h3 className='d-inline-block text-dark' >Liquidity V3</h3>
        </div>

        <div   className={`${as.swapHistory}  d-flex align-items-center  justify-content-end pe-2` }  >
          <Link  to="/Exchange/Liquidity/History"  ><MdHistory></MdHistory></Link>
        </div>


  </div>


        <p className='mt-2'  >Add liquidity to get an LP NFT. <Link className='ps-1'   > Why V3 liquidity is better?</Link></p>

        {/* add liquidity buttons  */}
        <button className={`${as.Liquiditybtn} d-flex justify-content-center align-items-center gap-2 `} onClick={() => navigate("/Exchange/Liquidity/add")} >Add Liquidity <AiFillPlusCircle /> </button>

        {/* your liquidity container  */}
        <div className={`${as.UrLiquidityCont}`}   >

          {/* heading   */}
          <div className={`${as.headCont} d-flex align-items-center justify-content-start gap-2`}   ><span className='fw-bold'   >Your Liquidity</span><AiOutlineQuestionCircle /></div>

          {/* <p id={`${as.connectWalletp}`} className='d-flex align-items-center gap-1 '  >No liquidity found.</p> */}


          {/* your  pools  contianer */}
          <div className={`${as.topPoolsContainer}`}   >

            {/* <div className={`${as.headCont} d-flex align-items-center justify-content-start gap-2`}   ><span className='fw-bold'   >Top Polls</span><AiOutlineQuestionCircle /></div> */}

            {/* pool coins pair list  */}


            {/* your pools btn  */}
            <button className={`${as.allPoolsBtn} `} onClick={()=>navigate("/Exchange/Liquidity/YourPools")}  > Your Pools</button>
          </div>

        </div>

      </div>
    </>

  )
}

export default Liquidity