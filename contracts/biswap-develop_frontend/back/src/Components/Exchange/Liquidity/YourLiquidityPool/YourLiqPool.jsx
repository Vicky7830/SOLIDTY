import React, { useState } from 'react'
import as from "./YourLiqPool.module.css"
import { BiSolidGift } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import Footer from '../../../Footer/Footer'
import { IoIosSearch } from "react-icons/io";
import { GoDotFill } from 'react-icons/go'


const YourLiqPool = () => {

  const navigate = useNavigate();


  return (



    <>

      {/* {setting container } */}



      <div>

        {/* your liquidity container  */}
        <div className={`${as.UrLiquidityCont}`}   >

          {/* search container  */}
          <div className={`${as.searchCont} d-flex justify-content-between  align-items-center `}  >

            <h5>Your Pools</h5>

            {/* search tokens  input  */}
            <div className={`${as.coinSearchDiv} d-flex`}  >

              <input type='text' placeholder='Search Pools . . .'  ></input>
              <span className='cursor-pointer'>
                <IoIosSearch></IoIosSearch>
              </span>
            </div>
          </div>


          {/* your liquidity pools table / */}

          <table className={`${as.liquidityPoolsTable} `}   >

            {/* headers  */}
            <tr>
              <th>Pools</th>
              <th>Range/APY</th>
              <th>Reward</th>
              <th>Liquidity</th>
              <th>Time</th>
            </tr>

            {/*tables body  */}

            <tr    >
              <td className={`${as.coinpirsCont} d-flex justify-content-start flex-column  `}  >

                <div className='d-flex'  >
                  {/* <img className={`${as.img1} z-2  pairimg`} loading='lazy' src={require("../../../../assets/icon.png")}   ></img>
                  <img className={`${as.img2} z-1 pairimg`} loading='lazy' src={require("../../../../assets/icon.png")}   ></img> */}
                  <span className='d-flex align-items-center jusstify-content-center '   >
                    <GoDotFill className={`${as.pool_status} me-1`} />

                    USDT / WBN</span>
                </div>
                <span className={`${as.APY}`}   >APY 39.08%   <BiSolidGift /> </span>

              </td>


              <td className='d-flex flex-column'   >
                <span>Max 16000 Matic per BNB</span>
                <span>Min 16000 BNB per MAtic</span>

              </td>


              <td className={`${as.Reward} d-flex flex-column`} >

                <span
                >12 BIT</span>
                <button className='ms-2 mt-1'>Claim</button></td>

              <td className={`${as.Operation}  d-flex flex-column`}>

                <span>1760 $</span>
                <button className='mt-2'   >Remove Liquidity</button></td>
           
           
              <td> <span  className={`${as.mobileDis} pe-3`}  >Time : </span>   12 utc  </td>

            </tr>

          </table>



        </div>

      </div>

      {/* <Footer></Footer> */}
    </>
  )
}

export default YourLiqPool