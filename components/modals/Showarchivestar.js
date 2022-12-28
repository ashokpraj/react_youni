import moment from "moment";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addArchiveStarsOfUser,
  deleteStar,
  getArchiveStars,
} from "../../redux/actions/star";
import deletIcon from "../../style/assets/images/delete-icon.svg";

const Showarchivestar = ({ setShowArchiveStar, hideModal }) => {
  const [showModalSecond, setShowModalSecond] = useState(false);

  const archiveStarsOfUsers = useSelector(
    (state) => state.star.archiveStarsOfUser
  );

  const archiveStarsData = useSelector((state) => state.star.archiveStars);
  const [deltedId, setDeletedId] = useState();

  const [pageNumber, setPageNumber] = useState(1);
  let PageSize = 10;
  const showPages = Math.ceil(archiveStarsOfUsers / PageSize);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserId(userData.userID);
      dispatch(getArchiveStars(pageNumber, PageSize, userData.userID));
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
            dispatch(getArchiveStars(i, PageSize, userId));
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
      projectId: e,
      isArchive: false,
      userId: userId,
    };
    dispatch(addArchiveStarsOfUser(sendData, "", pageNumber, PageSize,archiveStarsOfUsers));
  };

  const mainDeleteHandle = () => {
    dispatch(deleteStar(deltedId, pageNumber, PageSize, userId));
    setShowModalSecond(false);
    hideModal();
  };

  return (
    <>
      <Modal
        show={setShowArchiveStar}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Archive Stars</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Star Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archiveStarsData?.length > 0 ? (
                archiveStarsData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.projectName}</td>
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
                          onClick={() => handleUnarchiveSubmit(item.projectId)}
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
          {archiveStarsOfUsers > 10 ? (
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

      <Modal
        show={showModalSecond}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton onClick={() => setShowModalSecond(false)}>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Star{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you really want to delete this star ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => mainDeleteHandle()}>Yes</Button>
          <Button onClick={() => setShowModalSecond(false)}>close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Showarchivestar;
