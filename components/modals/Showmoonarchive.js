import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addArchiveMoonsOfUser,
  getArchiveMoons,
  getArchiveMoonsOfUser,
} from "../../redux/actions/moon";

import deletIcon from "../../style/assets/images/delete-icon.svg";

const Showmoonarchive = ({ setShowArchiveMoon, hideModal, planetId }) => {
  const archiveMoonsOfUsers = useSelector(
    (state) => state.moon.archiveMoonsOfUser
  );
  const archiveMoonsData = useSelector((state) => state.moon.archiveMoonsData);
  let PageSize = 10;
  const [pageNumber, setPageNumber] = useState(1);

  const showPages = Math.ceil(archiveMoonsOfUsers?.length / PageSize);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const router = useRouter();
  const query = router.query;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserId(userData.userID);
    }
    if (query.planetId) {
      dispatch(getArchiveMoonsOfUser(query.planetId));
      dispatch(getArchiveMoons(pageNumber, PageSize, query.planetId ));
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
            dispatch(getArchiveMoons(i, PageSize, planetId));
          }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const handleUnarchiveSubmit = (moonId) => {
    const sendData = {
      moonId: moonId,
      isArchive: false,
      userId: userId,
    };

    // console.log("e :::", sendData);
    // return;
    dispatch(
      addArchiveMoonsOfUser(sendData, "", pageNumber, PageSize, planetId,archiveMoonsOfUsers)
    );
    // hideModal();
  };

  return (
    <>
      <Modal
        show={setShowArchiveMoon}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Archive Moons</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Moon Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archiveMoonsData?.length > 0 ? (
                archiveMoonsData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item?.moonName}</td>
                      <td>
                        {moment(item?.startDateTime).format(
                          "DD-MM-yyyy h:mm A"
                        )}
                      </td>
                      <td>
                        {" "}
                        {moment(item?.endDateTime).format("DD-MM-yyyy h:mm A")}
                      </td>
                      <td>
                        {item?.alarmDateTime && moment(item?.alarmDateTime).format(
                          "DD-MM-yyyy h:mm A"
                        )}
                      </td>
                      <td>
                        <a
                          href="#"
                          className="popup-redirect-links delete-icon"
                          onClick={() => handleUnarchiveSubmit(item?.moonId)}
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
              )}
            </tbody>
          </table>
          {archiveMoonsOfUsers?.length > 10 ? (
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

export default Showmoonarchive;
