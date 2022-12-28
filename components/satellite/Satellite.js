import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import * as image from "../../public/imagesURL";
import BannerBigImg from "../../style/assets/images/bg-img.png";
import circleImage from "../../style/assets/images/youni-satellite-img.png";
import placeholderImg from "../../style/assets/images/youni-moon-img.png";
import satelliteIcon from "../../style/assets/images/satellite-icon.png";
import {
  chnageMoonPopupStateValue,
  chnageSatelliteopupStateValue,
} from "../../redux/actions/popup";
import Addsatellite from "../modals/Addsatellite";
import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import {
  getArchiveSatellite,
  getMoonDetailsById,
  getSatelliteByMoon,
  getSatelliteByMoonOfUser,
  getSatelliteImages,
  satelliteAllCountOfUser,
  getExpiredSatellitesData,
  getExpiredSatellitesDataOfUser,
  getProjectIdByPlanetId,
} from "../../redux/actions/satellite";
import Showdetails from "../modals/Showdetails";
import { getMoonImages } from "../../redux/actions/moon";
import Addmoon from "../modals/Addmoon";
import Showsatellitearchive from "../modals/Showsatellitearchive";
import Showexpiredsatellite from "../modals/Showexpiredsatellite";
import Satellitespiral from "../satellitespiral/Satellitespiral";

