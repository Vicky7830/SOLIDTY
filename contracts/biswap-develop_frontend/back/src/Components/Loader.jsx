import React from 'react'
import as from "./Loader.module.css"

const Loader = () => {
  return (
    <div className={as.LoaderCont}  >
        <span className={as.loader}></span>
        <p>Transaction in progress . . .</p>
        <p style={{marginTop:"0",paddingTop:"0"}}>Sending request to MetaMask</p>
    </div>
  )
}

export default Loader