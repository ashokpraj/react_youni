import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  chnagePanetPopupStateValue,
  chnagePopupStateValue,
} from "../../redux/actions/popup";
import Image from "next/image";
import * as image from "../../public/imagesURL";
import BannerBigImg from "../../style/assets/images/bg-img.png";
import placeholderImg from "../../style/assets/images/youni-circle-img.png";
import Addplanet from "../modals/Addplanet";
import { useRouter } from "next/router";
import {
  planetsByProjectAllData,
  getProejctDetailsById,
  planetAllCountOfUser,
  planetsByProjectAllDatas,
  getExpiredPlanetData,
  getExpiredPlanetDataOfUser,
  getArchivePlanets,
} from "../../redux/actions/planet";
import Router from "next/router";
import planetIcon from "../../style/assets/images/planet-icon.png";
import Showdetails from "../modals/Showdetails";
import {
  getStarDetailsById,
  getStarImages,
} from "../../redux/actions/dashboard";
import Addstar from "../modals/Addstar";
import Showexpiredplanet from "../modals/Showexpiredplanet";
import Showarchiveplanet from "../modals/Showarchiveplanet";
import Planetspiral from "../planetspiral/Planetspiral";
import Link from "next/link";

const Planet = () => {
  const [userId, setUserId] = useState();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserId(userData ? userData.userID : "");
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const starPopupState = useSelector((state) => state.data.starModal);

  const popupState = useSelector((state) => state.data.planetModal);
  const planets = useSelector((state) => state.planet.projectPlanets);
  const starData = useSelector((state) => state.planet.starData);
  const planetsData = useSelector((state) => state.planet.planetsAllData);
  const isLoading = useSelector((state) => state.planet.loading);
  const [projectID, setProjectID] = useState();
  const [planetID, setPlanetID] = useState();
  const singlePlanetData = useSelector((state) => state.planet.signlePlanet);
  const planetTeams = useSelector((state) => state.planet.planetTeams);
  const planetImages = useSelector((state) => state.planet.planetAttachments);
  const firstPlanet = useSelector((state) => state.planet.firstPlanet);
  const planetsCounts = useSelector((state) => state.planet.userPlanetCount);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [projectName, setProjectName] = useState();
  const createdStarId = starData?.createdBy;
  const [starId, setStarId] = useState();
  const [showArchivePlanet, setShowArchivePlanet] = useState(false);
  const [localProId, setLocalProId] = useState();
  const [localStarId, setLocalStarId] = useState();

  // Get Star all data
  const singleStarData = useSelector((state) => state.dashboard.signleStar);
  const starTeams = useSelector((state) => state.dashboard.starTeams);
  const starImages = useSelector((state) => state.dashboard.starAttachments);
  const archivePlantesData = useSelector(
    (state) => state.planet.archivePlanetsData
  );

  const [showExpiredPlanet, setShowExpiredPlanet] = useState(false);
  const expiredAllPlanetsAll = useSelector(
    (state) => state.planet.expiredPlanetDataAll
  );

  const totalExpiredAllPlanets = useSelector(
    (state) => state.planet.expiredPlanetData
  );

  const PageSize = 10;
  const pageNumber = 1;
  const query = router.query;

  function checkAllURLConditions() {

    if (query?.projectId || localProId) {
      dispatch(
        planetsByProjectAllData(pageNumber, PageSize, query?.projectId || localProId)
      );
      dispatch(getProejctDetailsById(query?.projectId || localProId));
      dispatch(planetsByProjectAllDatas(query?.projectId || localProId));
      setProjectName(starData?.projectName);
    }
    if (query.starId || localStarId && starPopupState) {
      starPopupState = true;
      dispatch(chnagePopupStateValue(starPopupState));
      setStarId(query.starId || localStarId);
      dispatch(
        getStarDetailsById(query.starId || localStarId || query?.onBoardId)
      );
      dispatch(getStarImages(query.starId || localStarId || query?.onBoardId));
    }
    else if( query?.onBoardId) {
      starPopupState = true;
      dispatch(chnagePopupStateValue(starPopupState));
      setStarId(query?.onBoardId);
      dispatch(
        getStarDetailsById(query?.onBoardId )
      );
      dispatch(getStarImages(query?.onBoardId ));
      // Router.push("/dashboard");
    }
  }

  useEffect(() => {
    setShowModal(false);
    if (popupState === true) {
      popupState = false;
      dispatch(chnagePanetPopupStateValue(popupState));
    }

    // Store data in to local storage
    if (query.projectId) {
      localStorage.setItem("projectId", query.projectId);
      setProjectID(query.projectId)
    } else {
      setLocalProId(localStorage.getItem("projectId"));
    }

    checkAllURLConditions();

    if (query.starId) {
      localStorage.setItem("starId", query.starId);
      // localStorage.setItem("projectId", query.starId);
      setLocalStarId(query.starId);
    } else if (localStorage.getItem("starId")) {
      setLocalStarId(localStorage.getItem("starId"));
    }

    // localProId, localStarId
  }, [dispatch, router.query, isLoading, localProId, localStarId]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userID) {
      dispatch(planetAllCountOfUser(userData?.userID));
    }
  }, []);

  const hideShowDetailsModal = () => {
    setShowDetailModal(false);
  };

  const handleClick = () => {
    Router.push(`/dashboard`);
  };

  const addPlanetAPICall = () => {
      popupState = true;
      dispatch(chnagePanetPopupStateValue(popupState));
  };

  const handleArchiveDataPlanet = () => {
    setShowArchivePlanet(true);
    dispatch(getArchivePlanets(pageNumber, PageSize, projectID || localProId));
  };

  const hideHandleArchivePlanet = () => {
    setShowArchivePlanet(false);
  };

  const handlePastPlanet = () => {
    setShowExpiredPlanet(true);
    dispatch(getExpiredPlanetData(projectID || localProId));
    dispatch(getExpiredPlanetDataOfUser(pageNumber, PageSize, projectID || localProId));
  };

  const hidePastPlanet = () => {
    setShowExpiredPlanet(false);
  };

  const changeTimings = (times) => {
    console.log("Timesssss :::", times);
  };

    const handleEditClick = (starId) => {
    if (createdStarId === userId) {
      Router.push({
        pathname: `/planet/`,
        query: {
          starId: projectID || localProId,
        },
      }, '/planet');
      setShowDetailModal(false);
    } else {
      setShowDetailModal(true);
    }
  };

  return (
    <>
      <Showexpiredplanet
        setExpiredPopup={showExpiredPlanet}
        hideModal={hidePastPlanet}
        expiredAllPlanetsAll={expiredAllPlanetsAll}
        totalExpiredAllPlanets={totalExpiredAllPlanets}
        projectId={projectID || localProId}
      />

      <Showarchiveplanet
        setShowArchivePlanet={showArchivePlanet}
        hideModal={hideHandleArchivePlanet}
        projectId={projectID || localProId}
      />

      <Showdetails
        setShowDetailModal={showDetailModal}
        hideDetailsModal={hideShowDetailsModal}
        starId={projectID || localProId}
        allStarData={starData}
        click="allStarData"
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
          popupState && !starPopupState
            ? "main-page-content page-inner-content planet-poup"
            : starPopupState
              ? "main-page-content page-inner-content star-poup"
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
                  <li className="breadcrumb-item">
                    <a onClick={handleClick} style={{ cursor: "pointer" }}>
                      {starData ? starData?.projectName : ""}
                    </a>
                  </li>
                  {/* <li className="breadcrumb-item">
                    <a href="#">Moon Name</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Satellite Name
                  </li> */}
                </ol>
              </nav>
            </div>
            <div className="project-name-details">
              <h2 className="project-page-name">Your Planet</h2>
            </div>
          </div>
          <div className="project-left-details inner-project-details">
            <div className="add-project-sec">
              {createdStarId === userId ? (
                <div className="add-project" onClick={() => addPlanetAPICall()}>
                  <div className="project-addition">
                    <a style={{ cursor: "pointer" }}>
                      <Image
                        src={planetIcon}
                        className="planet-icon"
                        alt="planet icon"
                      />
                      <span className="add-label">Add Planet</span>
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
          {/* {console.log("planetsCounts ::::", planetsCounts)} */}

          {planetImages && planetID ? (
            <Addplanet
              singlePlanetData={singlePlanetData}
              planetTeams={planetTeams}
              planetImage={planetImages}
              planetId={planetID}
              projectId={projectID || localProId}
            />
          ) : (
            <Addplanet
              projectId={projectID || localProId}
              pageNumber={pageNumber}
              PageSize={PageSize}
            />
          )}

          {starId && (
            <Addstar
              singleStarData={singleStarData}
              starTeams={starTeams}
              starImages={starImages}
              starId={starId}
              createdStarId={createdStarId}
            />
          )}

          <div className="banner-inner-spiral-wrapper planet-page">
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
                  className="center-circle-wrapper planet-circle"
                onClick={() => handleEditClick(projectID || localProId)}
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
                      {starData ? starData?.projectName : ""}
                    </h2>
                  </div>
                </div>

              <Planetspiral
                planets={planets}
                userId={userId}
                projectID={projectID || localProId}
                planetsData={planetsData}
                firstPlanet={firstPlanet}
              />
            </div>
          </div>

          <div className="management-button-wrapper">
            <button className="banner-buttons" onClick={handlePastPlanet}>
              Extendend
            </button>

            <button
              className="banner-buttons"
              onClick={handleArchiveDataPlanet}
            >
              Archive Planet
            </button>
          </div>

          <div className="management-button-wrapper mobile-button-wrapper-left-side">
            <button className="banner-buttons" onClick={handlePastPlanet}>
              ET
            </button>
            <button
              className="banner-buttons"
              onClick={handleArchiveDataPlanet}
            >
              A
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Planet;
