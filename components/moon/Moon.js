import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  chnageMoonPopupStateValue,
  chnagePanetPopupStateValue,
} from "../../redux/actions/popup";
import Image from "next/image";
import * as image from "../../public/imagesURL";
import BannerBigImg from "../../style/assets/images/bg-img.png";
import placeholderImg from "../../style/assets/images/youni-planet-img.png";
import Addmoon from "../modals/Addmoon";
import Router, { useRouter } from "next/router";
import {
  getArchiveMoons,
  // getMoonDetailsById,
  getMoonImages,
  getMoonTeamMember,
  getPlanetDetailsByIdData,
  getPlanetDetailsByIdDataOfUsers,
  moonsAllCountOfUser,
  moonsByPlanetAllData,
  getExpiredMoonsData,
  getExpiredMoonsDataOfUser,
} from "../../redux/actions/moon";
import moon from "../../redux/reducers/moon";
import moonIcon from "../../style/assets/images/moon-icon.png";
import Showmoon from "../modals/Showmoon";
import Link from "next/link";
import Showdetails from "../modals/Showdetails";
import Showexpiredmoon from "../modals/Showexpiredmoon";

import {
  getPlanetImages,
  getPlanetTeamMember,
  getProejctDetailsById,
  setStarName,
  storeStarName,
  getPlanetDetailsById,
} from "../../redux/actions/planet";
import Addplanet from "../modals/Addplanet";
import Showmoonarchive from "../modals/Showmoonarchive";
import Moonspiral from "../moonspiral/Moonspiral";

