import Router from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getAllCometsByUserId } from "../../redux/actions/comet";
import { projectsAllData } from "../../redux/actions/dashboard";
import circleImage from "../../style/assets/images/youni-circle-img.png";
import cometImg from "../../style/assets/images/youni-comet-img.png";
import Showcomet from "../modals/Showcomet";
import ShowProjects from "../modals/ShowProjects";

function Spiral({
  cometsCount,
  projectsData,
  starCounts,
  userId,
  comets,
  cometAlldataOfUsers,
  firstStarData,
}) {
  const dispatch = useDispatch();
  const [showCometModal, setShowCometModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const pageNumber = 1;
  const PageSize = 10;

  const handleStarClick = () => {
    setShowModal(true);
  };
  const hideShowStarModal = () => {
    setShowModal(false);
  };

  const handleCometClick = () => {
    setShowCometModal(true);
  };

  const hideShowCometModal = () => {
    setShowCometModal(false);
  };

  const chnageCometPage = (e) => {
    dispatch(getAllCometsByUserId(e, PageSize, userId));
  };

  // Single Double Click
  let timer = 0;
  let delay = 200;
  let prevent = false;

  const handleClicks = (firstStarData) => {
    timer = setTimeout(() => {
      if (!prevent) {
        Router.push({
          pathname: '/planet',
          query: { projectId: firstStarData }
      }, '/planet');
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
      {showModal === true && (
        <ShowProjects
          setShowModal={showModal}
          projects={projectsData}
          hideModal={hideShowStarModal}
          starCounts={starCounts}
          pageNumber={pageNumber}
          userId={userId}
        />
      )}
      {cometsCount > 0 && (
        <Showcomet
          setShowCometModal={showCometModal}
          comets={comets}
          totalCometsCount={cometsCount}
          hideModal={hideShowCometModal}
          cometsCount={cometsCount}
          handleCometChange={chnageCometPage}
          userId={userId}
          pageNumber={pageNumber}
          cometAlldataOfUsers={cometAlldataOfUsers}
        />
      )}

      <div className="first-spiral">
        <span
          id="circle-img-1"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>

        {projectsData.length === 1 ? (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
              cursor: "pointer",
            }}
            onClick={() => handleClicks(firstStarData)}
            onDoubleClick={() => handleDoubleClick()}
          >
            <div className="project-name">
              {projectsData.length === 0 ? (
                "Stars"
              ) : projectsData.length === 1 ? (
                <a type="button"> {starCounts} Star</a>
              ) : (
                starCounts + " Stars"
              )}
            </div>
          </span>
        ) : projectsData.length === 0 ? (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{ backgroundImage: `url(${circleImage.src})` }}
          >
            <div className="project-name">Stars</div>
          </span>
        ) : (
          <span
            id="circle-img-2"
            className="circle-image"
            style={{
              backgroundImage: `url(${circleImage.src})`,
              cursor: "pointer",
            }}
            onClick={() => handleStarClick()}
          >
            <div className="project-name">{starCounts} Stars</div>
          </span>
        )}
        {/* {starCounts === 0 ? (
                  <span
                    id="circle-img-2"
                    className="circle-image"
                    style={{
                      backgroundImage: `url(${circleImage.src})`,
                    }}
                  >
                    <div className="project-name">Stars</div>
                  </span>
                ) : (
                  <span
                    id="circle-img-2"
                    className="circle-image"
                    style={{
                      backgroundImage: `url(${circleImage.src})`,
                      cursor: "pointer",
                    }}
                    onClick={() => handleClicks(firstStarData)}
                    onDoubleClick={handleDoubleClick}
                    // onClick={() => handleStarClick()}
                  >
                    <div className="project-name">
                      {starCounts === 0 ? (
                        "Stars"
                      ) : starCounts === 1 ? (
                        <a type="button"> {starCounts} Star</a>
                      ) : (
                        starCounts + " Stars"
                      )}
                    </div>
                  </span>
                )} */}
        <span
          id="circle-img-3"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-4"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-5"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-6"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-7"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        {cometsCount === 0 ? (
          <span
            id="circle-img-8"
            className="circle-image"
            style={{ backgroundImage: `url(${cometImg.src})` }}
          >
            <div className="project-name">Comet</div>
          </span>
        ) : (
          <span
            id="circle-img-8"
            className="circle-image"
            style={{
              backgroundImage: `url(${cometImg.src})`,
              cursor: "pointer",
            }}
            onClick={() => handleCometClick()}
          >
            <div className="project-name">
              {cometsCount ? cometsCount + " Comet" : " Comet"}
            </div>
          </span>
        )}
      </div>

      <div className="second-spiral">
        <span
          id="circle-img-9"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-10"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-11"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-12"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-13"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-14"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-15"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-16"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
      </div>
      <div className="third-spiral">
        <span
          id="circle-img-17"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-18"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-19"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-20"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-21"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-22"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-23"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-24"
          className="circle-image"
          style={{ backgroundImage: `url(${circleImage.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
      </div>
    </>
  );
}

export default Spiral;
