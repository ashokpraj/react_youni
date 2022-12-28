import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addArchivePlanetsOfUser,
  getArchivePlanets,
} from "../../redux/actions/planet";

import deletIcon from "../../style/assets/images/delete-icon.svg";

const Showarchiveplanet = ({ setShowArchivePlanet, hideModal, projectId }) => {
  const archivePlanetsOfUsers = useSelector(
    (state) => state.planet.archivePlanetsOfUsers
  );

  const archivePlanetsData = useSelector(
    (state) => state.planet.archivePlanetsData
  );

  const router = useRouter();
  const query = router.query;

  const [pageNumber, setPageNumber] = useState(1);
  let PageSize = 10;
  const showPages = Math.ceil(archivePlanetsData?.length / PageSize);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserId(userData.userID);
      // dispatch(getArchivePlanets(query.projectId));

      if (query.projectId) {
        // dispatch(getArchivePlanets(pageNumber, PageSize, query.projectId));
      }
    }
  }, []);

  // const handleStarChange = (e) => {
  //   dispatch(getArchivePlanets(e, PageSize, projectId));
  // };

  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span
          key={i}
          onClick={() => {
            setPageNumber(i);
            dispatch(getArchivePlanets(i, PageSize, projectId));
          }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const handleUnarchiveSubmit = (ids, projectId) => {
    const sendData = {
      planettId: ids,
      isArchive: false,
      userId: userId,
    };

    // console.log("e :::", sendData);
    // return;
    dispatch(
      addArchivePlanetsOfUser(sendData, "", pageNumber, PageSize, projectId)
    );
    // hideModal();
  };

  return (
    <>
      <Modal
        show={setShowArchivePlanet}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Archive Planets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Planet Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archivePlanetsData?.length > 0 ? (
                archivePlanetsData?.map((item, index) => {
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
                        {item.alarmDateTime && moment(item.alarmDateTime).format("DD-MM-yyyy h:mm A")}
                      </td>
                      <td>
                        <a
                          href="#"
                          className="popup-redirect-links delete-icon"
                          onClick={() =>
                            handleUnarchiveSubmit(item.planetId, item.projectId)
                          }
                        >
                          <Image
                            src={deletIcon}
                            className="view-icon"
                            alt="view icon"
                          />
                        </a>
                      </td>
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
          {archivePlanetsOfUsers > 10 ? (
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
    </>
  );
};

export default Showarchiveplanet;