const Moon = () => {
  const router = useRouter();
  const popupState = useSelector((state) => state.data.moonModal);
  const planetPopupState = useSelector((state) => state.data.planetModal);
  const moons = useSelector((state) => state.moon.planetMoons);
  const planetData = useSelector((state) => state.moon.planetName);
  const dispatch = useDispatch();
  const [moonID, setMoonID] = useState();
  const [planetId, setPlanetId] = useState();
  const firstMoonData = useSelector((state) => state.moon.firstMoon);
  const moonCounts = useSelector((state) => state.moon.userMoonCount);
  const [userId, setUserId] = useState();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [planetID, setPlanetID] = useState();
  const [localPlanetId,setLocalPlanetId] = useState();

  const [projectID, setProjectID] = useState();
  const [showArchiveMoon, setShowArchiveMoon] = useState(false);
  const createdStarId = planetData?.createdBy;
  const [showExpiredMoon, setShowExpiredMoon] = useState(false);
  const [starId, setStarId] = useState();

  // Get Planet all data
  const singlePlanetData = useSelector((state) => state.planet.signlePlanet);
  const planetImages = useSelector((state) => state.planet.planetAttachments);
  const singleMoonData = useSelector((state) => state.moon.signleMoon);
  const moonTeams = useSelector((state) => state.moon.moonTeams);
  const moonImages = useSelector((state) => state.moon.moonAttachments);
  const archiveMoonsData = useSelector((state) => state.moon.archiveMoonsData);
  const moonDataByPlanetId = useSelector(
    (state) => state.moon.moonDataByPlanets
  );
  const user = useSelector((state) => state.signin.signin);

  let PageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);
  const starData = useSelector((state) => state.planet.starData);
  const totalExpiredAllMoons = useSelector(
    (state) => state.moon.expiredMoonData
  );

  const expiredAllMoonsAll = useSelector(
    (state) => state.moon.expiredMoonDataAll
  );

  const query = router.query;

  function checkAllURLConditions() {
    // if (Object.keys(query).length > 0) {
      if (query.moonId) {
        popupState = true;
        dispatch(chnageMoonPopupStateValue(popupState));
        setMoonID(query.moonId);
        dispatch(getMoonTeamMember(query.moonId));
        dispatch(getMoonImages(query.moonId));
      } else 
      if (query.planetId || localPlanetId) {
        setPlanetId(query.planetId);
        dispatch(moonsByPlanetAllData(pageNumber, PageSize, query.planetId || localPlanetId));
        dispatch(getPlanetDetailsByIdData(query.planetId || localPlanetId));
        dispatch(getPlanetDetailsByIdDataOfUsers(query.planetId || localPlanetId));
        dispatch(getPlanetDetailsById(query.planetId || localPlanetId));
        // localStorage.setItem("projectName", storeStarName);
      } 
      // else 
      if (query.editplanetID || localPlanetId && planetPopupState) {
        popupState = false;
        dispatch(chnageMoonPopupStateValue(popupState));

        setPlanetID(query.editplanetID || localPlanetId);
        planetPopupState = true;
        dispatch(chnagePanetPopupStateValue(planetPopupState));
        dispatch(getPlanetDetailsById(query.editplanetID || localPlanetId));
        dispatch(getPlanetTeamMember(query.editplanetID || localPlanetId));
        dispatch(getPlanetImages(query.editplanetID || localPlanetId));
      } else {
        // Router.push("/dashboard");
      }
    // }
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const starId = JSON.parse(localStorage.getItem("starId"));

    setStarId(starId);
    setUserId(userData ? userData.userID : "");

    if (userData && userData.userID) {
      dispatch(moonsAllCountOfUser(userData.userID));
    }

    if (popupState === true) {
      popupState = false;
      dispatch(chnageMoonPopupStateValue(popupState));
    }
    if (query.moonId) {
      localStorage.setItem("moonId", query.moonId);
      setMoonID(query.moonId)
    } else {
      setMoonID(localStorage.getItem("moonId"));
    }

    if (query.planetId) {
      localStorage.setItem("planetId", query.planetId);
      // localStorage.setItem("projectId", query.starId);
      setLocalPlanetId(query.planetId);
    } else if (localStorage.getItem("planetId")) {
      setLocalPlanetId(localStorage.getItem("planetId"));
    }

    checkAllURLConditions();
  }, [dispatch, router.query,localPlanetId,moonID]);

  // if (planetData && planetData.projectId && starData.length === 0) {
  //   dispatch(getProejctDetailsById(planetData.projectId));
  // }

  const [showModal, setShowModal] = useState(false);

  const goToPlanet = () => {
    Router.push(`/dashboard`);
  };

  // console.log("createdStarId", createdStarId);
  // console.log("userId", userId);

  const handleEditClick = (planetId) => {
    
    if (createdStarId === userId) {
      setShowDetailModal(false);
      Router.push({
        pathname: '/moon',
        query: { editplanetID: planetId }
    }, '/moon');
      planetPopupState = true;
      dispatch(chnagePanetPopupStateValue(planetPopupState));
    } else {
      setShowDetailModal(true);
    }
  };

  const hideShowDetailsModal = () => {
    setShowDetailModal(false);
  };

  const addMoonAPICall = () => {
      if (!popupState) {
        popupState = true;
        dispatch(chnageMoonPopupStateValue(popupState));
      }
    }
  };


  const handleStarClick = () => {
    Router.push({
      pathname: '/planet',
      query: { projectId: starId }
  }, '/planet');
  };

  const handleMoonArchiveData = () => {
    setShowArchiveMoon(true);
    dispatch(getArchiveMoons(pageNumber, PageSize, planetId || localPlanetId));
  };

  const hideHandleArchiveMoon = () => {
    setShowArchiveMoon(false);
  };

  const handlePastMoon = () => {
    setShowExpiredMoon(true);
    dispatch(getExpiredMoonsData(planetId || localPlanetId));
    dispatch(getExpiredMoonsDataOfUser(pageNumber, PageSize, planetId || localPlanetId));
  };

  const hidePastMoon = () => {
    setShowExpiredMoon(false);
  };

  const changeTimings = (times) => {
    console.log("Timesssss :::", times);
  };

  // console.log("starData ::::", starData);
  return (
    <>
      <Showexpiredmoon
        setExpiredPopup={showExpiredMoon}
        hideModal={hidePastMoon}
        totalExpiredAllMoons={totalExpiredAllMoons}
        expiredAllMoonsAll={expiredAllMoonsAll}
        planetId={planetId || localPlanetId}
      />
      <Showmoonarchive
        setShowArchiveMoon={showArchiveMoon}
        hideModal={hideHandleArchiveMoon}
        planetId={planetId || localPlanetId}
      />

      <Showdetails
        setShowDetailModal={showDetailModal}
        hideDetailsModal={hideShowDetailsModal}
        planetId={planetId || localPlanetId}
        allPlanetData={planetData}
        click="allPlanetData"
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
          popupState && !planetPopupState
            ? "main-page-content page-inner-content moon-poup"
            : planetPopupState
            ? "main-page-content page-inner-content planet-poup"
            : "main-page-content page-inner-content"
        }
      >
        <section className="banner-image">
          <div className="banner-image-wrapper">
            <Image src={BannerBigImg} className="banner-bg-img" alt="banner" />
          </div>
          <div className="project-details">
            <div className="page-breadcrumb">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  {singlePlanetData?.createdBy === user?.userid && (
                    <li className="breadcrumb-item">
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={handleStarClick}
                      >
                        {singlePlanetData?.projectName}
                      </a>
                    </li>
                  )}

                  {planetId || localPlanetId ? (
                    <li className="breadcrumb-item">
                      <a>{planetData?.planetName}</a>
                    </li>
                  ) : (
                    <li className="breadcrumb-item" onClick={goToPlanet}>
                      <a>{planetData?.planetName}</a>
                    </li>
                  )}
                </ol>
              </nav>
            </div>
            <div className="project-name-details">
              <h2 className="project-page-name">Your Moon</h2>
            </div>
          </div>
          <div className="project-left-details inner-project-details">
            <div className="add-project-sec">
              {createdStarId === userId ? (
                <div className="add-project" onClick={() => addMoonAPICall()}>
                  <div className="project-addition">
                    <a style={{ cursor: "pointer" }}>
                      <Image
                        src={moonIcon}
                        className="moon-icon"
                        alt="moon icon"
                      />
                      <span className="add-label">Add Moon</span>
                    </a>
                  </div>
                  <div className="project-addition mobile-project-addition">
                    <a style={{ cursor: "pointer" }}>
                      <span className="add-label">Add</span>
                    </a>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {moonID ? (
            <Addmoon
              singleMoonData={singleMoonData}
              moonTeams={moonTeams}
              moonImages={moonImages}
              moonId={moonID}
              planetId={planetId || localPlanetId}
            />
          ) : (
            <Addmoon
              planetId={planetId || localPlanetId}
              pageNumber={pageNumber}
              PageSize={PageSize}
            />
          )}
          {planetID && (
            <Addplanet
              singlePlanetData={singlePlanetData}
              planetImage={planetImages}
              planetId={planetID || localPlanetId}
              projectId={projectID ? projectID : ""}
            />
          )}
          <div className="banner-inner-spiral-wrapper moon-page">
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
              <div
                className="center-circle-wrapper moon-circle"
                onClick={() => handleEditClick(planetId || localPlanetId)}
              >
                <div
                  className="center-circle-style"
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={placeholderImg}
                    className="center-user-img"
                    alt="Spiral Center Image"
                  />
                  <h2 className="circle-center-name">
                    {planetData?.planetName}
                  </h2>
                </div>
              </div>
              <Moonspiral
                moons={moons}
                planetId={planetId || localPlanetId}
                userId={userId}
                moonDataByPlanetId={moonDataByPlanetId}
                firstMoonData={firstMoonData}
                starName={starData?.projectName}
                starId={starData?.projectId}
              />
            </div>
          </div>

          <div className="management-button-wrapper">
            <button className="banner-buttons" onClick={handlePastMoon}>
              Extendend
            </button>
            <button className="banner-buttons" onClick={handleMoonArchiveData}>
              Archive Moon
            </button>
          </div>

          <div className="management-button-wrapper mobile-button-wrapper-left-side">
            <button className="banner-buttons" onClick={handlePastMoon}>
              ET
            </button>
            <button className="banner-buttons" onClick={handleMoonArchiveData}>
              A
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Moon;
