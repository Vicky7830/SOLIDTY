import React from 'react'
import as from "./Landing3.module.css"
// import { discount_, lp_, money_pot, user_, volume_ } from '../../App'

const Landing3Fetaures = () => {

    return (

        <div className={`${as.Landing3Fetaures}`}   >

<h1  className={`${as.ourSwap} text-uppercase`}   >Our Sikka coin Swap</h1>


            <div className={`${as.Landing3FetauresCont}`}  >

                {/* 1 */}
                <div className={`${as.featurebox1} ${as.featurebox}   `}  >

                    <div className={`${as.imagecont} bg-red `}    >
                        <img alt='fetaure_1' loading='lazy' src={require("../../assets/money_pot.png")}   ></img>
                    </div>
                    <h6 className='fw-bold'  >Total Volume</h6>
                    <h4 className='fw-bold'   >$45.51B</h4>

                </div>


                {/* 2 */}
                <div className={`${as.featurebox1} ${as.featurebox}   `}  >

                    <div className={`${as.imagecont} bg-parrot `}    >
                        <img alt='fetaure_1' loading='lazy' src={require("../../assets/volume.png")}   ></img>
                    </div>
                    <h6 className='fw-bold'  >24H Volume</h6>
                    <h4 className='fw-bold'   >$15.51M</h4>

                </div>


                {/* 3 */}
                <div className={`${as.featurebox1} ${as.featurebox}   `}  >

                    <div className={`${as.imagecont} bg-purple `}    >
                        <img alt='fetaure_1' loading='lazy' src={require("../../assets/user.png")}   ></img>
                    </div>
                    <h6 className='fw-bold'  >Monthly Active users</h6>
                    <h4 className='fw-bold'   >59.00k</h4>

                </div>


                {/* 4 */}
                <div className={`${as.featurebox1} ${as.featurebox}   `}  >

                    <div className={`${as.imagecont} bg-yellow `}    >
                        <img alt='fetaure_1' loading='lazy' src={require("../../assets/discount.png")}   ></img>
                    </div>
                    <h6 className='fw-bold'  >Trade Fee Saved</h6>
                    <h4 className='fw-bold'   >$112.25M</h4>

                </div>


                {/* 5 */}
                <div className={`${as.featurebox5} ${as.featurebox} border-none  `}  >

                    <div className={`${as.imagecont} bg-blue `}    >
                        <img alt='fetaure_1' loading='lazy' src={require("../../assets/lp.png")}   ></img>
                    </div>
                    <h6 className='fw-bold'  >LP Earned</h6>
                    <h4 className='fw-bold'   >$23.10M</h4>

                </div>


            </div>

        </div>
    )
}

export default Landing3Fetaures