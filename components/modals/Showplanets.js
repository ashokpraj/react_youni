import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import viewPlanetIcon from "../../style/assets/images/view-icon.svg";
import editStarIcon from "../../style/assets/images/edit-icon.svg";
import deletIcon from "../../style/assets/images/delete-icon.svg";
import {
  addArchivePlanetsOfUser,
  planetsByProjectAllData,
} from "../../redux/actions/planet";
import { useDispatch } from "react-redux";
import completedIcon from "../../style/assets/images/checkmark-icon.svg";
import { selectedPlanet } from "../../redux/actions/planet";
import Deletemodal from "./Deletemodal";
import skypeIcon from "../../style/assets/images/skype-icon.svg";

const Showplanets = ({
  setShowModal,
  hideModal,
  planets,
  userId,
  projectID,
  planetsData,
}) => {
  const handleSubmit = (planetId) => {
    Router.push({
      pathname: '/moon',
      query: { planetId: planetId }
  }, '/moon');
  };

  const [projectId, setProjectId] = useState();
  let PageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);
  const showPages = Math.ceil(planetsData?.length / PageSize);
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    if (query.projectId) {
      setProjectId(query.setProjectId);
    }
  }, [router.query]);

  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span
          key={i}
          onClick={() => {
            setPageNumber(i);
            dispatch(planetsByProjectAllData(i, PageSize, projectID));
          }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const [planetId, setPlanetId] = useState();
  const dispatch = useDispatch();

  const handleEditSubmit = (planetId) => {
    setPlanetId(planetId);
    Router.push({
      pathname: '/moon',
      query: { editplanetID: planetId }
  }, '/moon');
    hideModal();
  };

  const [deltedId, setDeletedId] = useState();
  const [showModalSecond, setShowModalSecond] = useState(false);

  const handleDeletePlanet = (planetId) => {
    setShowModalSecond(true);
    setDeletedId(planetId);
  };

  const hideDeletePopup = () => {
    setShowModalSecond(false);
  };

  //Mark as Done click event
  const handleMarkasDone = (item) => {
    const sendData = {
      planettId: Number(item.planetId),
      isArchive: true,
      userId: item.createdBy,
    };

    // console.log("projectId :::", projectID);
    // return;
    const type = "add";
    dispatch(
      addArchivePlanetsOfUser(sendData, type, pageNumber, PageSize, projectID)
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
          <Modal.Title>Planet Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Planet Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {planets?.length > 0 ? (
                planets.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.planetName}</td>
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
                          style={{ cursor: "pointer" }}
                          className="popup-redirect-links view-icon"
                          onClick={() => handleSubmit(item.planetId)}
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
                            style={{ cursor: "pointer" }}
                            className="popup-redirect-links edit-icon"
                            onClick={() => handleEditSubmit(item.planetId)}
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
                            style={{ cursor: "pointer" }}
                            className="popup-redirect-links delete-icon"
                            onClick={() => handleDeletePlanet(item.planetId)}
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
          {planetsData?.length > 10 ? (
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
          clickKey="planet"
          projectID={projectID}
          count = {planetsData}
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
            Delete Planet{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 className="popup-title">
            Do you really want to delete this planet ?
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

export default Showplanets;
