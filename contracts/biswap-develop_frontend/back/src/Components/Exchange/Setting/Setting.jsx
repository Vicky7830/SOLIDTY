import React, { useEffect } from 'react'
import as from "./Setting.module.css"
import { MdClose, MdLocalGasStation } from 'react-icons/md'
import { GoQuestion } from "react-icons/go";

const Setting = (props) => {


    useEffect(() => {
// trx btns toggler 

        //link bottom underline 
        //  classs toggler  
        const btns = document.querySelectorAll(".traxbtns")
        console.log(btns);

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                // navLink.classList.toggle("active")
                document.querySelector('.trxbtnClicked')?.classList.remove('trxbtnClicked');
                btn.classList.add('trxbtnClicked')
            })
        })
    })


    useEffect(() => {
// slipage toggler 
        //link bottom underline 
        //  classs toggler  
        const btns = document.querySelectorAll(".slipperageOption")
        console.log(btns);

        btns.forEach(slipperageOption => {
            slipperageOption.addEventListener('click', () => {
                // navLink.classList.toggle("active")
                document.querySelector('.slipperageOptionClicked')?.classList.remove('slipperageOptionClicked');
                slipperageOption.classList.add('slipperageOptionClicked')
            })
        })
    })



    return (
        <div className={`${as.TokenListCont} d-flex justify-content-center align-items-start`}  >
            {/* <div className={`${as.darkBackground}`}  > </div> */}

            {/* token list container  */}
            <div className={`${as.TokenListBox} d-flex flex-column `}  >

                <div className={`${as.popupHeader} `}>
                    <h4 className="fw-bold"  >Settings</h4>
                    <h1 className="cursor-pointer">
                        <MdClose className="fw-bold cursor-pointer" onClick={() => props.SettingVisHandler()} />
                    </h1>
                </div>

                {/* Default Transaction Speed p cont   */}
                <p className={`${as.h2para} mt-4 fw-bold`}   >
                    <MdLocalGasStation className=' me-1' />
                    Default Transaction Speed (GWEI)
                    <GoQuestion className='ms-2' />
                </p>

                {/* Default Transaction Speed btn group cont   */}
                <div className={`${as.btnGroupCont} d-flex align-items-center justify-content-between mt-0 pt-0`}   >
                    {/* 1*3 btns */}
                    <button type='button' className={`${as.btngroupBtn} traxbtns `} >Standard (3)</button>
                    <button type='button' className={`${as.btngroupBtn} traxbtns `} >Fast (4)</button>
                    <button type='button' className={`${as.btngroupBtn} traxbtns trxbtnClicked `} >Instant (5)</button>

                </div>

                {/* line  */}
                <hr></hr>

                {/*  Slippage tolerance  p cont   */}
                <p className={`${as.h2para}  fw-bold`}   >
                    Slippage tolerance
                    <GoQuestion className='ms-2' />
                </p>


                <div className={`${as.SlippagebtnGroupCont} d-flex align-items-center justify-content-between mt-0 pt-0`}   >
                    {/* 1*3 btns */}
                    <button type='button' className='slipperageOption' >0.01%</button>
                    <button type='button' className='slipperageOption' >0.05%</button>
                    <button type='button' className='slipperageOption'  >1%</button>
                    <input type='number'  className='slipperageOption slipperageOptionClicked' ></input>

                </div>

                {/*  Slippage tolerance  p cont   */}
                <p className={`${as.h2para} mt-3  fw-bold`}   >
                    Transaction deadline
                    <GoQuestion className='ms-2' />
                </p>

                {/* transacton deadline btn  */}
                <div className={`${as.deadlineInputgroup} d-flex align-items-center`} >
                    <input type='number' className={`${as.deadlineInput}`} ></input>
                    <span className='d-flex align-items-center fw-bold ms-2'>Minutes</span>
                </div>


                {/* save changes button  */}
                <button className={`${as.saveChangesBtn}`}   >Save Changes</button>
            </div>


        </div>
    )
}

export default Setting