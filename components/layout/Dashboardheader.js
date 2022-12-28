import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";
import {
  markAdReadNotification,
  userAllData,
} from "../../redux/actions/dashboard";
import { useDispatch, useSelector } from "react-redux";
import * as image from "../../public/imagesURL";
import { Logout } from "../../redux/actions/signin";
import {
  chnageCometPopupStateValue,
  chnagePopupStateValue,
} from "../../redux/actions/popup";
import Showcontactus from "../modals/Showcontactus";
import MobileMainLogoImg from "../../style/assets/images/circular-center-logo.png";

const Dashboardheader = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.dashboard.userData.data);
  const userTokendata = useSelector((state) => state.signin.signin);
  const usersAllNotification = useSelector(
    (state) => state.dashboard.userNotification
  );

  const handleLogout = () => {
    console.log("in");
    dispatch(Logout(users?.userid));
    Router.push("/");
  };

  const cometPpupState = useSelector((state) => state.data.cometModal);
  const starPopupState = useSelector((state) => state.data.starModal);

  const successCotact = useSelector(
    (state) => state.dashboard.contactSuccessMessage
  );
  const [showContactUs, setContactUs] = useState(false);
  const [userId, setUserId] = useState();

  //plantDetails link
  const planDetails = () => {
    Router.push(`/plandetails`);
  };

  const [socialUserDataState, setSocialUserDataState] = useState("");
  useEffect(() => {
    setTimeout(function () {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const socialUserData = JSON.parse(localStorage.getItem("socialData"));
      setSocialUserDataState(socialUserData);

      if (userData) {
        dispatch(userAllData(userData.userID));
        setUserId(userData.userID);

        // dispatch(getUsersNotification(userTokendata.userId));
        // dispatch(usersNotification(userData.userID));
      }
    }, 1000);
  }, [dispatch]);

  //handleProfile Click
  const handleProfileClick = (e) => {
    const changeStarPopup = false;
    const changeCometpopup = false;
    dispatch(chnageCometPopupStateValue(changeCometpopup));
    dispatch(chnagePopupStateValue(changeStarPopup));
  };

  //handleContactUs
  const handleContactUs = (e) => {
    setContactUs(true);
  };

  //hideHandleContactUs
  const hideHandleContactUs = (e) => {
    setContactUs(false);
  };

  if (successCotact && showContactUs === true) {
    setContactUs(false);
  }

  //editProfile link
  const editProfile = () => {
    Router.push(`/profile/?userId=${userId}`);
  };

  const handleHader = () => {
    Router.push("/dashboard");
  };

  // const handleNotification = (ids, type, tyIds) => {
  //   if (type === "Star") {
  //     Router.push(`/planet/?projectId=${tyIds}`);
  //   }
  //   if (type === "Planet") {
  //     Router.push(`moon/?planetId=${tyIds}`);
  //   }
  //   dispatch(markAdReadNotification(ids));
  // };
  return (
    <>
      <Showcontactus
        setContactUs={showContactUs}
        hideModal={hideHandleContactUs}
      />
      <header className="main-page-header">
        <nav className="nav-header">
          <a
            className="navbar-brand"
            onClick={handleHader}
            style={{ cursor: "pointer" }}
          >
            <Image className="main-logo" src={image.Logoimage} alt="Logo" />
          </a>
          <a
            className="navbar-brand-mobile"
            onClick={handleHader}
            style={{ cursor: "pointer" }}
          >
            <Image
              src={MobileMainLogoImg}
              className="mobile-web-logo"
              alt="logo"
            />
          </a>
          <div className="time-sorting">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="hours-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#hours"
                  type="button"
                  role="tab"
                  aria-controls="hours"
                  aria-selected="true"
                >
                  3 Hours
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="day-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#day"
                  type="button"
                  role="tab"
                  aria-controls="day"
                  aria-selected="false"
                >
                  Day
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="week-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#week"
                  type="button"
                  role="tab"
                  aria-controls="week"
                  aria-selected="false"
                >
                  Week
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="month-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#month"
                  type="button"
                  role="tab"
                  aria-controls="month"
                  aria-selected="false"
                >
                  Month
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="year-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#year"
                  type="button"
                  role="tab"
                  aria-controls="year"
                  aria-selected="false"
                >
                  Year
                </button>
              </li>
            </ul>
          </div>
          <div className="header-right-side">
            <a
              className="header-contact-info"
              onClick={handleContactUs}
              style={{ cursor: "pointer" }}
            >
              <Image
                className="contactus-icon"
                src={image.contactHeaderIcon}
                alt="contact icon"
              />
            </a>
            <div className="notification">
              <button
                type="button"
                className="btn dropdown-toggle"
                data-toggle="dropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  className="notification-icon"
                  src={image.Notification}
                  alt="notification icon"
                />
              </button>
              <div className="dropdown-menu">
                <div className="notification-listing-dropdown">
                  <h2 className="notification-title">All Notification</h2>
                  <div className="dropdown-item-wrapper">
                    <div className="dropdown-item">
                      <div className="notification-image">
                        <svg
                          width="18"
                          height="21"
                          viewBox="0 0 18 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.7695 10.1453C16.039 9.29229 15.7071 8.55305 15.7071 7.29716V6.87013C15.7071 5.23354 15.3304 4.17907 14.5115 3.12459C13.2493 1.48699 11.1244 0.5 9.04423 0.5H8.95577C6.91935 0.5 4.86106 1.44167 3.577 3.0128C2.71333 4.08842 2.29293 5.18822 2.29293 6.87013V7.29716C2.29293 8.55305 1.98284 9.29229 1.23049 10.1453C0.676907 10.7738 0.5 11.5815 0.5 12.4557C0.5 13.3309 0.787226 14.1598 1.36367 14.8336C2.11602 15.6413 3.17846 16.1569 4.26375 16.2466C5.83505 16.4258 7.40634 16.4933 9.0005 16.4933C10.5937 16.4933 12.165 16.3805 13.7372 16.2466C14.8215 16.1569 15.884 15.6413 16.6363 14.8336C17.2118 14.1598 17.5 13.3309 17.5 12.4557C17.5 11.5815 17.3231 10.7738 16.7695 10.1453Z"
                            fill="currentColor"
                          ></path>
                          <path
                            opacity="0.8"
                            d="M11.0097 17.7285C10.5098 17.6217 7.46364 17.6217 6.96372 17.7285C6.53636 17.8272 6.07422 18.0568 6.07422 18.5604C6.09907 19.0408 6.38033 19.4648 6.76992 19.7337L6.76893 19.7347C7.27282 20.1275 7.86416 20.3773 8.48334 20.4669C8.8133 20.5122 9.14923 20.5102 9.49111 20.4669C10.1093 20.3773 10.7006 20.1275 11.2045 19.7347L11.2035 19.7337C11.5931 19.4648 11.8744 19.0408 11.8992 18.5604C11.8992 18.0568 11.4371 17.8272 11.0097 17.7285Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                      <div className="notification-data-wrapper">
                        <h4 className="notification-name">Demo star name</h4>
                        <span className="notification-date">
                          Oct 07 2022 03:49 PM
                        </span>
                        <div className="project-date-wrapper">
                          <div className="project-date start-date">
                            <label className="date-lable">Start Date:</label>
                            <div className="date-value">Oct 21,2022</div>
                          </div>
                          <div className="project-date finish-date">
                            <label className="date-lable">Finish Date:</label>
                            <div className="date-value">Oct 24,2022</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="notification-image">
                        <svg
                          width="18"
                          height="21"
                          viewBox="0 0 18 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.7695 10.1453C16.039 9.29229 15.7071 8.55305 15.7071 7.29716V6.87013C15.7071 5.23354 15.3304 4.17907 14.5115 3.12459C13.2493 1.48699 11.1244 0.5 9.04423 0.5H8.95577C6.91935 0.5 4.86106 1.44167 3.577 3.0128C2.71333 4.08842 2.29293 5.18822 2.29293 6.87013V7.29716C2.29293 8.55305 1.98284 9.29229 1.23049 10.1453C0.676907 10.7738 0.5 11.5815 0.5 12.4557C0.5 13.3309 0.787226 14.1598 1.36367 14.8336C2.11602 15.6413 3.17846 16.1569 4.26375 16.2466C5.83505 16.4258 7.40634 16.4933 9.0005 16.4933C10.5937 16.4933 12.165 16.3805 13.7372 16.2466C14.8215 16.1569 15.884 15.6413 16.6363 14.8336C17.2118 14.1598 17.5 13.3309 17.5 12.4557C17.5 11.5815 17.3231 10.7738 16.7695 10.1453Z"
                            fill="currentColor"
                          ></path>
                          <path
                            opacity="0.8"
                            d="M11.0097 17.7285C10.5098 17.6217 7.46364 17.6217 6.96372 17.7285C6.53636 17.8272 6.07422 18.0568 6.07422 18.5604C6.09907 19.0408 6.38033 19.4648 6.76992 19.7337L6.76893 19.7347C7.27282 20.1275 7.86416 20.3773 8.48334 20.4669C8.8133 20.5122 9.14923 20.5102 9.49111 20.4669C10.1093 20.3773 10.7006 20.1275 11.2045 19.7347L11.2035 19.7337C11.5931 19.4648 11.8744 19.0408 11.8992 18.5604C11.8992 18.0568 11.4371 17.8272 11.0097 17.7285Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                      <div className="notification-data-wrapper">
                        <h4 className="notification-name">Demo star name</h4>
                        <span className="notification-date">
                          Oct 07 2022 03:49 PM
                        </span>
                        <div className="project-date-wrapper">
                          <div className="project-date start-date">
                            <label className="date-lable">Start Date:</label>
                            <div className="date-value">Oct 21,2022</div>
                          </div>
                          <div className="project-date finish-date">
                            <label className="date-lable">Finish Date:</label>
                            <div className="date-value">Oct 24,2022</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="notification-image">
                        <svg
                          width="18"
                          height="21"
                          viewBox="0 0 18 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.7695 10.1453C16.039 9.29229 15.7071 8.55305 15.7071 7.29716V6.87013C15.7071 5.23354 15.3304 4.17907 14.5115 3.12459C13.2493 1.48699 11.1244 0.5 9.04423 0.5H8.95577C6.91935 0.5 4.86106 1.44167 3.577 3.0128C2.71333 4.08842 2.29293 5.18822 2.29293 6.87013V7.29716C2.29293 8.55305 1.98284 9.29229 1.23049 10.1453C0.676907 10.7738 0.5 11.5815 0.5 12.4557C0.5 13.3309 0.787226 14.1598 1.36367 14.8336C2.11602 15.6413 3.17846 16.1569 4.26375 16.2466C5.83505 16.4258 7.40634 16.4933 9.0005 16.4933C10.5937 16.4933 12.165 16.3805 13.7372 16.2466C14.8215 16.1569 15.884 15.6413 16.6363 14.8336C17.2118 14.1598 17.5 13.3309 17.5 12.4557C17.5 11.5815 17.3231 10.7738 16.7695 10.1453Z"
                            fill="currentColor"
                          ></path>
                          <path
                            opacity="0.8"
                            d="M11.0097 17.7285C10.5098 17.6217 7.46364 17.6217 6.96372 17.7285C6.53636 17.8272 6.07422 18.0568 6.07422 18.5604C6.09907 19.0408 6.38033 19.4648 6.76992 19.7337L6.76893 19.7347C7.27282 20.1275 7.86416 20.3773 8.48334 20.4669C8.8133 20.5122 9.14923 20.5102 9.49111 20.4669C10.1093 20.3773 10.7006 20.1275 11.2045 19.7347L11.2035 19.7337C11.5931 19.4648 11.8744 19.0408 11.8992 18.5604C11.8992 18.0568 11.4371 17.8272 11.0097 17.7285Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                      <div className="notification-data-wrapper">
                        <h4 className="notification-name">Demo star name</h4>
                        <span className="notification-date">
                          Oct 07 2022 03:49 PM
                        </span>
                        <div className="project-date-wrapper">
                          <div className="project-date start-date">
                            <label className="date-lable">Start Date:</label>
                            <div className="date-value">Oct 21,2022</div>
                          </div>
                          <div className="project-date finish-date">
                            <label className="date-lable">Finish Date:</label>
                            <div className="date-value">Oct 24,2022</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="notification-image">
                        <svg
                          width="18"
                          height="21"
                          viewBox="0 0 18 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.7695 10.1453C16.039 9.29229 15.7071 8.55305 15.7071 7.29716V6.87013C15.7071 5.23354 15.3304 4.17907 14.5115 3.12459C13.2493 1.48699 11.1244 0.5 9.04423 0.5H8.95577C6.91935 0.5 4.86106 1.44167 3.577 3.0128C2.71333 4.08842 2.29293 5.18822 2.29293 6.87013V7.29716C2.29293 8.55305 1.98284 9.29229 1.23049 10.1453C0.676907 10.7738 0.5 11.5815 0.5 12.4557C0.5 13.3309 0.787226 14.1598 1.36367 14.8336C2.11602 15.6413 3.17846 16.1569 4.26375 16.2466C5.83505 16.4258 7.40634 16.4933 9.0005 16.4933C10.5937 16.4933 12.165 16.3805 13.7372 16.2466C14.8215 16.1569 15.884 15.6413 16.6363 14.8336C17.2118 14.1598 17.5 13.3309 17.5 12.4557C17.5 11.5815 17.3231 10.7738 16.7695 10.1453Z"
                            fill="currentColor"
                          ></path>
                          <path
                            opacity="0.8"
                            d="M11.0097 17.7285C10.5098 17.6217 7.46364 17.6217 6.96372 17.7285C6.53636 17.8272 6.07422 18.0568 6.07422 18.5604C6.09907 19.0408 6.38033 19.4648 6.76992 19.7337L6.76893 19.7347C7.27282 20.1275 7.86416 20.3773 8.48334 20.4669C8.8133 20.5122 9.14923 20.5102 9.49111 20.4669C10.1093 20.3773 10.7006 20.1275 11.2045 19.7347L11.2035 19.7337C11.5931 19.4648 11.8744 19.0408 11.8992 18.5604C11.8992 18.0568 11.4371 17.8272 11.0097 17.7285Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </div>
                      <div className="notification-data-wrapper">
                        <h4 className="notification-name">Demo star name</h4>
                        <span className="notification-date">
                          Oct 07 2022 03:49 PM
                        </span>
                        <div className="project-date-wrapper">
                          <div className="project-date start-date">
                            <label className="date-lable">Start Date:</label>
                            <div className="date-value">Oct 21,2022</div>
                          </div>
                          <div className="project-date finish-date">
                            <label className="date-lable">Finish Date:</label>
                            <div className="date-value">Oct 24,2022</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*{usersAllNotification?.length > 0 ? (
                    usersAllNotification.map((items) => {
                      return (
                        <a
                          className="dropdown-item"
                          onClick={() =>
                            handleNotification(
                              items.notificationId,
                              items.type,
                              items.typeId
                            )
                          }
                        >
                          <span>{items.description}</span>
                        </a>
                      );
                    })
                  ) : (
                    <a className="dropdown-item">
                      <span>No Notification</span>
                    </a>
                  )}*/}
                </div>
              </div>
              {usersAllNotification?.length > 0 ? (
                <span className="notification-number">
                  {usersAllNotification?.length}
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="user-detail-dropdown" onClick={handleProfileClick}>
              <div className="dropdown">
                <button
                  className="btn dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {users && users.photo ? (
                    <img
                      className="notification-icon"
                      src={users ? users.photo : ""}
                      alt="User icon"
                      width="50"
                      height="50"
                    />
                  ) : (
                    <Image
                      className="user-profile-icon"
                      src={image.ProfilePic}
                    />
                  )}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <div className="user-details">
                    <h4 className="user-name">
                      {users
                        ? users.username
                        : socialUserDataState
                        ? socialUserDataState.userName
                        : ""}
                    </h4>
                    <span className="user-email">
                      {users
                        ? users.emailId
                        : socialUserDataState
                        ? socialUserDataState.email
                        : ""}
                    </span>
                    {users?.userTypeId === 3 && (
                      <span className="account-type">Premium</span>
                    )}
                  </div>
                  <ul className="user-profile-details">
                    <li>
                      <label>Edit Profile</label>
                      <span className="value">
                        <label className="skype-name">
                          {users ? users.skypeName : "Skype Name"}
                        </label>
                        <a
                          className="edit-icon"
                          onClick={editProfile}
                          style={{ cursor: "pointer" }}
                        >
                          <Image
                            className="user-edit-icon"
                            src={image.EditICon}
                            alt="Edit ICon"
                          />
                        </a>
                      </span>
                    </li>
                    <li>
                      <a className="dropdown-menu-link" onClick={planDetails}>
                        Plan Details
                      </a>
                    </li>
                  </ul>
                  <a className="logout-link" onClick={handleLogout}>
                    Log Out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Dashboardheader;
