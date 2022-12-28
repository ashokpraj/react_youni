import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { chnageCometPopupStateValue } from "../../redux/actions/popup";
import Image from "next/image";
import * as image from "../../public/imagesURL";
import Addcomet from "../modals/Addcomet";
import BannerBigImg from "../../style/assets/images/bg-img.png";
import placeholderImg from "../../style/assets/images/user-profile-pic.png";
import cometImg from "../../style/assets/images/youni-comet-img.png";
import {
  getAllCometsByUser,
  getAllCometsByUserId,
  getArchiveAllComtes,
  getCometDetailsById,
  getCometImages,
  getCometTeamMember,
  getExpiredCometsData,
  getExpiredCometsDataOfUser,
} from "../../redux/actions/comet";
import Showcomet from "../modals/Showcomet";
import GoogleAds from "../googleAd/GoogleAds";
import Router, { useRouter } from "next/router";
import { getArchiveStars } from "../../redux/actions/star";
import Showarchivecomet from "../modals/Showarchivecomet";
import { cometAllCountOfUser } from "../../redux/actions/dashboard";
import Showexpiredcomet from "../modals/Showexpiredcomet";
import Cometspiral from "../cometspiral/Cometspiral";
import backArrow from "../../style/assets/images/back-arrow.svg";

