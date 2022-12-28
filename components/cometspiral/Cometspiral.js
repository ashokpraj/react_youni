import Router from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import cometImg from "../../style/assets/images/youni-comet-img.png";
import Showcomet from "../modals/Showcomet";

function Cometspiral({ cometsCount, comets, userId, cometAlldataOfUsers }) {
  const dispatch = useDispatch();
  const pageNumber = 1;
  let PageSize = 10;
  const [showCometModal, setShowCometModal] = useState(false);

  const handleCometClick = () => {
    setShowCometModal(true);
  };

  const hideShowCometModal = () => {
    setShowCometModal(false);
  };

  return (
    <>
      {cometsCount > 0 && (
        <Showcomet
          setShowCometModal={showCometModal}
          comets={comets}
          totalCometsCount={cometsCount}
          hideModal={hideShowCometModal}
          cometsCount={cometsCount}
          userId={userId}
          pageNumber={pageNumber}
          cometAlldataOfUsers={cometAlldataOfUsers}
        />
      )}

      <div className="first-spiral">
        <span
          id="circle-img-1"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-2"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>

        <span
          id="circle-img-3"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-4"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-5"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Stars</div>
        </span>
        <span
          id="circle-img-6"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-7"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-8"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-9"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
      </div>
      <div className="second-spiral">
        <span
          id="circle-img-10"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>

        {cometsCount === 0 ? (
          <span
            id="circle-img-11"
            className="circle-image"
            style={{ backgroundImage: `url(${cometImg.src})` }}
          >
            <div className="project-name">Comet</div>
          </span>
        ) : (
          <span
            id="circle-img-11"
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

        <span
          id="circle-img-12"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-13"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-14"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-15"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-16"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-17"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-18"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
      </div>
      <div className="third-spiral">
        <span
          id="circle-img-19"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-20"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-21"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-22"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-23"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-24"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-25"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-26"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
        <span
          id="circle-img-27"
          className="circle-image"
          style={{ backgroundImage: `url(${cometImg.src})` }}
        >
          <div className="project-name">Comet</div>
        </span>
      </div>
    </>
  );
}

export default Cometspiral;
