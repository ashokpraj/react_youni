import React, { useState } from "react";
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
  addArchiveMoonsOfUser,
  moonsByPlanetAllData,
  selectedMoon,
} from "../../redux/actions/moon";
import Deletemodal from "./Deletemodal";
import skypeIcon from "../../style/assets/images/skype-icon.svg";

const Showmoon = ({
  setShowModal,
  hideModal,
  moons,
  userId,
  moonDataByPlanetId,
  planetId,
}) => {
  const dispatch = useDispatch();

  const handleSubmit = (moonId) => {
    Router.push({
      pathname: '/satellite',
      query: { moonId: moonId }
  }, '/satellite');
    // Router.push(`/satellite?moonId=${moonId}`);
  };

  let PageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);
  const showPages = Math.ceil(moonDataByPlanetId?.length / PageSize);

  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span
          key={i}
          onClick={() => {
            setPageNumber(i);
            dispatch(moonsByPlanetAllData(i, PageSize, planetId));
          }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const [moonId, setMoonId] = useState();
  const handleEditSubmit = (moonId) => {
    setMoonId(moonId);
    Router.push({
      pathname: '/satellite',
      query: { editMoonId: moonId }
  }, '/satellite');
    hideModal();
  };

  const [deltedId, setDeletedId] = useState();
  const [showModalSecond, setShowModalSecond] = useState(false);

  const handleDeleteMoon = (moonId) => {
    setShowModalSecond(true);
    setDeletedId(moonId);
  };

  const hideDeletePopup = () => {
    setShowModalSecond(false);
  };

  //Mark as Done click event
  const handleMarkasDone = (item) => {
    const sendData = {
      moonId: Number(item.moonId),
      isArchive: true,
      userId: item.createdBy,
    };
    const type = "add";

    dispatch(
      addArchiveMoonsOfUser(sendData, type, pageNumber, PageSize, planetId)
    );
  };

  return (
    <>
      <Modal
        show={setShowModal}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Moons Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Moon Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {moons?.length > 0 ? (
                moons.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.moonName}</td>
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
                        {" "}
                        <button
                          href="#"
                          className="popup-redirect-links view-icon"
                          onClick={() => handleSubmit(item.moonId)}
                        >
                          <Image
                            src={viewPlanetIcon}
                            className="view-icon"
                            alt="view moon icon"
                          />
                        </button>
                      </td>
                      {item.createdBy === userId ? (
                        <td>
                          {" "}
                          <button
                            href="#"
                            className="popup-redirect-links edit-icon"
                            onClick={() => handleEditSubmit(item.moonId)}
                          >
                            <Image
                              src={editStarIcon}
                              className="edit-icon"
                              alt="edit icon"
                            />
                          </button>
                        </td>
                      ) : (
                        <td>&nbsp;</td>
                      )}

                      {item.createdBy === userId ? (
                        <td>
                          {" "}
                          <button
                            href="#"
                            className="popup-redirect-links delete-icon"
                            onClick={() => handleDeleteMoon(item.moonId)}
                          >
                            <Image
                              src={deletIcon}
                              className="delete-icon"
                              alt="delete icon"
                            />
                          </button>
                        </td>
                      ) : (
                        <td>&nbsp;</td>
                      )}
                      {item.createdBy === userId ? (
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
                })
              ) : (
                <td colSpan="4" className="no-record-found">
                  No record found
                </td>
              )}
            </tbody>
          </table>
          {moonDataByPlanetId?.length > 10 ? (
            <div className="pagination">{renderTD()}</div>
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

      {showModalSecond === true && (
        <Deletemodal
          showPopup={showModalSecond}
          onHide={hideDeletePopup}
          deltedId={deltedId}
          pageNumber={pageNumber}
          PageSize={PageSize}
          clickKey="moon"
          planetId={planetId}
          count = {moonDataByPlanetId}
        />
      )}
    </>
  );
};

export default Showmoon;