const Comet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();

  const [showCometModal, setShowCometModal] = useState(false);
  const popupCometState = useSelector((state) => state.data.cometModal);
  const singleCometData = useSelector((state) => state.comet.signleComet);
  const cometTeams = useSelector((state) => state.comet.cometTeams);
  const cometImages = useSelector((state) => state.comet.cometAttachments);
  const [cometId, setCometId] = useState();

  const comets = useSelector((state) => state.comet.cometsData);
  const cometsCount = useSelector((state) => state.comet.totalCometsCount);
  const addComet = useSelector((state) => state.comet.star);
  const cometAlldataOfUsers = useSelector(
    (state) => state.dashboard.cometDataOfUsers
  );

  const [isComet, setIsComet] = useState("");
  let PageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);

  const singleUserData = useSelector((state) => state.dashboard.userData.data);

  const userType = singleUserData ? singleUserData.userTypeId : "";
  const userTokendata = useSelector((state) => state.signin.signin);
  const [bearerToken, setBearerToken] = useState("");
  const [showArchiveComets, setShowArchiveComets] = useState(false);
  const [localUserId, setLocalUserId] = useState();
  const archiveCometes = useSelector((state) => state.comet.archiveCometData);
  const cometStatusCounts = useSelector(
    (state) => state.dashboard.userCometCount
  );

  const [showExpiredComet, setShowExpiredComet] = useState(false);

  const expiredAllCometsAll = useSelector(
    (state) => state.comet.expiredCometDataAll
  );
  const totalExpiredAllComets = useSelector(
    (state) => state.comet.expiredCometData
  );
  const query = router.query;

  function checkAllURLConditions() {
    // if (Object.keys(query).length > 0) {
      if (query.userId || localUserId) {
        setUserId(query.userId || localUserId);
        dispatch(getAllCometsByUserId(pageNumber, PageSize, query.userId || localUserId));
        dispatch(cometAllCountOfUser(query.userId || localUserId));
      } 
      // else
       if (query.cometId || query.onBoardId ) {
        popupCometState = true;
        dispatch(chnageCometPopupStateValue(popupCometState));
        setCometId(query.cometId ? query.cometId : query.onBoardId);
        dispatch(
          getCometDetailsById(query.cometId ? query.cometId : query.onBoardId)
        );
        dispatch(
          getCometTeamMember(query.cometId ? query.cometId : query.onBoardId)
        );
        dispatch(
          getCometImages(query.cometId ? query.cometId : query.onBoardId)
        );
      } else {
        // Router.push("/dashboard");
      }
    }
  // }

  useEffect(() => {
    if (query.userId) {
      localStorage.setItem("userId", query.userId);
      setLocalUserId(query.userId);
    }
    else if (localStorage.getItem("userId")) {
      setLocalUserId(localStorage.getItem("userId"));
    }
    setIsComet(comets?.length);
    checkAllURLConditions();
  }, [router.query,localUserId]);

  // useEffect(() => {
  //   setTimeout(function () {
  //     if (query.cometId || query.onBoardId) {
  //       popupCometState = true;
  //       dispatch(chnageCometPopupStateValue(popupCometState));
  //       setCometId(query.cometId ? query.cometId : query.onBoardId);
  //       dispatch(
  //         getCometDetailsById(query.cometId ? query.cometId : query.onBoardId)
  //       );
  //       dispatch(
  //         getCometTeamMember(query.cometId ? query.cometId : query.onBoardId)
  //       );
  //       dispatch(
  //         getCometImages(query.cometId ? query.cometId : query.onBoardId)
  //       );
  //     }
  //   }, 500);
  // }, [router.query]);

  const handleAddComet = () => {
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

  const handleNewComet = () => {
    Router.push({
      pathname: '/upcomingcomet',
      query: { userId: userId }
  }, '/upcomingcomet');
  };

  const handleArchiveComets = () => {
    setShowArchiveComets(true);
    dispatch(getArchiveAllComtes(1, 10, userId));
  };

  const hideHandleArchiveComets = () => {
    setShowArchiveComets(false);
  };

  const handlePastComet = () => {
    setShowExpiredComet(true);
    dispatch(getExpiredCometsData(userId));
    dispatch(getExpiredCometsDataOfUser(pageNumber, PageSize, userId));
  };

  const hidePastComet = () => {
    setShowExpiredComet(false);
  };

  const changeTimings = (times) => {
    console.log("Timesssss :::", times);
  };

  const handleProfile = () => {
    Router.push({
      pathname: '/viewProfile',
      query: { userId: userId }
  }, '/viewProfile');
  };
  return (
    <>
      <Showexpiredcomet
        setExpiredPopup={showExpiredComet}
        hideModal={hidePastComet}
        totalExpiredAllComets={totalExpiredAllComets}
        expiredAllCometsAll={expiredAllCometsAll}
      />
      <Showarchivecomet
        setShowArchiveComets={showArchiveComets}
        hideModal={hideHandleArchiveComets}
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
          popupCometState
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
              <nav aria-label="breadcrumb">
                {/* <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Star Name</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">Moon Name</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Satellite Name
                  </li>
                </ol> */}
              </nav>
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
          <div className="project-left-details comet-page">
            <div className="add-project-sec">
              <button className="back-btn" onClick={() => router.push("/dashboard")}>
                <span className="back-arrow-img">
                  <Image src={backArrow} className="back-arrow" alt="back icon" />
                </span>
                <span className="back-label">Back</span>
              </button>
              <div className="project-addition" onClick={handleAddComet}>
                <a style={{ color: "white", cursor: "pointer" }}>
                  <span className="add-icon">+</span>
                  Add Comet
                </a>

                { cometId ? (
                  <Addcomet
                    singleCometData={singleCometData}
                    cometTeams={cometTeams}
                    cometImages={cometImages}
                    cometId={cometId}
                    bearerToken={bearerToken}
                  />
                ) : (
                  <Addcomet
                    pageNumber={pageNumber}
                    PageSize={PageSize}
                    bearerToken={bearerToken}
                  />
                )}
              </div>
              <div
                className="project-addition mobile-project-addition"
                onClick={handleAddComet}
              >
                <a style={{ color: "white", cursor: "pointer" }}>
                  <span className="add-icon">Add</span>
                </a>
                {cometId ? (
                  <Addcomet
                    singleCometData={singleCometData}
                    cometTeams={cometTeams}
                    cometImages={cometImages}
                    cometId={cometId}
                    bearerToken={bearerToken}
                  />
                ) : (
                  <Addcomet
                    pageNumber={pageNumber}
                    PageSize={PageSize}
                    bearerToken={bearerToken}
                  />
                )}
              </div>
              {/* ) : (
                ""
              )} */}
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
                    {userTokendata?.photo && userTokendata?.photo ? (
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

              <Cometspiral
                cometsCount={cometsCount}
                comets={comets}
                userId={userId}
                cometAlldataOfUsers={cometAlldataOfUsers}
              />
            </div>
          </div>

          <div className="management-button-wrapper">
            <button className="banner-buttons" onClick={handleNewComet}>
              New Comet
            </button>
            <button className="banner-buttons" onClick={handlePastComet}>
              Expired
            </button>

            <button className="banner-buttons" onClick={handleArchiveComets}>
              Archive Comet
            </button>
          </div>

          <div className="management-button-wrapper mobile-button-wrapper-left-side">
            <button className="banner-buttons" onClick={handleNewComet}>
              New Comet
            </button>
            <button className="banner-buttons" onClick={handlePastComet}>
              Expired
            </button>

            <button className="banner-buttons" onClick={handleArchiveComets}>
              Archive Comet
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Comet;
