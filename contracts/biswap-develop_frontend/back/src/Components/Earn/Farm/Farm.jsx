import React from 'react'
import as from "./Farm.module.css"
import Footer from '../../Footer/Footer'
import { AiFillPlusCircle, AiOutlineQuestionCircle } from 'react-icons/ai'
import { FaCalendarDays } from 'react-icons/fa6'
import { FaWallet } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Farm = () => {

  const navigate  = useNavigate();



  return (
    <>
      <div className={`${as.FarmCont} d-flex align-items-center justify-content-around gap-3`}   >

        <div className={`${as.FarmBox}`}  >

          <div className={`${as.FarmBoxHead} d-flex flex-column align-items-center justify-content-center`}    >
            <h5>LTC-USDT</h5>
            <p>V3 Liquidity Pool <AiOutlineQuestionCircle></AiOutlineQuestionCircle></p>
            <div>  <span>0.08%</span>  <span>Boosted</span> </div>
          </div>

          {/* avg apr  */}
          <div className={`${as.AvgAprp} mt-2  d-flex  justify-content-between align-items-center`}  >
            <span className='text-start d-flex align-items-center'   > Avg. APR <FaCalendarDays className='d-flex ps-1' /> </span>
            <span className='text-end'   > 19.80%  </span>
          </div>

          {/* total liquidity  */}
          <div className={`${as.AvgAprp} mt-4  d-flex  justify-content-between align-items-center`}    >
            <span className='text-start d-flex flex-column  '   > Total Liquidity

              <p className='text-start'   >1547 $</p>

            </span>
            <span className='text-end'   > My Liquidity </span>
          </div>


          {/* connect wallet  */}
          {/* <div className={`${as.Walletbtn}  d-flex align-items-center justify-content-center gap-2  mt-3 `}>
            <FaWallet className={`${as.Walleti}    `} />
            Connect Wallet

          </div> */}

          {/* add liquidity  */}
          <button className={`${as.Liquiditybtn} d-flex justify-content-center align-items-center gap-2 mt-3 `} onClick={() => {navigate("/Exchange/Liquidity/add")}} >Add Liquidity <AiFillPlusCircle /> </button>



{/* earned rewards  */}

{/* total liquidity  */}
<div className={`${as.AvgAprp} mt-4  d-flex  justify-content-between align-items-center`}    >
<span className='text-start d-flex flex-column  '   > Earned Rewards 
 
 <p className='text-start'   >0.000000</p>
 
 </span>
  <span className='text-end'   ><button className={`${as.harvestAllBtn}`}   >Harvest All</button></span>
</div>



        </div>



{/* 2 box */}

<div className={`${as.FarmBox}`}  >

<div className={`${as.FarmBoxHead} d-flex flex-column align-items-center justify-content-center`}    >
  <h5>LTC-USDT</h5>
  <p>V3 Liquidity Pool <AiOutlineQuestionCircle></AiOutlineQuestionCircle></p>
  <div>  <span>0.08%</span>  <span>Boosted</span> </div>
</div>

{/* avg apr  */}
<div className={`${as.AvgAprp} mt-2  d-flex  justify-content-between align-items-center`}  >
  <span className='text-start d-flex align-items-center'   > Avg. APR <FaCalendarDays className='d-flex ps-1' /> </span>
  <span className='text-end'   > 19.80%  </span>
</div>

{/* total liquidity  */}
<div className={`${as.AvgAprp} mt-4  d-flex  justify-content-between align-items-center`}    >
  <span className='text-start d-flex flex-column  '   > Total Liquidity

    <p className='text-start'   >1547 $</p>

  </span>
  <span className='text-end'   > My Liquidity </span>
</div>


{/* connect wallet  */}
{/* <div className={`${as.Walletbtn}  d-flex align-items-center justify-content-center gap-2  mt-3 `}>
  <FaWallet className={`${as.Walleti}    `} />
  Connect Wallet

</div> */}

{/* add liquidity  */}
<button className={`${as.Liquiditybtn} d-flex justify-content-center align-items-center gap-2 mt-3 `} onClick={() => {navigate("/Exchange/Liquidity/add")}} >Add Liquidity <AiFillPlusCircle /> </button>



{/* earned rewards  */}

{/* total liquidity  */}
<div className={`${as.AvgAprp} mt-4  d-flex  justify-content-between align-items-center`}    >
<span className='text-start d-flex flex-column  '   > Earned Rewards 

<p className='text-start'   >0.000000</p>

</span>
<span className='text-end'   ><button className={`${as.harvestAllBtn}`}   >Harvest All</button></span>
</div>



</div>















      </div>

      {/* <Footer></Footer> */}
    </>
  )
}

export default Farm