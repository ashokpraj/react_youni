import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import Router from "next/router";
import Image from "next/image";
import viewPlanetIcon from "../../style/assets/images/view-icon.svg";
import editStarIcon from "../../style/assets/images/edit-icon.svg";
import deletIcon from "../../style/assets/images/delete-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  addArchiveSatellitesOfUser,
  getSatelliteByMoon,
  getSatelliteDeailsById,
  selectedSatellite,
} from "../../redux/actions/satellite";
import completedIcon from "../../style/assets/images/checkmark-icon.svg";
import Showdetails from "./Showdetails";
import Satelliteview from "./Satelliteview";
import Deletemodal from "./Deletemodal";
import skypeIcon from "../../style/assets/images/skype-icon.svg";

const Showsatellite = ({
  setShowModal,
  hideModal,
  satellites,
  moonId,
  userId,
  satelliteOfAllPlanets,
}) => {
  const dispatch = useDispatch();
  const [sateliteId, setSateliteId] = useState();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const signleStelliteImage = useSelector(
    (state) => state.satellite.satelliteAttachments
  );
  const [showSatelliteModal, setShowSatelliteModal] = useState(false);
  const [showSatelliteId, setShowSatelliteId] = useState();

  let PageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);
  const showPages = Math.ceil(satelliteOfAllPlanets?.length / PageSize);
  const singleDatas = useSelector((state) => state.satellite.signleSatellite);

  const handleSubmit = (sateliteId) => {
    setShowSatelliteModal(true);
    setShowSatelliteId(sateliteId);
  };

  const hideShowSatelliteModal = () => {
    setShowSatelliteModal(false);
  };
  const singleSatelliteData = useSelector(
    (state) => state.satellite.satelliteAttachments
  );

  const singleSatelliteTeamData = useSelector(
    (state) => state.satellite.satelliteTeams
  );

  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span
          key={i}
          onClick={() => {
            setPageNumber(i);
            dispatch(getSatelliteByMoon(i, PageSize, moonId));
          }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const handleEditSubmit = (sateliteId) => {
    dispatch(getSatelliteDeailsById(sateliteId));

    setShowDetailModal(false);
    setSateliteId(sateliteId);
    Router.push({
      pathname: '/satellite',
      query: { satelliteId: sateliteId }
    }, '/satellite');
    hideModal();
  };

  const hideShowDetailsModal = () => {
    setShowDetailModal(false);
  };

  const [deltedId, setDeletedId] = useState();
  const [showModalSecond, setShowModalSecond] = useState(false);

  const handleDeleteMoon = (sateliteId) => {
    setShowModalSecond(true);
    setDeletedId(sateliteId);
  };

  const hideDeletePopup = () => {
    setShowModalSecond(false);
  };

  //Mark as Done click event
  const handleMarkasDone = (item) => {
    const sendData = {
      sateliteId: Number(item.sateliteId),
      isArchive: true,
      userId: item.createdBy,
    };
    const type = "add";
    dispatch(
      addArchiveSatellitesOfUser(sendData, type, pageNumber, PageSize, moonId)
    );
  };

  return (
    <>
      <Satelliteview
        setShowSatelliteModal={showSatelliteModal}
        hideShowSatelliteModal={hideShowSatelliteModal}
        showSatelliteId={showSatelliteId}
      />
      <Showdetails
        setShowDetailModal={showDetailModal}
        hideDetailsModal={hideShowDetailsModal}
        sateliteId={sateliteId}
        allSatelliteliteData={singleSatelliteData}
        click="allSatelliteliteData"
        signleStelliteImage={signleStelliteImage}
        singleSatelliteTeamData={singleSatelliteTeamData}
        singleDatas={singleDatas}
      />
      <Modal
        show={setShowModal}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Satellites Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Satellite Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {satellites?.length > 0 ? (
                satellites.map((item) => {
                  return (
                    <tr>
                      <td>{item.sateliteName}</td>
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
                          onClick={() => handleSubmit(item.sateliteId)}
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
                            onClick={() => handleEditSubmit(item.sateliteId)}
                          >
                            <Image
                              src={editStarIcon}
                              className="edit-icon"
                              alt="edit icon"
                            />
                          </button>
                        </td>
                      ) : (
                        ""
                      )}

                      {item.createdBy === userId ? (
                        <td>
                          {" "}
                          <button
                            href="#"
                            className="popup-redirect-links delete-icon"
                            onClick={() => handleDeleteMoon(item.sateliteId)}
                          >
                            <Image
                              src={deletIcon}
                              className="delete-icon"
                              alt="delete icon"
                            />
                          </button>
                        </td>
                      ) : (
                        ""
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
          {satelliteOfAllPlanets?.length >= 10 ? (
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
          clickKey="satellite"
          moonId={moonId}
          count = {satelliteOfAllPlanets}
        />
      )}

      {/* <Modal
        show={showModalSecond}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="new-star-popup-details common-popup-details"
      >
        <Modal.Header closeButton onClick={() => setShowModalSecond(false)}>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Satellite{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 className="popup-title">
            Do you really want to delete this satellite ?
          </h2>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => mainDeleteHandle()}>Yes</Button>
          <Button onClick={() => setShowModalSecond(false)}>close</Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default Showsatellite;
