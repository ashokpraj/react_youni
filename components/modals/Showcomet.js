import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import Router from "next/router";
import Image from "next/image";
import viewPlanetIcon from "../../style/assets/images/view-icon.svg";
import editStarIcon from "../../style/assets/images/edit-icon.svg";
import deletIcon from "../../style/assets/images/delete-icon.svg";
import completedIcon from "../../style/assets/images/checkmark-icon.svg";
import { useDispatch } from "react-redux";
import {
  addArchiveCometsOfUser,
  deleteComet,
  getAllCometsByUserId,
  selectedComet,
} from "../../redux/actions/comet";
import Showcometdetials from "./Showcometdetials";
import Deletemodal from "./Deletemodal";
import { async } from "@firebase/util";
import skypeIcon from "../../style/assets/images/skype-icon.svg";

const Showcomet = ({
  setShowCometModal,
  comets,
  hideModal,
  cometsCount,
  userId,
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  let PageSize = 10;

  const showPages = Math.ceil(cometsCount / PageSize);
  const [cometId, setCometId] = useState();
  const dispatch = useDispatch();
  const [slugValue, setSlugValue] = useState("");
  const [showModalSecond, setShowModalSecond] = useState(false);
  const [showComeDetailModal, setShowComeDetailModal] = useState(false);
  const [cometViewId, setCometViewId] = useState("");

  let URL = "";
  const id = userId?.toString();

  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span
          key={i}
          onClick={() => {
            setPageNumber(i);
            dispatch(getAllCometsByUserId(i, PageSize, userId));
          }}
        >
          {i}
        </span>
      );
    }

    return td;
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    URL = window.location.href.split("/");
    setSlugValue(URL[3]);
  }, [comets]);

  const handleEditSubmit = (cometId) => {
    setCometId(cometId);
    Router.push({
      pathname: '/comet',
      query: { cometId: cometId }
    }, '/comet');

    hideModal();
  };

  const [deltedId, setDeletedId] = useState();

  const handleDeleteComet = (cometId) => {
    setShowModalSecond(true);
    setDeletedId(cometId);
  };

  const hideDeletePopup = () => {
    setShowModalSecond(false);
  };

  const handleViewComet = (cometId) => {
    setShowComeDetailModal(true);
    setCometViewId(cometId);
  };

  const hideCometDetails = () => {
    setShowComeDetailModal(false);
  };

  //Mark as Done click event
  const handleMarkasDone = (item) => {
    const sendData = {
      cometId: Number(item.cometId),
      isArchive: true,
      userId: item.createdBy,
    };

    const type = "add";
    dispatch(addArchiveCometsOfUser(sendData, type, pageNumber, PageSize));
  };

  return (
    <>
      <Showcometdetials
        setShowComeDetailModal={showComeDetailModal}
        hideDetailsModal={hideCometDetails}
        cometViewId={cometViewId}
      />
      <Modal
        show={setShowCometModal}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Comets Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Comet Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comets.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.cometName}</td>
                    <td>
                      {moment(item.startDateTime).format("DD-MM-yyyy h:mm A")}
                    </td>
                    <td>
                      {" "}
                      {moment(item.endDateTime).format("DD-MM-yyyy h:mm A")}
                    </td>
                    <td>
                      {item.alarmDateTime &&
                        moment(item.alarmDateTime).format("DD-MM-yyyy h:mm A")}
                    </td>
                    <td>
                      <a
                        href="#"
                        className="popup-redirect-links view-icon"
                        onClick={() => handleViewComet(item.cometId)}
                      >
                        <Image
                          src={viewPlanetIcon}
                          className="view-icon"
                          alt="view moon icon"
                        />
                      </a>
                    </td>
                    {item?.createdBy === Number(userId) ? (
                      <td>
                        <a
                          href="#"
                          className="popup-redirect-links edit-icon"
                          onClick={() => handleEditSubmit(item.cometId)}
                        >
                          <Image
                            src={editStarIcon}
                            className="edit-icon"
                            alt="edit icon"
                          />
                        </a>
                      </td>
                    ) : (
                      <td>&nbsp;</td>
                    )}

                    {item.createdBy === Number(userId) ? (
                      <td>
                        {" "}
                        <a
                          href="#"
                          className="popup-redirect-links delete-icon"
                          onClick={() => handleDeleteComet(item.cometId)}
                        >
                          <Image
                            src={deletIcon}
                            className="delete-icon"
                            alt="delete icon"
                          />
                        </a>
                      </td>
                    ) : (
                      <td>&nbsp;</td>
                    )}
                    {item.createdBy === Number(userId) ? (
                      <td>
                        <button
                          style={{ cursor: "pointer" }}
                          className="popup-redirect-links completed-icon"
                          onClick={() => handleMarkasDone(item)}
                        >
                          <Image
                            src={completedIcon}
                            className="completed-icon"
                            alt="done icon"
                          />
                        </button>
                      </td>
                    ) : (
                      <td>&nbsp;</td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {cometsCount > 10 ? (
            <>
              <div className="pagination">{renderTD()}</div>
            </>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {showModalSecond && (
        <Deletemodal
          showPopup={showModalSecond}
          onHide={hideDeletePopup}
          deltedId={deltedId}
          pageNumber={pageNumber}
          PageSize={PageSize}
          clickKey="comet"
          count = {cometsCount}
        />
      )}
    </>
  );
};

export default Showcomet;
