// import React from 'react'

// const SwapHistory = () => {
//   return (
//     <div>SwapHistory</div>
//   )
// }

// export default SwapHistory


import React, { useState } from 'react'
import as from "./SwapHistory.module.css"

import { BiSolidGift } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { GoDotFill } from 'react-icons/go'
import { RxExternalLink } from 'react-icons/rx';
import { Link } from 'react-router-dom';


const SwapHistory = () => {

  const navigate = useNavigate();


  return (



    <>

      {/* {setting container } */}



      <div>

        {/* your liquidity container  */}
        <div className={`${as.UrLiquidityCont}`}   >

          {/* search container  */}
          <div className={`${as.searchCont} d-flex justify-content-center  align-items-center `}  >

            <h5 className='text-uppercase'  >Your Swap Transactions</h5>

          </div>

{/* clear */}
          <p  className={`${as.ClearAll} d-flex justify-content-end  `}  >
            <span className='text-white'   >Clear All</span>
          </p>


          {/* your liquidity pools table / */}

          <table className={`${as.liquidityPoolsTable} `}   >

            {/*tables body  */}

            <tr    >
              <td className={`${as.coinpirsCont} d-flex justify-content-start flex-column  `}  >

                <div className='d-flex'  >
                  {/* <img className={`${as.img1} z-2  pairimg`} loading='lazy' src={require("../../../../assets/icon.png")}   ></img>
                  <img className={`${as.img2} z-1 pairimg`} loading='lazy' src={require("../../../../assets/icon.png")}   ></img> */}
                  <span className='d-flex align-items-center jusstify-content-center '   >

                  1300000000000  BITS</span>
                </div>

              </td>


              <td className={`${as.Reward} d-flex flex-column`} >

             
                <button className='ms-2 mt-1'>Swap</button></td>

              <td className={`${as.Operation}  d-flex flex-column`}>

                <span>For  <span className='ps-2'  > 1760 DYOR </span></span>
            </td>
           
           
              <td> <span  className={`${as.mobileDis} pe-3`}  >Time : </span>   12 : 15 UTC  <RxExternalLink className='ms-2'  ></RxExternalLink> </td>

            </tr>

          </table>

        </div>

      </div>

    </>
  )
}

export default SwapHistory