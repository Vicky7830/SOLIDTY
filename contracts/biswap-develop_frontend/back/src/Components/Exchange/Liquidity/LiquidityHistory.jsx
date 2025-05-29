// import React from 'react'

// const LiquidityHistory = () => {
//   return (
//     <div>LiquidityHistory</div>
//   )
// }

// export default LiquidityHistory


// import React from 'react'

// const SwapHistory = () => {
//   return (
//     <div>SwapHistory</div>
//   )
// }

// export default SwapHistory


import React, { useState } from 'react'
import as from "./LiquidityHistory.module.css"


import { BiSolidGift } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { GoDotFill } from 'react-icons/go'
import { RxExternalLink } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { CgArrowsExchange } from 'react-icons/cg';


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

            <h5 className='text-uppercase'  > Liquidity History</h5>

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

                  110003  BITS  <CgArrowsExchange className='fs-5 ms-1 me-1'></CgArrowsExchange>   13000  wBITS  </span>
                </div>

              </td>


              <td className={`${as.Reward} d-flex flex-column`} >

             
                <button className='ms-2 mt-1'>Liquidity added</button></td>

              <td className={`${as.Operation}  d-flex flex-column`}>

                <span>LP :   <span className='ps-2'  > 1760 BITS </span></span>
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