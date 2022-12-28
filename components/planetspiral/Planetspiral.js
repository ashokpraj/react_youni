import Router from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { planetsByProjectAllData } from "../../redux/actions/planet";
import circleImage from "../../style/assets/images/youni-planet-img.png";
import Showplanets from "../modals/Showplanets";

function Planetspiral({
  planets,
  userId,
  projectID,
  planetsData,
  firstPlanet,
}) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const pageNumber = 1;
  let PageSize = 10;
  const handlePlanetClick = () => {
    setShowModal(true);
  };

  const hidePlanetModal = () => {
    setShowModal(false);
  };

  // Single Double Click
  let timer = 0;
  let delay = 200;
  let prevent = false;

  const handleSingelClick = (firstPlanet) => {
    timer = setTimeout(() => {
      if (!prevent) {
        Router.push({
          pathname: '/moon',
          query: { planetId: firstPlanet }
      }, '/moon');
      }
      prevent = false;
    }, delay);
  };
  const handleDoubleClick = () => {
    clearTimeout(timer);
    prevent = true;
    setShowModal(true);
  };

  return (
    <>
      <div className="first-spiral">
        {planets?.length === 1 ? (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
              cursor: "pointer",
            }}
            onClick={() => handleSingelClick(firstPlanet)}
            onDoubleClick={() => handleDoubleClick()}
          >
            <div className="project-name">
              <a type="button">{planetsData?.length} Planet</a>
            </div>
            {/* <div className="project-name">
                      {planets.length === 0 ? (
                        <a>{planets.length} Planet</a>
                      ) : (
                        planets.length + " Planets"
                      )}
                    </div> */}
          </span>
        ) : planets?.length === 0 ? (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
            }}
          >
            {" "}
            <div className="project-name">Planet</div>
          </span>
        ) : (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
              cursor: "pointer",
            }}
            onClick={() => handlePlanetClick()}
          >
            {" "}
            <div className="project-name">
              {/* {planets.length > 0 ? planets.length : ""} Planet */}
              {planetsData?.length} Planet
            </div>
          </span>
        )}

        {planets?.length > 0 && (
          <Showplanets
            setShowModal={showModal}
            planets={planets}
            hideModal={hidePlanetModal}
            pageNumber={pageNumber}
            userId={userId}
            projectID={projectID}
            planetsData={planetsData}
          />
        )}
      </div>
      <div className="second-spiral">
        <span
          id="circle-img-11"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Planet </div>
        </span>
        <span
          id="circle-img-16"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Planet </div>
        </span>
      </div>
      <div className="third-spiral">
        <span
          id="circle-img-19"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Planet </div>
        </span>
      </div>
      <div className="fourth-spiral">
        <span
          id="circle-img-29"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Planet </div>
        </span>
      </div>
    </>
  );
}

export default Planetspiral;
