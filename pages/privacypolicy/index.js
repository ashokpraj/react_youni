import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTermsAndService } from "../../redux/actions/policy";
import MainLogoImg from "../../style/assets/images/main-logo.png";

function index() {
  const dispatch = useDispatch();

  const [userToken, setUserToken] = useState();
  const PrvacyPolicy = useSelector((state) => state.policy.privacyPolicy);

  if (typeof window !== "undefined") {
    var lights = document.getElementsByClassName("modal-backdrop");
    while (lights.length)
      lights[0].className = lights[0].className.replace(
        /\modal-backdrop\b/g,
        ""
      );
  }

  useEffect(() => {
    dispatch(getTermsAndService());
    const localToken = localStorage.getItem("loginToken");
    // console.log("localToken ::::::", localToken);
    if (localToken) {
      setUserToken(localToken);
    }
  }, []);

  const handleHomeClick = () => {
    if (userToken) {
      Router.push("/showsubscription");
    } else {
      Router.push("/");
    }
  };

  return (
    <div>
      <section className="subscription-banner-image">
        <div className="web-logo">
          <Image
            src={MainLogoImg}
            className="web-logo"
            alt="logo"
            onClick={handleHomeClick}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="project-name-details">
          <h1 className="project-page-name">Privacy Policy</h1>
          <div>
            <h1>{PrvacyPolicy.policyDetail}</h1>
          </div>
        </div>
      </section>
    </div>
  );
}

export default index;
