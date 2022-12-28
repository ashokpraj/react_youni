import Image from "next/image";
import Signinmodal from "../modals/Signinmodal";
import Signupmodal from "../modals/Signupmodal";
import * as image from "../../public/imagesURL";
import { Router } from "react-router-dom";
import MobileMainLogoImg from "../../style/assets/images/circular-center-logo.png";

const Header = () => {

  const handleDashboard = () => {
    Router.push("/dashboard")
  }

  return (
    <>
      <header className="main-page-header">
        <nav className="nav-header">
          <a className="navbar-brand" href={handleDashboard}>
            <Image className="main-logo" src={image.Logoimage} alt="Logo" />
          </a>
          <a className="navbar-brand-mobile" href={handleDashboard}>
            <Image src={MobileMainLogoImg} className="mobile-web-logo" alt="logo" />
          </a>

          <div className="header-sign-option">
            <ul>
              <li>
                <button
                  className="common-btn gradient-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalToggle"
                >
                  Sign In
                </button>
              </li>
              <li>
                <button
                  className="common-btn gradient-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#signupModalToggle"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <Signinmodal />
      <Signupmodal />
    </>
  );
};

export default Header;
