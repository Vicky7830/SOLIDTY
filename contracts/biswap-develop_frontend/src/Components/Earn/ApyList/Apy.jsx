import React, { useEffect, useState } from 'react'
import as from "./Apy.module.css"
import { MdClose } from 'react-icons/md'
// import { IoIosSearch } from "react-icons/io";

const ApyList = (props) => {

    // token list data  
    const [tokenList, setTokenList] = useState(false)




    return (
        <div className={`${as.TokenListCont} d-flex justify-content-center align-items-start`}  >
            {/* <div className={`${as.darkBackground}`}  > </div> */}

            {/* token list container  */}
            <div className={`${as.TokenListBox} d-flex flex-column gap-3`}  >

                <div className={`${as.popupHeader} `}>
                    <h4 className="fw-bold"  >Select a Plan</h4>
                    <h1 className="cursor-pointer" >
                        <MdClose className="fw-bold cursor-pointer" onClick={() => props.ApyVisHandler()} />
                    </h1>
                </div>

                {/* search tokens  input  */}
                {/* <div className={as.coinSearchDiv}  >

                    <input type='text' placeholder='Searach name or paste address '  ></input>
                    <span className='cursor-pointer'>
                        <IoIosSearch></IoIosSearch>
                    </span>
                </div> */}

                <table className={`${as.ApyTable} p-3  mt-3`}   >
                    {/* HEADINGS  */}
                    <tr>
                        <th>Duration</th>
                        <th>Apy</th>
                    </tr>
                    <tbody>

                        <tr>
                            <td>1 Month</td>
                            <td>6%</td>
                        </tr>

                        <tr>
                            <td>6 Month</td>
                            <td>12%</td>
                        </tr>

                        <tr>
                            <td>12 Month</td>
                            <td>15%</td>
                        </tr>

                    </tbody>

                </table>






            </div>


        </div>
    )
}

export default ApyList