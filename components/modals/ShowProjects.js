import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import Router from "next/router";
import Image from "next/image";
import editStarIcon from "../../style/assets/images/edit-icon.svg";
import viewPlanetIcon from "../../style/assets/images/view-icon.svg";
import deletIcon from "../../style/assets/images/delete-icon.svg";
import { addArchiveStarsOfUser, deleteStar } from "../../redux/actions/star";
import { useDispatch } from "react-redux";
import { selectedStar } from "../../redux/actions/star";
import Deletemodal from "./Deletemodal";
import { getStarDetailsById, projectsAllData } from "../../redux/actions/dashboard";
import completedIcon from "../../style/assets/images/checkmark-icon.svg";
import skypeIcon from "../../style/assets/images/skype-icon.svg";
import Link from "next/link";
import { useSelector } from "react-redux";

const ShowProjects = ({
  setShowModal,
  hideModal,
  projects,
  starCounts,
  userId,
}) => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const [starId, setStarId] = useState();
  const [deltedId, setDeletedId] = useState();
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  let PageSize = 10;
  const star = useSelector((state) => state);
  const showPages = Math.ceil(starCounts / PageSize);
  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span
          key={i}
          onClick={() => {
            setPageNumber(i);
            dispatch(projectsAllData(i, PageSize, userId));
          }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const handleDeleteStar = (starId) => {
    setShowModalSecond(true);
    setDeletedId(starId);
  };

  const hideDeleteStar = () => {
    setShowModalSecond(false);
  };

  const mainDeleteHandle = () => {
    dispatch(deleteStar(deltedId, pageNumber, PageSize, userId));
    setShowModalSecond(false);
  };

  const [showModalSecond, setShowModalSecond] = useState(false);

  //Mark as Done click event
  const handleMarkasDone = (item) => {
    const sendData = {
      projectId: Number(item.projectId),
      isArchive: true,
      userId: item.createdBy,
    };
    const type = "add";
    dispatch(addArchiveStarsOfUser(sendData, type,pageNumber, PageSize,starCounts));
  };

  return (
    <>
      <Modal
        show={setShowModal}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="star-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Stars Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Star Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
                <th colSpan="6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects?.length > 0 ? (
                projects.map((item, index) => {
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
                        {item.alarmDateTime &&
                        moment(item.alarmDateTime).format("DD-MM-yyyy h:mm A")}
                      </td>
                      <td>
                        {" "}
                        <Link
                          href={{
                            pathname: `/planet/`,
                            query: {
                              projectId: item?.projectId,
                            },
                          }}
                          as={`/planet/`}
                        >
                          <button
                            className="popup-redirect-links view-icon"
                            type="button"
                            style={{ cursor: "pointer" }}
                          // onClick={() => handleViewStar(item.projectId)}
                          // onClick={() => {
                          //   Router.push({
                          //     pathname: `/planet/`,
                          //     query: { projectId: item.projectId },
                          //   });
                          // }}
                          >
                            <Image
                              src={viewPlanetIcon}
                              className="view-icon"
                              alt="view icon"
                            />
                          </button>
                        </Link>
                      </td>
                      {item.createdBy === userId ? (
                        <td>
                          <Link
                            href={{
                              pathname: `/planet/`,
                              query: {
                                starId: item?.projectId,
                              },
                            }}
                            as={`/planet/`}
                          >
                            <button
                              style={{ cursor: "pointer" }}
                              className="popup-redirect-links edit-icon"
                            // onClick={() => handleEditSubmit(item.projectId)}
                            >
                              <Image
                                src={editStarIcon}
                                className="edit-icon"
                                alt="edit icon"
                              />
                            </button>
                          </Link>
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
                            onClick={() => handleDeleteStar(item.projectId)}
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
          {starCounts > 10 ? (
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

      {showModalSecond === true && (
        <Deletemodal
          showPopup={showModalSecond}
          onHide={hideDeleteStar}
          deltedId={deltedId}
          pageNumber={pageNumber}
          PageSize={PageSize}
          clickKey="star"
          count = {starCounts}
        // deleteData={mainDeleteHandle}
        />
      )}
    </>
  );
};

export default ShowProjects;
