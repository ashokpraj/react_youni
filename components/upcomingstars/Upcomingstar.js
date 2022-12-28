import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleUpcomingStarOfUsers,
  getUcomeingStars,
  getUpcomingStarOfUsers,
} from "../../redux/actions/star";
import Addnewstar from "../modals/Addnewstar";
import viewPlanetIcon from "../../style/assets/images/view-icon.svg";
import editIcon from "../../style/assets/images/edit-icon.svg";
import Deletenewstar from "../modals/Deletenewstar";
import Image from "next/image";
import starImage from "../../style/assets/images/add-start-icon.png";
import coloredStarImage from "../../style/assets/images/colored-add-start-icon.png";
import deletIcon from "../../style/assets/images/delete-icon.svg";
import onBoardIcon from "../../style/assets/images/message-send-icon-1.svg";
import Router, { useRouter } from "next/router";
import backArrow from "../../style/assets/images/back-arrow.svg";

const Upcomingstar = () => {
  const dispatch = useDispatch();

  const [userId, setUserId] = useState();
  const [newStarShow, setNewStarShow] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const upcomeingStars = useSelector((state) => state.star.ucomeingStras);
  const upcomeingStarsOfUser = useSelector(
    (state) => state.star.ucomeingStrasUser
  );

  const [bearerToken, setBearerToken] = useState("");
const router = useRouter();
  const totalCount = upcomeingStarsOfUser.length;
  const pageNumber = 1;
  const PageSize = 10;
  const showPages = Math.ceil(totalCount / PageSize);
  const [deleteValue, setDeleteValue] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    setBearerToken(token);

    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData && userData.userID) {
      dispatch(getUcomeingStars(pageNumber, PageSize, userData.userID));
      dispatch(getUpcomingStarOfUsers(userData.userID));
      setUserId(userData.userID);
    }
  }, [dispatch, bearerToken]);

  const handlePageChange = (e) => {
    dispatch(getUcomeingStars(e, PageSize, userId));
  };

  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span
          key={i}
          onClick={() => handlePageChange(i)}
          style={{ cursor: "pointer" }}
        >
          {i}
        </span>
      );
    }
    return td;
  };

  const handleAddNewStar = () => {
    setNewStarShow(true);
  };

  const hideHandleAddNewStar = () => {
    setNewStarShow(false);
  };

  const handleEditNewTask = (e) => {
    setNewStarShow(true);
    const editValue = e;
    dispatch(getSingleUpcomingStarOfUsers(editValue, bearerToken));
  };

  const handleDeletetNewTask = (e) => {
    const deleteValue = e;
    setShowDeletePopup(true);
    setDeleteValue(e);
  };

  const handleHideDeletetNewTask = () => {
    setShowDeletePopup(false);
  };

  const handleOnBoardNewTask = (e) => {
    Router.push({
      pathname: '/planet',
      query: { onBoardId: e }
  }, '/planet');
  };

  return (
    <>
      <Deletenewstar
        setShowDeletePopup={showDeletePopup}
        handleHideDeletepopup={handleHideDeletetNewTask}
        deleteValue={deleteValue}
        pageNumber={pageNumber}
        PageSize={PageSize}
        userId={userId}
        bearerToken={bearerToken}
      />
      <Addnewstar
        handleAddNewStar={newStarShow}
        hideModal={hideHandleAddNewStar}
        pageNumber={pageNumber}
        PageSize={PageSize}
        userId={userId}
        bearerToken={bearerToken}
      />
      <div className="main-page-content inner-page-main-content">
        <section className="upcoming-star-wrapper">
        <button className="back-btn" onClick={() => router.push("/dashboard")}>
            <span className="back-arrow-img">
              <Image src={backArrow} className="back-arrow" alt="back icon" />
            </span>
            <span className="back-label">Back</span>
          </button>
          <div className="add-new-star">
            <button className="add-project-btn" onClick={handleAddNewStar}>
              <span className="star-icon-wrapper">
                <Image src={starImage} className="star-icon" alt="star icon" />
              </span>
              <span className="hover-star-icon-wrapper">
                <Image
                  src={coloredStarImage}
                  className="black-star-icon"
                  alt="star icon"
                />
              </span>
              Add New Star
            </button>
            <button
              className="add-project-btn mobile-add-project-btn"
              onClick={handleAddNewStar}
            >
              Add New Star
            </button>
          </div>
          <div className="upcoming-star">
            <div className="upcoming-star-header">
              <h3 className="upcoming-star-title">Upcoming Star</h3>
            </div>
            <div className="table-wrapper table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Star Name</th>
                    <th>Start Notes</th>
                    <th>Description</th>
                    <th colSpan="3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomeingStars.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.projectName}</td>
                        <td> {item.note}</td>
                        <td>{item.description}</td>
                        <td className="action-btn">
                          <a
                            onClick={() => handleEditNewTask(item.projectId)}
                            style={{ cursor: "pointer" }}
                            className="edit-icon"
                          >
                            <Image
                              src={editIcon}
                              className="edit-icon"
                              alt="edit icon"
                            />
                          </a>
                        </td>{" "}
                        <td className="action-btn">
                          <a
                            onClick={() => handleDeletetNewTask(item.projectId)}
                            style={{ cursor: "pointer" }}
                            className="delete-icon"
                          >
                            <Image
                              src={deletIcon}
                              className="delete-icon"
                              alt="delete icon"
                            />
                          </a>
                        </td>
                        <td className="action-btn">
                          <a
                            onClick={() => handleOnBoardNewTask(item.projectId)}
                            style={{ cursor: "pointer" }}
                            className="onboard-icon"
                          >
                            <Image
                              src={onBoardIcon}
                              className="onboard-icon-img"
                              alt="onboard icon"
                            />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {upcomeingStarsOfUser.length > 10 ? (
              <div className="pagination">{renderTD()}</div>
            ) : (
              ""
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Upcomingstar;
