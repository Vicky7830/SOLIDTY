// import React from 'react'
// import as from "./UserStaking.module.css"

// const UserStaking = () => {
//   return (
//     <div>UserStaking</div>
//   )
// }

// export default UserStaking


import React, { useState } from 'react'
import as from "./UserStaking.module.css"
import { BiSolidGift } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { IoIosSearch } from "react-icons/io";
import { GoDotFill } from 'react-icons/go'


const UserStaking = () => {

  const navigate = useNavigate();


  return (



    <>

      {/* {setting container } */}



      <div>

        {/* your liquidity container  */}
        <div className={`${as.UrLiquidityCont}`}   >

          {/* search container  */}
          <div className={`${as.searchCont} d-flex justify-content-between  align-items-center `}  >

            <h5>Your Staking</h5>

            {/* search tokens  input  */}
            <div className={`${as.coinSearchDiv} d-flex`}  >

              <input type='text' placeholder='Search  . . .'  ></input>
              <span className='cursor-pointer'>
                <IoIosSearch></IoIosSearch>
              </span>
            </div>
          </div>


          {/* your liquidity pools table / */}

          <table className={`${as.liquidityPoolsTable} `}   >

            {/* headers  */}
            <tr>
              <th>Name</th>
              <th>APY/Duration</th>
              <th>Staked Amt.</th>
              <th>Operation</th>
              <th>Time</th>
            </tr>

            {/*tables body  */}

            <tr    >
              <td className={`${as.coinpirsCont} d-flex justify-content-start flex-column  `}  >

                <div className='d-flex'  >
                  <img className={`${as.img1} z-2  pairimg`} loading='lazy' src={require("../../../assets/icon.png")}   ></img>
                  <img className={`${as.img2} z-1 pairimg`} loading='lazy' src={require("../../../assets/icon.png")}   ></img>
                  <span className='d-flex align-items-center jusstify-content-center '   >
                    <GoDotFill className={`${as.pool_status} me-1`} />

                    USDT / WBN</span>
                </div>

              </td>


              <td className='d-flex flex-column'   >
                <span className={`${as.APY}`}   >APY 39.08%   <BiSolidGift /> </span>
                <span className='mt-2'  >12 Months ( 12 Jan 2024  )</span>

              </td>


              <td className={`${as.Reward} d-flex flex-column`} >

                <span
                >12 BIT</span>
              </td>

              <td className={`${as.Operation}  d-flex flex-column`}>

                <button className='mt-2'   >Unstake</button></td>


              <td> <span className={`${as.mobileDis} pe-3`}  >Time : </span>    12 utc  </td>

            </tr>

          </table>



        </div>

      </div>

    </>
  )
}

export default UserStaking