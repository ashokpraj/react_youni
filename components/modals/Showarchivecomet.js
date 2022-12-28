import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addArchiveCometsOfUser,
  getArchiveAllComtes,
  getArchiveAllComtesUsers,
} from "../../redux/actions/comet";
import deletIcon from "../../style/assets/images/delete-icon.svg";

const Showarchivecomet = ({ setShowArchiveComets, hideModal }) => {
  const archiveCometsOfUsers = useSelector(
    (state) => state.comet.archiveCometsOfUser
  );

  const archiveCometsData = useSelector(
    (state) => state.comet.archiveCometData
  );

  const [pageNumber, setPageNumber] = useState(1);
  let PageSize = 10;
  const showPages = Math.ceil(archiveCometsOfUsers?.length / PageSize);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserId(userData.userID);
      // dispatch(getArchiveAllComtesUsers(userData.userID));
      // dispatch(getArchiveAllComtes(pageNumber, PageSize, userData.userID));
    }
  }, []);

  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span
          key={i}
          onClick={() => {
            setPageNumber(i);
            dispatch(getArchiveAllComtes(i, PageSize, userId));
          }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const handleUnarchiveSubmit = (e) => {
    const sendData = {
      cometId: e,
      isArchive: false,
      userId: userId,
    };

    dispatch(addArchiveCometsOfUser(sendData, "", pageNumber, PageSize));
    // hideModal();
  };

  return (
    <>
      <Modal
        show={setShowArchiveComets}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Archive Comets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Comet Name</th>
                <th>Start Datetime</th>
                <th>End Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archiveCometsData?.length > 0 ? (
                archiveCometsData.map((item, index) => {
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
                        {item.alarmDateTime && moment(item.alarmDateTime).format("DD-MM-yyyy h:mm A")}
                      </td>
                      <td>
                        {" "}
                        <a
                          href="#"
                          className="popup-redirect-links delete-icon"
                          onClick={() => handleUnarchiveSubmit(item.cometId)}
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
                <td colspan="4" className="no-record-found">
                  No record found
                </td>
                // hideModal()
              )}
            </tbody>
          </table>
          {archiveCometsOfUsers > 10 ? (
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

export default Showarchivecomet;
