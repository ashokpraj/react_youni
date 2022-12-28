import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPrivacyPolicy } from "../../redux/actions/policy";
import MainLogoImg from "../../style/assets/images/main-logo.png";

function index() {
  const TermsService = useSelector((state) => state.policy.termsService);

  const dispatch = useDispatch();
  const [userToken, setUserToken] = useState();

  if (typeof window !== "undefined") {
    var lights = document.getElementsByClassName("modal-backdrop");
    while (lights.length)
      lights[0].className = lights[0].className.replace(
        /\modal-backdrop\b/g,
        ""
      );
  }

  useEffect(() => {
    dispatch(getPrivacyPolicy());
    const localToken = localStorage.getItem("loginToken");
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
          <h1 className="project-page-name">Terms Services</h1>
          <div>
            <h1>{TermsService.termsDetail}</h1>
          </div>
        </div>
      </section>
    </div>
  );
}

export default index;
