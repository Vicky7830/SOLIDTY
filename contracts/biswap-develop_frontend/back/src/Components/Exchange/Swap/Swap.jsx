import { useState } from "react";
import as from "./Swap.module.css";
import { IoSettings } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
// import icon from "../../../assets/icon.png";
import { FaWallet } from "react-icons/fa6";
import { CgArrowsExchangeV } from "react-icons/cg";
import TokenList from "../TokenList/TokenList";
import Setting from "../Setting/Setting";
import { Link } from "react-router-dom";
import { MdHistory } from "react-icons/md";

const Swap = () => {
  // state
  const [tokenListVis, setTokenListVis] = useState(false);
  const [settingVis, setSettingVis] = useState(false);

  // token visibility toggler
  const TokenListVisHandler = () => {
    setTokenListVis(!tokenListVis);
  };

  // Setting visibility toggler

  const SettingVisHandler = () => {
    setSettingVis(!settingVis);
  };

  return (
    <>
    <Navbar></Navbar>

    <div className="about-container">
      <h1>About Us</h1>
      <p>
        We are a forward-thinking team passionate about creating impactful digital experiences. Since 2025, we’ve worked with startups and enterprises to develop clean, scalable, and user-focused solutions.
      </p>
      <p>
        Our mission is to bridge the gap between people and technology through innovative software development, design thinking, and transparent collaboration.
      </p>

      <div className="team-section">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="https://via.placeholder.com/120" alt="Jane" />
            <h3>Jane Doe</h3>
            <p>CEO & Founder</p>
          </div>
          <div className="team-member">
            <img src="https://via.placeholder.com/120" alt="John" />
            <h3>John Smith</h3>
            <p>Lead Developer</p>
          </div>
          <div className="team-member">
            <img src="https://via.placeholder.com/120" alt="Emily" />
            <h3>Emily Brown</h3>
            <p>Product Designer</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Swap;
