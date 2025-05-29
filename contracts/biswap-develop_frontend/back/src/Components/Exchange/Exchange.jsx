import React, { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '../Footer/Footer'
import as from "./Exchange.module.css"

const Exchange = () => {


  const location = useLocation();
  console.log(location, "location=>>>>>>>");

  // const navigate = useNavigate();


  useEffect(() => {

    //link bottom underline 
    //  classs toggler  
    // const Navlinks = document.querySelectorAll(".SwapLink")

    // stability (border-bottom) for liquidity add nav / 
    if (location.pathname === "/Exchange/Liquidity/add") {
      document.querySelector('.active_it')?.classList.remove('active_it');
      Navlinks[1].classList.add('active_it')
    }

    // stability (border-bottom) for liquidity  nav / 
    if (location.pathname === "/Exchange/Liquidity") {
      document.querySelector('.active_it')?.classList.remove('active_it');
      Navlinks[1].classList.add('active_it')
    }

    // stability (border-bottom) for liquidity  nav / 
    if (location.pathname === "/Exchange/Liquidity/YourPools") {
      document.querySelector('.active_it')?.classList.remove('active_it');
      Navlinks[1].classList.add('active_it')
    }

    // stability (border-bottom) for swap  nav / 
    if (location.pathname === "/Exchange") {
      document.querySelector('.active_it')?.classList.remove('active_it');
      Navlinks[0].classList.add('active_it')
    }

    // stability (border-bottom) for swap history  nav / 
    if (location.pathname === "/Exchange/History") {
      document.querySelector('.active_it')?.classList.remove('active_it');
      Navlinks[2].classList.add('active_it')
    }

    // stability (border-bottom) for swap  nav / 
    if (location.pathname === "/Exchange/BuyCrypto") {
      document.querySelector('.active_it')?.classList.remove('active_it');
      Navlinks[3].classList.add('active_it')
    }

    // on click border-bottom toggler 
    Navlinks.forEach(navLink => {
      navLink.addEventListener('click', () => {
        // navLink.classList.toggle("active")
        document.querySelector('.active_it')?.classList.remove('active_it');
        navLink.classList.add('active_it')


      })

    })
  })






  return (
    <>
      <div className={`${as.ExchangeCont} w100 h70  d-flex align-items-center justify-content-center`}   >
        {/* //swap container */}
        <div className={`${as.SwapCont} d-flex flex-column`}  >

          {/* head : links  */}
          <nav >

            {/* 1*4  */}
            <ul className={`${as.navlinkCont} d-flex justify-content-between `} >

              <li>   <Link to="/Exchange" className={`${as.nav1} SwapLink active_it`}>Swap</Link></li>
              <li>   <Link to="/Exchange/Liquidity" className={`${as.nav2} SwapLink`}>Liquidity</Link></li>
              <li>   <Link to="/Exchange/History" className={`${as.nav3} SwapLink`}>History</Link></li>
              <li>   <Link to="/Exchange/BuyCrypto" className={`${as.nav4} SwapLink`}>Buy Crypto</Link></li>

            </ul>
          </nav>
          <hr className={as.hr}  ></hr>

          <Outlet></Outlet>

        </div>
      </div>
      <Footer></Footer>

    </>
  )
}

export default Exchange