const Satellite = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const popupState = useSelector((state) => state.data.satelliteModal);
  const moonPopupState = useSelector((state) => state.data.moonModal);
  const [moonId, setMoonId] = useState();
  const [satelliteId, setSatelliteId] = useState();
  const singleSatelliteData = useSelector(
    (state) => state.satellite.signleSatellite
  );

  const moonsDetails = useSelector((state) => state.satellite.moonsData);
  const satellitedata = useSelector((state) => state.satellite.moonSatellite);

  //Signle Moon datas
  const moonTeams = useSelector((state) => state.moon.moonTeams);
  const moonImages = useSelector((state) => state.moon.moonAttachments);
  const [editMoonIDS, setEditMoonIDS] = useState();

  const satelliteImages = useSelector(
    (state) => state.satellite.satelliteAttachments
  );
  const sateliteCounts = useSelector(
    (state) => state.satellite.useSatelliteCount
  );

  const storeStarName = useSelector((state) => state.planet.projectName);
  const planetData = useSelector((state) => state.planet.signlePlanet);
  const satelliteOfAllPlanets = useSelector(
    (state) => state.satellite.staellitesOfPalnets
  );

  const [dispProject, setDispProject] = useState();
  const [projectID, setProjectID] = useState();
  const [starId, setStarId] = useState();
  const [dispPlanet, setDispPlanet] = useState();
  const [localMoonId, setLocalMoonId] = useState(); 
  let PageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);

  const [userId, setUserId] = useState();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStarName, setShowStarName] = useState();
  const createdStarId = moonsDetails?.createdBy;
  const [showArchiveSatellite, setShowArchiveSatellite] = useState(false);
  const [showExpiredSatellite, setShowExpiredSatellite] = useState(false);
  const expiredAllSatellitesAll = useSelector(
    (state) => state.satellite.expiredSatelliteDataAll
  );
  const totalExpiredAllSatellites = useSelector(
    (state) => state.satellite.expiredSatelliteData
  );
  const satellite = useSelector(
    (state) => state.satellite.moonsData?.createdBy
  );
  const user = useSelector((state) => state.signin.signin);

  const query = router.query;

  function checkAllURLConditions() {
    // if (Object.keys(query).length > 0) {
      if (query.satelliteId) {
        popupState = true;
        setSatelliteId(query.satelliteId);
        dispatch(chnageSatelliteopupStateValue(popupState));
        dispatch(getSatelliteImages(query.satelliteId));
      } else if (query.editMoonId) {
        moonPopupState = true;
        dispatch(chnageMoonPopupStateValue(moonPopupState));
        setEditMoonIDS(query.editMoonId || localMoonId);
        dispatch(getMoonDetailsById(query.editMoonId || localMoonId));
        // dispatch(getMoonTeamMember(query.editMoonId || localMoonId));
        dispatch(getMoonImages(query.editMoonId || localMoonId));
      } else if (query.moonId || localMoonId ) {
        setDispProject(localStorage.getItem("projectName"));
        setProjectID(localStorage.getItem("starId"));
        setMoonId(query.moonId || localMoonId);
        dispatch(getMoonDetailsById(query.moonId || localMoonId));
        dispatch(getSatelliteByMoon(pageNumber, PageSize, query.moonId || localMoonId));
        dispatch(getSatelliteByMoonOfUser(query.moonId || localMoonId));
      } else {
        // Router.push("/dashboard");
      }
    }
  // }

  useEffect(() => {
    if (!localStorage.getItem("projectName")) {
      localStorage.setItem("projectName", storeStarName);
      setShowStarName(localStorage.getItem("projectName"));
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserId(userData ? userData.userID : "");

    if (userData && userData.userID) {
      dispatch(satelliteAllCountOfUser(userData.userID));
    }

    if (popupState === true) {
      popupState = false;
      dispatch(chnageSatelliteopupStateValue(popupState));
    }
    if (query?.moonId) {
      localStorage.setItem("moonId", query.moonId);
      setLocalMoonId(query.moonId);
    }else if (localStorage.getItem("moonId")) {
      setLocalMoonId(localStorage.getItem("moonId"));
    }

    checkAllURLConditions();

    setStarId(localStorage.getItem("starId"));
  }, [dispatch, router.query, showStarName, localMoonId]);

  if (moonsDetails && moonsDetails?.planetId && planetData?.length === 0) {
    // dispatch(getPlanetDetailsById(moonsDetails.planetId));
  }

  const handleEditClick = (moonId) => {
    if (createdStarId === userId) {
      setShowDetailModal(false);
      Router.push({
        pathname: '/satellite',
        query: { editMoonId: moonId }
    }, '/satellite');
      moonPopupState = true;
      dispatch(chnageMoonPopupStateValue(moonPopupState));
    } else {
      setShowDetailModal(true);
    }
  };

  const hideShowDetailsModal = () => {
    setShowDetailModal(false);
  };

  const handlePlanetClik = (planetID) => {
    Router.push({
      pathname: '/moon',
      query: { planetId: planetID }
    }, '/moon');
  };

  const handleStarClik = (projectID) => {
    Router.push({
      pathname: '/planet',
      query: { projectId: projectID }
    }, '/planet');
  };

  const addSatelliteAPICall = () => {
      if (!popupState) {
        popupState = true;
        dispatch(chnageSatelliteopupStateValue(popupState));
      }
    }
  };

  const handleSatelliteArchiveData = () => {
    setShowArchiveSatellite(true);
    dispatch(getArchiveSatellite(pageNumber, PageSize, moonId || localMoonId));
  };

  const hideHandleArchiveSatellite = () => {
    setShowArchiveSatellite(false);
  };

  const handlePastSatellite = () => {
    setShowExpiredSatellite(true);
    dispatch(getExpiredSatellitesData(moonId || localMoonId));
    dispatch(getExpiredSatellitesDataOfUser(pageNumber, PageSize, moonId || localMoonId));
  };

  const hidePastSatellite = () => {
    setShowExpiredSatellite(false);
  };

  const changeTimings = (times) => {
    console.log("Timesssss :::", times);
  };

  return (
    <>
      <Showexpiredsatellite
        setExpiredPopup={showExpiredSatellite}
        hideModal={hidePastSatellite}
        totalExpiredAllSatellites={totalExpiredAllSatellites}
        expiredAllSatellitesAll={expiredAllSatellitesAll}
        moonId={moonId || localMoonId}
      />
      <Showsatellitearchive
        setShowArchiveSatellite={showArchiveSatellite}
        hideModal={hideHandleArchiveSatellite}
        moonId={moonId || localMoonId}
      />

      <Showdetails
        setShowDetailModal={showDetailModal}
        hideDetailsModal={hideShowDetailsModal}
        moonId={moonId || localMoonId}
        allMoonData={moonsDetails}
        click="allMoonData"
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
          popupState && !moonPopupState
            ? "main-page-content page-inner-content satellite-poup"
            : moonPopupState
              ? "main-page-content page-inner-content moon-poup"
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
                  {satellite === user?.userid && (
                    <>
                      <li className="breadcrumb-item">
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => handleStarClik(projectID)}
                        >
                          {dispProject}
                        </a>
                      </li>
                      <li className="breadcrumb-item">
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handlePlanetClik(moonsDetails?.planetId)
                          }
                        >
                          {/* {planetData?.planetName} */}
                          {moonsDetails?.planetName}
                        </a>
                      </li>
                    </>
                  )}
                  {moonId ? (
                    <li className="breadcrumb-item">
                      <a>{moonsDetails?.moonName}</a>
                    </li>
                  ) : (
                    <li className="breadcrumb-item">
                      <a style={{ cursor: "pointer" }}>
                        {moonsDetails?.moonName}
                      </a>
                    </li>
                  )}
                </ol>
              </nav>
            </div>
            <div className="project-name-details">
              <h2 className="project-page-name">Your Satellite</h2>
            </div>
          </div>
          <div className="project-left-details inner-project-details">
            <div className="add-project-sec">
              {createdStarId === userId ? (
                <div className="add-project" onClick={addSatelliteAPICall}>
                  <div className="project-addition">
                    <a style={{ cursor: "pointer" }}>
                      <Image
                        src={satelliteIcon}
                        className="satellite-icon"
                        alt="satellite icon"
                      />
                      <span className="add-label">Add Satellite</span>
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

          {satelliteImages && satelliteId ? (
            <Addsatellite
              singleSatelliteData={singleSatelliteData}
              satelliteImages={satelliteImages}
              moonsId={moonId || localMoonId}
              satelliteId={satelliteId ? satelliteId : ""}
            />
          ) : (
            <Addsatellite
              moonId={moonId || localMoonId}
              pageNumber={pageNumber}
              PageSize={PageSize}
              popupState={popupState}
            />
          )}

          {editMoonIDS && (
            <Addmoon
              singleMoonData={moonsDetails}
              moonTeams={moonTeams}
              moonImages={moonImages}
              moonId={editMoonIDS}
            />
          )}

          <div className="banner-inner-spiral-wrapper satellite-page">
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
                className="center-circle-wrapper satellite-circle"
                onClick={() => handleEditClick(moonId || localMoonId)}
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
                    {moonsDetails?.moonName}
                  </h2>
                </div>
              </div>
              <Satellitespiral
                satellitedata={satellitedata}
                moonId={moonId || localMoonId}
                userId={userId}
                satelliteOfAllPlanets={satelliteOfAllPlanets}
              />
            </div>
          </div>

          <div className="management-button-wrapper">
            <button className="banner-buttons" onClick={handlePastSatellite}>
              Extendend
            </button>
            <button
              className="banner-buttons"
              onClick={handleSatelliteArchiveData}
            >
              Archive Satellite
            </button>
          </div>

          <div className="management-button-wrapper mobile-button-wrapper-left-side">
            <button className="banner-buttons" onClick={handlePastSatellite}>
              ET
            </button>
            <button
              className="banner-buttons"
              onClick={handleSatelliteArchiveData}
            >
              A
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Satellite;
