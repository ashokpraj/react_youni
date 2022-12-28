import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getArchivePlanets } from "../../redux/actions/planet";
import {
  addArchiveSatellitesOfUser,
  getArchiveSatellite,
  getArchiveSatelliteOfUser,
} from "../../redux/actions/satellite";

import deletIcon from "../../style/assets/images/delete-icon.svg";

const Showsatellitearchive = ({
  setShowArchiveSatellite,
  hideModal,
  moonId,
}) => {
  const router = useRouter();
  const archiveMoonsOfUsers = useSelector(
    (state) => state.satellite.archiveSatellitesOfUser
  );

  const archiveSatelliteData = useSelector(
    (state) => state.satellite.archiveSatellitesData
  );

  const [pageNumber, setPageNumber] = useState(1);
  let PageSize = 10;
  const showPages = Math.ceil(archiveSatelliteData?.length / PageSize);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();
  const query = router.query;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserId(userData.userID);
      if (query.moonId) {
        dispatch(getArchiveSatelliteOfUser(query.moonId));
        dispatch(getArchiveSatellite(pageNumber, PageSize, query.moonId));
      }
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
            dispatch(getArchivePlanets(i, PageSize, moonId));
          }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const handleUnarchiveSubmit = (item) => {
    // console.log("itemss :::", item);
    // return;
    const sendData = {
      sateliteId: item.sateliteId,
      isArchive: false,
      userId: item.createdBy,
    };

    dispatch(
      addArchiveSatellitesOfUser(
        sendData,
        "",
        pageNumber,
        PageSize,
        item?.moonId
      )
    );
    // hideModal();
  };

  return (
    <>
      <Modal
        show={setShowArchiveSatellite}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Archive Satellite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Satellite Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {archiveSatelliteData?.length > 0 ? (
                archiveSatelliteData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item?.sateliteName}</td>
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
                          onClick={() => handleUnarchiveSubmit(item)}
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
          {archiveMoonsOfUsers > 10 ? (
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

export default Showsatellitearchive;
