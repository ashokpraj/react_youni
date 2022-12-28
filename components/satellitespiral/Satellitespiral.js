import Router from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getSatelliteByMoon } from "../../redux/actions/satellite";
import circleImage from "../../style/assets/images/youni-satellite-img.png";
import Showsatellite from "../modals/Showsatellite";

function Satellitespiral({
  satellitedata,
  moonId,
  userId,
  satelliteOfAllPlanets,
}) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const pageNumber = 1;
  let PageSize = 10;

  const handleSatelliteClick = () => {
    setShowModal(true);
  };

  const hideSatelliteModal = () => {
    setShowModal(false);
  };

  const changePage = (e) => {
    dispatch(getSatelliteByMoon(e, PageSize, moonId));
  };

  return (
    <>
      {" "}
      <div className="first-spiral">
        {satellitedata?.length > 0 ? (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
              cursor: "pointer",
            }}
            onClick={() => handleSatelliteClick()}
          ></span>
        ) : (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
            }}
          ></span>
        )}
        {satellitedata?.length > 0 && (
          <Showsatellite
            setShowModal={showModal}
            satellites={satellitedata}
            hideModal={hideSatelliteModal}
            handlePageChange={changePage}
            pageNumber={pageNumber}
            moonId={moonId}
            userId={userId}
            satelliteOfAllPlanets={satelliteOfAllPlanets}
          />
        )}
        <span
          id="circle-img-4"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        ></span>
        <span
          id="circle-img-9"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        ></span>
      </div>
      <div className="second-spiral">
        <span
          id="circle-img-11"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        ></span>
        <span
          id="circle-img-18"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        ></span>
      </div>
      <div className="fourth-spiral">
        <span
          id="circle-img-29"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        ></span>
      </div>
    </>
  );
}

export default Satellitespiral;
