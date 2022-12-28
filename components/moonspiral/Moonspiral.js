import Router from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { moonsByPlanetAllData } from "../../redux/actions/moon";
import circleImage from "../../style/assets/images/youni-moon-img.png";
import Showmoon from "../modals/Showmoon";

function Moonspiral({
  moons,
  planetId,
  userId,
  moonDataByPlanetId,
  firstMoonData,
  starName,
  starId,
}) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const pageNumber = 1;
  let PageSize = 10;

  if (starName && starId) {
    localStorage.setItem("projectName", starName);
    localStorage.setItem("starId", starId);
  }
  // Single Double Click
  let timer = 0;
  let delay = 200;
  let prevent = false;

  const changePage = (e) => {
    dispatch(moonsByPlanetAllData(e, PageSize, planetId));
  };

  const handleSingelClick = (firstStarData) => {
    timer = setTimeout(() => {
      if (!prevent) {
        Router.push({
          pathname: '/satellite',
          query: { moonId: firstMoonData }
      }, '/satellite');
      }
      prevent = false;
    }, delay);
  };

  const handleDoubleClick = () => {
    clearTimeout(timer);
    prevent = true;
    setShowModal(true);
  };

  const hidePlanetModal = () => {
    setShowModal(false);
  };

  const handleMoonClick = () => {
    setShowModal(true);
  };

  return (
    <>
      {" "}
      <div className="first-spiral">
        {moons?.length === 1 ? (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
              cursor: "pointer",
            }}
            onClick={() => handleSingelClick(firstMoonData)}
            onDoubleClick={() => handleDoubleClick()}
          >
            <div className="project-name">
              <a type="button"> {moons?.length} Moon</a>
            </div>
          </span>
        ) : moons?.length === 0 ? (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
            }}
          >
            {" "}
            <div className="project-name"> Moon</div>
          </span>
        ) : (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
              cursor: "pointer",
            }}
            onClick={() => handleMoonClick()}
          >
            {" "}
            <div className="project-name">{moons?.length} Moon</div>
          </span>
        )}

        {moons?.length > 0 && (
          <Showmoon
            setShowModal={showModal}
            moons={moons}
            hideModal={hidePlanetModal}
            handlePageChange={changePage}
            pageNumber={pageNumber}
            planetId={planetId}
            userId={userId}
            moonDataByPlanetId={moonDataByPlanetId}
            starName={starName}
          />
        )}
      </div>
      <div className="second-spiral">
        <span
          id="circle-img-11"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Moon</div>
        </span>
        <span
          id="circle-img-18"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Moon</div>
        </span>
      </div>
      <div className="third-spiral">
        <span
          id="circle-img-25"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Moon</div>
        </span>
      </div>
      <div className="fourth-spiral">
        <span
          id="circle-img-29"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Moon</div>
        </span>
      </div>
    </>
  );
}

export default Moonspiral;
