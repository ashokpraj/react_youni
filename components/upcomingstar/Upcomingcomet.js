import React, { useEffect, useState } from "react";
import Image from "next/image";
import starImage from "../../style/assets/images/add-start-icon.png";
import coloredStarImage from "../../style/assets/images/colored-add-start-icon.png";
import deletIcon from "../../style/assets/images/delete-icon.svg";
import onBoardIcon from "../../style/assets/images/message-send-icon-1.svg";
import viewPlanetIcon from "../../style/assets/images/view-icon.svg";
import editIcon from "../../style/assets/images/edit-icon.svg";
import {
  getAllCometsByUserId,
  getSingleUpcomingCometOfUsers,
  getUcomeingComets,
  getUpcomingCometsOfUsers,
} from "../../redux/actions/comet";
import { useDispatch, useSelector } from "react-redux";
import Addnewcomet from "../modals/Addnewcomet";
import Deletenewcomet from "../modals/Deletenewcomet";
import Router, { useRouter } from "next/router";
import backArrow from "../../style/assets/images/back-arrow.svg";

const Upcomingcomet = () => {
  const dispatch = useDispatch();

  const upcomeingComets = useSelector((state) => state.comet.ucomeingComets);
  const upcomeingCometsOfUser = useSelector(
    (state) => state.comet.ucomeingCometsUser
  );
  const upcomeingSingleComets = useSelector(
    (state) => state.comet.signleNewComet
  );
  const router = useRouter();

  const [newCometShow, setNewCometShow] = useState(false);
  const [userId, setUserId] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteValue, setDeleteValue] = useState("");

  const totalCount = upcomeingCometsOfUser.length;
  const pageNumber = 1;
  const PageSize = 10;
  const showPages = Math.ceil(totalCount / PageSize);

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userID) {
      setUserId(userData.userID);
      dispatch(getUcomeingComets(pageNumber, PageSize, userData.userID));
      dispatch(getUpcomingCometsOfUsers(userData.userID));
    }
  }, [dispatch]);

  const handleAddNewComet = () => {
    setNewCometShow(true);
  };

  const hideHandleAddNewComet = () => {
    setNewCometShow(false);
  };

  const handleEditNewTask = (e) => {
    setNewCometShow(true);
    const editValue = e;
    dispatch(getSingleUpcomingCometOfUsers(editValue));
  };

  const chnageCometPage = (e) => {
    dispatch(getAllCometsByUserId(e, PageSize, userId));
  };

  const handlePageChange = (e) => {
    dispatch(getUcomeingComets(e, PageSize, userId));
  };

  const handleDeletetNewComet = (e) => {
    setShowDeletePopup(true);
    setDeleteValue(e);
  };

  const handleHideDeletetNewTask = () => {
    setShowDeletePopup(false);
  };

  const handleOnBoardNewTask = (e) => {
    Router.push({
      pathname: '/comet',
      query: { onBoardId: e }
  }, '/comet');
  };

  return (
    <>
      <Deletenewcomet
        setShowDeletePopup={showDeletePopup}
        handleHideDeletepopup={handleHideDeletetNewTask}
        deleteValue={deleteValue}
        pageNumber={pageNumber}
        PageSize={PageSize}
        userId={userId}
      />
      <Addnewcomet
        handleAddNewComet={newCometShow}
        hideModal={hideHandleAddNewComet}
        pageNumber={pageNumber}
        PageSize={PageSize}
        userId={userId}
      />
      <div className="main-page-content inner-page-main-content">
        <section className="upcoming-star-wrapper upcoming-comet-page">
        <button className="back-btn" onClick={() => router.push("/comet")}>
            <span className="back-arrow-img">
              <Image src={backArrow} className="back-arrow" alt="back icon" />
            </span>
            <span className="back-label">Back</span>
          </button>
          <div className="add-new-star">
            <div className="project-addition" onClick={handleAddNewComet}>
              <a style={{ color: "white", cursor: "pointer" }}>
                <span className="add-icon">+</span>
                Add New Comet
              </a>
            </div>
            <div className="project-addition mobile-project-addition" onClick={handleAddNewComet}>
              <a style={{ color: "white", cursor: "pointer" }}>
                <span className="add-icon">Add New Comet</span>
              </a>
            </div>
          </div>
          <div className="upcoming-star">
            <div className="upcoming-star-header">
              <h3 className="upcoming-star-title">Upcoming Comet</h3>
            </div>
            <div className="table-wrapper table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Comet Name</th>
                    <th>Comet Notes</th>
                    <th>Description</th>
                    <th colSpan="3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomeingComets.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{item.cometName}</td>
                        <td> {item.note}</td>
                        <td>{item.description}</td>
                        <td className="action-btn">
                          <a
                            onClick={() => handleEditNewTask(item.cometId)}
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
                            onClick={() => handleDeletetNewComet(item.cometId)}
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
                            onClick={() => handleOnBoardNewTask(item.cometId)}
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
            {upcomeingCometsOfUser.length > 10 ? (
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

export default Upcomingcomet;
