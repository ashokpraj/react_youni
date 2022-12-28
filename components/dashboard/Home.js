import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import {
  chnageCometPopupStateValue,
  chnagePopupStateValue,
} from "../../redux/actions/popup";
import Image from "next/image";
import Addstar from "../modals/Addstar";
import * as image from "../../public/imagesURL";
import Addcomet from "../modals/Addcomet";
import BannerBigImg from "../../style/assets/images/bg-img.png";

import {
  cometAllCountOfUser,
  getExpiredProjectData,
  getExpiredProjectDataOfUser,
  projectsAllData,
  starAllCountOfUser,
} from "../../redux/actions/dashboard";
import ShowProjects from "../modals/ShowProjects";
import Router, { useRouter } from "next/router";
import {
  getAllCometsByUser,
  getAllCometsByUserId,
  getCometDetailsById,
  getCometImages,
  getCometTeamMember,
} from "../../redux/actions/comet";
import Showcomet from "../modals/Showcomet";
import GoogleAds from "../googleAd/GoogleAds";
import Showarchivestar from "../modals/Showarchivestar";
import { getArchiveStars } from "../../redux/actions/star";
import Showexpired from "../modals/Showexpired";
import Spiral from "../spiral/Spiral";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const [starId, setStarId] = useState();

  const [showCometModal, setShowCometModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const popupState = useSelector((state) => state.data.starModal);
  const popupCometState = useSelector((state) => state.data.cometModal);
  const starCounts = useSelector((state) => state.dashboard.totalStarCount);
  const projectsData = useSelector((state) => state.dashboard.projectsData);

  const [buttonTag, setButtonTag] = useState("Add Star");
  const [buttomCometTag, setButtonCometTag] = useState("Add Comet");
  const singleCometData = useSelector((state) => state.comet.signleComet);
  const cometTeams = useSelector((state) => state.comet.cometTeams);
  const cometImages = useSelector((state) => state.comet.cometAttachments);
  // console.log("cometImages ::::", cometImages);
  const [cometId, setCometId] = useState();
  const [showArchiveStar, setShowArchiveStar] = useState(false);
  const userTokendata = useSelector((state) => state.signin.signin);
  const [expiredPopup, setExpiredPopup] = useState(false);

  const comets = useSelector((state) => state.comet.cometsData);
  const cometsCount = useSelector((state) => state.comet.totalCometsCount);
  const firstStarData = useSelector((state) => state.dashboard.firstStar);
  const [isComet, setIsComet] = useState("");
  let PageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);

  const archiveStarsData = useSelector((state) => state.star.archiveStars);
  const starStatusCount = useSelector((state) => state.dashboard.userStarCount);
  const cometStatusCounts = useSelector(
    (state) => state.dashboard.userCometCount
  );

  const starData = useSelector((state) => state.planet.starData);
  const totalExpiredAllProjects = useSelector(
    (state) => state.dashboard.expiredProjectData
  );
  const expiredAllProjectsAll = useSelector(
    (state) => state.dashboard.expiredProjectDataAll
  );

  const cometAlldataOfUsers = useSelector(
    (state) => state.comet.cometDataOfUsers
  );

  useEffect(() => {
    localStorage.removeItem("projectName");
    localStorage.removeItem("planetsData");
    localStorage.removeItem("starId");
    localStorage.removeItem("projectId");
    localStorage.removeItem("planetId");
    localStorage.removeItem("moonId");
    localStorage.removeItem("onBoardId");
    if (popupCometState === true) {
      popupCometState = false;
      dispatch(chnageCometPopupStateValue(popupCometState));
    }

    if (popupState === true) {
      popupState = false;
      dispatch(chnagePopupStateValue(popupState));
    }
    dispatch({ type: "CLEAR_STAR_STATE" });
    dispatch({ type: "CLEAR_MOON_STATE" });
    dispatch({ type: "CLEAR_PLANET_STATE" });
    dispatch({ type: "CLEAR_COMET_STATE" });
    dispatch({ type: "CLEAR_SATELLITE_CHAT_STATE" });
    const query = router.query;
    setTimeout(function () {
      if (query.cometId) {
        popupCometState = true;
        dispatch(chnageCometPopupStateValue(popupCometState));
        setCometId(query.cometId);
        dispatch(getCometDetailsById(query.cometId));
        dispatch(getCometTeamMember(query.cometId));
        dispatch(getCometImages(query.cometId));
      }
    }, 500);
  }, [router.query, buttonTag]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setIsComet(comets.length);
    if (userData && userData.userID) {
      setUserId(userData.userID);
      dispatch(getAllCometsByUserId(pageNumber, PageSize, userData.userID));
      dispatch(projectsAllData(pageNumber, PageSize, userData.userID));
      dispatch(starAllCountOfUser(userData.userID));
      dispatch(cometAllCountOfUser(userData.userID));
    }
  }, []);

  const addStarAPICall = () => {
 if (userTokendata.isSubscribed === "true") {
      popupState = true;
      dispatch(chnagePopupStateValue(popupState));
    } else {
      popupState = true;
      dispatch(chnagePopupStateValue(popupState));
    }
  };

  const handleComet = () => {
    popupState = false;
    dispatch(chnagePopupStateValue(popupState));
     if (userTokendata.isSubscribed === "true") {
      popupCometState = true;
      dispatch(chnageCometPopupStateValue(popupCometState));
    } else {
      if (!popupCometState) {
        popupCometState = true;
        dispatch(chnageCometPopupStateValue(popupCometState));
        // } else {
        //   popupCometState = false;
        //   dispatch(chnageCometPopupStateValue(popupCometState));
      }
    }
  };

  const handleNewStar = () => {
    Router.push("/upcomingstars");
  };

  const handleToDoList = () => {
    Router.push("/calendar");
  };

  const handleCometPage = () => {
    Router.push({
      pathname: '/comet',
      query: { userId: userId }
    }, '/comet');
  };

  const handleArchiveStar = () => {
    setShowArchiveStar(true);
    dispatch(getArchiveStars(pageNumber, PageSize, userId));
  };

  const hideHandleArchiveStar = () => {
    setShowArchiveStar(false);
  };

  const handleExpiredProjects = () => {
    setExpiredPopup(true);

    dispatch(getExpiredProjectData(userId));
    dispatch(getExpiredProjectDataOfUser(pageNumber, PageSize, userId));
  };
  const hideExpiredPopup = () => {
    setExpiredPopup(false);
  };

  const handleProfile = () => {
    Router.push({
      pathname: '/viewProfile',
      query: { userId: userId }
    }, '/viewProfile');
  };

  const changeTimings = (times) => {
    console.log("Timesssss :::", times);
    // dispatch(projectsAllData(pageNumber, PageSize, userId));
    // dispatch(getAllCometsByUserId(pageNumber, PageSize, userId));
    // dispatch(starAllCountOfUser(userId));
    // dispatch(cometAllCountOfUser(userId));
    // dispatch(getAllCometsByUser(userId));
  };

  return (
    <>
      <Showexpired
        setExpiredPopup={expiredPopup}
        hideModal={hideExpiredPopup}
        totalExpiredAllProjects={totalExpiredAllProjects}
        expiredAllProjectsAll={expiredAllProjectsAll}
      />
      <Showarchivestar
        setShowArchiveStar={showArchiveStar}
        hideModal={hideHandleArchiveStar}
      />

      {/* Header section */}
      <div className="time-sorting">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li
            className="nav-item"
            role="presentation"
            onClick={() => changeTimings(3)}
          >
            <button
              className="nav-link"
              id="hours-tab"
              data-bs-toggle="tab"
              data-bs-target="#hours"
              type="button"
              role="tab"
              aria-controls="hours"
              aria-selected="true"
            >
              3 Hours
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            onClick={() => changeTimings("day")}
          >
            <button
              className="nav-link"
              id="day-tab"
              data-bs-toggle="tab"
              data-bs-target="#day"
              type="button"
              role="tab"
              aria-controls="day"
              aria-selected="false"
            >
              Day
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            onClick={() => changeTimings("week")}
          >
            <button
              className="nav-link"
              id="week-tab"
              data-bs-toggle="tab"
              data-bs-target="#week"
              type="button"
              role="tab"
              aria-controls="week"
              aria-selected="false"
            >
              Week
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            onClick={() => changeTimings("month")}
          >
            <button
              className="nav-link"
              id="month-tab"
              data-bs-toggle="tab"
              data-bs-target="#month"
              type="button"
              role="tab"
              aria-controls="month"
              aria-selected="false"
            >
              Month
            </button>
          </li>
          <li
            className="nav-item"
            role="presentation"
            onClick={() => changeTimings("year")}
          >
            <button
              className="nav-link active"
              id="year-tab"
              data-bs-toggle="tab"
              data-bs-target="#year"
              type="button"
              role="tab"
              aria-controls="year"
              aria-selected="false"
            >
              Year
            </button>
          </li>
        </ul>
      </div>

      <div
        className={
          popupState
            ? "main-page-content page-inner-content star-poup"
            : popupCometState
              ? "main-page-content page-inner-content comet-poup"
              : "main-page-content page-inner-content universe-page-popup"
        }
      >
        <section className="banner-image">
          <div className="banner-image-wrapper">
            <Image src={BannerBigImg} className="banner-bg-img" alt="banner" />
          </div>
          <div className="project-details">
            <div className="page-breadcrumb">
              <nav aria-label="breadcrumb"></nav>
            </div>

            <div className="ad-class">
              {/* add your slot id  */}
              <Head>
                <script
                  async
                  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6596882406101886"
                  crossorigin="anonymous"
                ></script>
              </Head>
              <GoogleAds slot="9667687323" />
            </div>

            <div className="project-name-details">
              <h2 className="project-page-name">Your Universe</h2>
            </div>
          </div>
          <div className="project-left-details">
            <div className="add-project-sec">
              <div className="project-addition" onClick={() => handleComet()}>
                <a style={{ color: "white", cursor: "pointer" }}>
                  <span className="add-icon">+</span>
                  {buttomCometTag}
                </a>

                {cometId ? (
                  <Addcomet
                    singleCometData={singleCometData}
                    cometTeams={cometTeams}
                    cometImages={cometImages}
                    cometId={cometId}
                  />
                ) : (
                  <Addcomet pageNumber={pageNumber} PageSize={PageSize} />
                )}
              </div>
              <div
                className="project-addition mobile-project-addition"
                onClick={handleComet}
              >
                <a style={{ color: "white", cursor: "pointer" }}>
                  <span className="add-icon">AC</span>
                </a>
                {cometId ? (
                  <Addcomet
                    singleCometData={singleCometData}
                    cometTeams={cometTeams}
                    cometImages={cometImages}
                    cometId={cometId}
                  />
                ) : (
                  <Addcomet pageNumber={pageNumber} PageSize={PageSize} />
                )}
              </div>

              <div className="add-project" onClick={() => addStarAPICall()}>
                <button className="add-project-btn">
                  <span className="star-icon-wrapper">
                    <Image
                      src={image.StarImage}
                      className="star-icon"
                      alt="star icon"
                    />
                  </span>
                  <span className="hover-star-icon-wrapper">
                    <Image
                      src={image.BlackStarImage}
                      className="black-star-icon"
                      alt="star icon"
                    />
                  </span>
                  Add Star
                </button>
                <button className="add-project-btn mobile-add-project-btn">
                  AS
                </button>
              </div>

              {starId ? (
                <Addstar
                  singleStarData={singleStarData}
                  starImages={starImages}
                  starId={starId}
                />
              ) : (
                <Addstar pageNumber={pageNumber} PageSize={PageSize} />
              )}
            </div>
          </div>

          <div className="banner-inner-spiral-wrapper universe-page">
            <div className="banner-spiral">
              <span className="desktop-spiral">
                <Image
                  src={image.BannerInnerImage}
                  className="banner-inner-spiral"
                  alt="Banner Image"
                />
              </span>
              <span className="mobile-spiral">
                <Image
                  src={image.mobileSpiral}
                  className="mobile-spiral-image"
                  alt="Spiral Image"
                />
              </span>
              <div className="center-circle-wrapper universe-circle">
                <div className="center-circle-style">
                  <a onClick={handleProfile} style={{ cursor: "pointer" }}>
                    {/* {userTokendata?.photo === "null" ? (
                      <Image
                        className="center-user-img"
                        alt="Spiral Center Image"
                        src={image.UserProfile}
                      />
                    ) : (
                      <img
                        className="center-user-img"
                        alt="Spiral Center Image"
                        src={userTokendata?.photo}
                      />
                    )} */}

                    {userTokendata?.photo ? (
                      <img
                        className="center-user-img"
                        alt="Spiral Center Image"
                        src={userTokendata?.photo}
                      />
                    ) : (
                      <Image
                        className="center-user-img"
                        alt="Spiral Center Image"
                        src={image.UserProfile}
                      />
                    )}
                  </a>
                </div>
              </div>
              <Spiral
                cometsCount={cometsCount}
                projectsData={projectsData}
                starCounts={starCounts}
                userId={userId}
                comets={comets}
                cometAlldataOfUsers={cometAlldataOfUsers}
                firstStarData={firstStarData}
              />
            </div>
          </div>

          <div className="management-button-wrapper">
            <button className="banner-buttons" onClick={handleNewStar}>
              New Star
            </button>
            <button className="banner-buttons" onClick={handleExpiredProjects}>
              Extendend
            </button>

            {archiveStarsData?.length > 0 ? (
              <button className="banner-buttons" onClick={handleArchiveStar}>
                Archive Star
              </button>
            ) : (
              <button className="banner-buttons" onClick={handleArchiveStar}>
                Archive Star
              </button>
            )}

            <button className="banner-buttons" onClick={handleCometPage}>
              Comet Page
            </button>
          </div>

          <div className="management-button-wrapper mobile-button-wrapper-left-side">
            <button className="banner-buttons" onClick={handleNewStar}>
              NS
            </button>
            <button className="banner-buttons" onClick={handleExpiredProjects}>
              ET
            </button>

            <button className="banner-buttons" onClick={handleArchiveStar}>
              A
            </button>

            <button className="banner-buttons" onClick={handleCometPage}>
              CP
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
