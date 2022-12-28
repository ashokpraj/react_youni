import React, { useEffect, useState } from "react";
import innerLogo from "../../style/assets/images/inner-logo.png";
import * as image from "../../public/imagesURL";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "../../redux/actions/signin";
import {
  getUserSubscribe,
  markAdReadNotification,
  userAllData,
  usersNotification,
} from "../../redux/actions/dashboard";
import Showcontactus from "../modals/Showcontactus";
import {
  chnageCometPopupStateValue,
  chnageMoonPopupStateValue,
  chnagePanetPopupStateValue,
  chnagePopupStateValue,
  chnageSatelliteopupStateValue,
} from "../../redux/actions/popup";
import { starCounts } from "../../redux/actions/dashboard";
import MobileMainLogoImg from "../../style/assets/images/circular-center-logo.png";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import moment from "moment";
import { saveTheSubscribeUser } from "../../redux/actions/dashboard";
import _get from "lodash/get";
import Showcometdetials from "../modals/Showcometdetials";

function Conditionalheader() {
  const notCount = [];
  const router = useRouter();
  const dispatch = useDispatch();
  const [slugValue, setSlugValue] = useState("");
  const [showContactUs, setContactUs] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [HasMore, setHasMore] = useState(true);
  const [socialUserDataState, setSocialUserDataState] = useState("");
  const [userId, setUserId] = useState();
  const [bearerToken, setBearerToken] = useState("");
  const userTokendata = useSelector((state) => state?.signin?.signin);
  const notifyCountAll = useSelector((state) => state?.dashboard?.notifyCount);
  const [showComeDetailModal, setShowComeDetailModal] = useState(false);
  const [cometId, setCometId] = useState();

  const usersAllNotification = useSelector(
    (state) => state.dashboard.userNotification
  );
  const [lastElementRef] = useInfiniteScroll(
    HasMore && loadMoreItems,
    isFetching
  );

  useEffect(() => {}, [HasMore]);

  function loadMoreItems() {
    if (
      (usersAllNotification.length === 0 && page === 1) ||
      (usersAllNotification.length !== 0 && page > 1)
    ) {
      setIsFetching(true);
      dispatch(
        usersNotification(page, (hasMore) => {
          setHasMore(hasMore);
          setIsFetching(false);
        })
      );
    }
    setPage((prevPageNumber) => prevPageNumber + 1);
  }

  let URL = "";
  const users = useSelector((state) => state.dashboard.userData.data);
  const loggdinUserData = useSelector((state) =>
    _get(state, "signin.signin", {})
  );

  const applicationPublicKey =
    "BL7530llkC9fJiyLC14-IDe6PINll-ieb6QKrbd8Z8sbscJsYy4hvIvVMk7Y58c7LDDckLyMA-9KXyTpebMld3I";

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    setBearerToken(token);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const socialUserData = JSON.parse(localStorage.getItem("socialData"));
    setSocialUserDataState(socialUserData);

    URL = window.location.href.split("/");
    setSlugValue(URL[3]);

    const query = router.query;

    // dispatch(usersNotification(userData?.userID));

    setTimeout(function () {
      if (!users && query.userId) {
        setUserId(userData.userID);
        // dispatch(userAllData(userData?.userID));
      }
    }, 500);
  }, [userId]);

  const homeClick = () => {
    Router.push(`/dashboard`);
  };

  const planDetails = () => {
    Router.push(`/plandetails`);
  };

  const handleLogout = () => {
    dispatch(starCounts(""));
    dispatch(Logout(userTokendata?.userid));
    localStorage.removeItem("loginToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("starId");
    localStorage.removeItem("projectName");
    Router.push("/");
  };

  //handleContactUs
  const handleContactUs = (e) => {
    setContactUs(true);
  };

  //hideHandleContactUs
  const hideHandleContactUs = (e) => {
    setContactUs(false);
  };

  //handleProfile Click
  const handleProfileClick = (e) => {
    const changeStarPopup = false;
    const changeCometpopup = false;
    const changePlanetPoup = false;
    const changeMoonPoup = false;
    const changeStaellitePoup = false;
    dispatch(chnageSatelliteopupStateValue(changeStaellitePoup));
    dispatch(chnageMoonPopupStateValue(changeMoonPoup));
    dispatch(chnagePanetPopupStateValue(changePlanetPoup));
    dispatch(chnageCometPopupStateValue(changeCometpopup));
    dispatch(chnagePopupStateValue(changeStarPopup));
  };

  //editProfile link
  const editProfile = () => {
    Router.push({
      pathname: '/viewProfile',
      query: { userId: userTokendata?.userid }
  }, '/viewProfile');
  };

  const handleNotification = (ids, type, tyIds) => {
    setCometId(tyIds);

    if (type === "Star") {
      Router.push({
        pathname: '/planet',
        query: { projectId: tyIds }
    }, '/planet');
    }
    if (type === "Planet") {
      Router.push({
        pathname: '/moon',
        query: { planetId: tyIds }
    }, '/moon');
    }
    if (type === "Moon") {
      Router.push({
        pathname: '/satellite',
        query: { moonId: tyIds }
    }, '/satellite');
    }

    if (type === "Satellite") {
      // Router.push(`satellite/?moonId=${tyIds}`);
    }

    if (type === "Comet") {
      setShowComeDetailModal(true);
    }

    dispatch(markAdReadNotification(ids));
  };

  const hideCometPopup = () => {
    setShowComeDetailModal(false);
  };

  useEffect(() => {
    //  swcall < 1 &&  setSwcall(swcall + 1)
    //  if(_get(loggdinUserData,'_id')) {
    registerServiceWorker();
    //   }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggdinUserData]);

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/serviceWorker.js", { scope: "/" })
        .then((swReg) => {
          initialiseState(swReg);
        })
        .catch((err) => {});
    }
  }

  const initialiseState = (swRegistration) => {
    // Check if desktop notifications are supported
    if (!("showNotification" in ServiceWorkerRegistration.prototype)) {
      console.warn("Notifications aren't supported.");
      return;
    }

    if (Notification.permission === "denied") {
      console.warn("The user has blocked notifications.");
      return;
    }

    // Check is push API is supported
    if (!("PushManager" in window)) {
      console.warn("Push messaging isn't supported.");
      return;
    }
    swRegistration.pushManager.getSubscription().then((subscription) => {
      if (
        Notification.permission === "default" ||
        Notification.permission === "granted"
      ) {
        if (!subscription) {
          subscribeUser(swRegistration);
        } else {
          // getUserSubscribe(_get(loggdinUserData, "userid", null))
          //     .then(web_push_tokens => {
          //         if (subscription !== null && web_push_tokens?.length === 0) {
          //             saveTheSubscribeUser(_get(loggdinUserData, "userid", null), subscription)
          //         }
          //     })
        }
      }
    });
  };

  const subscribeUser = (swRegistration) => {
    swRegistration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationPublicKey,
      })
      .then((subscribe) => {
        const userId = _get(loggdinUserData, "userid", null);
        Notification.permission === "granted" &&
          saveTheSubscribeUser(userId, subscribe);
      })
      .catch(function (e) {
        if (Notification.permission === "denied") {
          console.warn("_pushDebug Permission for Notifications was denied");
        } else {
          console.error("_pushDebug Unable to subscribe to push.", e);
        }
      });
  };

  // console.log("usersAllNotification ::::", usersAllNotification);
  return (
    <>
      {showComeDetailModal === true && (
        <Showcometdetials
          setShowComeDetailModal={showComeDetailModal}
          hideDetailsModal={hideCometPopup}
          cometViewId={cometId}
        />
      )}
      <Showcontactus
        setContactUs={showContactUs}
        hideModal={hideHandleContactUs}
      />
      {
      slugValue === "profile" ||
      slugValue === "upcomingstars" ||
      slugValue === "upcomingcomet" ||
      slugValue === "viewProfile" ||
      slugValue === "notfound"  ? (
        <header className="inner-page-header">
          <nav className="nav-header">
            <a
              className="navbar-brand"
              onClick={homeClick}
              style={{ cursor: "pointer" }}
            >
              <Image className="main-logo" src={innerLogo} alt="Logo" />
            </a>
            <a
              className="navbar-brand-mobile"
              onClick={homeClick}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={MobileMainLogoImg}
                className="mobile-web-logo"
                alt="logo"
              />
            </a>
            <div className="header-right-side">
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
                      {usersAllNotification?.length > 0
                        ? usersAllNotification?.map((items, index) => {
                            return (
                              <>
                                <div
                                  key={index}
                                  className={`dropdown-item  ${
                                    items?.isRead === false
                                      ? "new-notification"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleNotification(
                                      items.notificationId,
                                      items.type,
                                      items.typeId
                                    )
                                  }
                                >
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
                                    <h4 className="notification-name">
                                      {items.description}
                                    </h4>
                                    <span className="notification-date">
                                      {moment(items.createDate).format(
                                        "MMM Do, YYYY"
                                      )}
                                    </span>
                                    <div className="project-date-wrapper">
                                      <div className="project-date start-date">
                                        <label className="date-lable">
                                          Start Date:
                                        </label>
                                        <div className="date-value">
                                          {moment(items.startDateTime).format(
                                            "MMM Do, YYYY"
                                          )}
                                        </div>
                                      </div>
                                      <div className="project-date finish-date">
                                        <label className="date-lable">
                                          Finish Date:
                                        </label>
                                        <div className="date-value">
                                          {moment(items.endDateTime).format(
                                            "MMM Do, YYYY"
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })
                        : ""}
                    </div>
                  </div>
                </div>

                {notifyCountAll ? (
                  <span className="notification-number">{notifyCountAll}</span>
                ) : (
                  ""
                )}
              </div>
              <div className="user-detail-dropdown">
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {userTokendata && userTokendata?.photo ? (
                      <img
                        className="user-profile-icon"
                        src={userTokendata.photo}
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
                      <h4 className="user-name">{userTokendata?.username}</h4>
                      <span className="user-email">
                        {userTokendata?.emailId}
                      </span>
                    </div>
                    <ul className="user-profile-details">
                      <li onClick={homeClick} style={{ cursor: "pointer" }}>
                        <a className="dropdown-menu-link">Home</a>
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
      ) : "" ? (
        slugValue === "dashboard" && slugValue !== ""
      ) : (
        <header className="main-page-header">
          <nav className="nav-header">
            <a
              className="navbar-brand"
              onClick={homeClick}
              style={{ cursor: "pointer" }}
            >
              <Image className="main-logo" src={image.Logoimage} alt="Logo" />
            </a>
            <a
              className="navbar-brand-mobile"
              onClick={homeClick}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={MobileMainLogoImg}
                className="mobile-web-logo"
                alt="logo"
              />
            </a>
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
                      {usersAllNotification?.length === 0 ? (
                        <p className="text-center nodata">No Record Found</p>
                      ) : (
                        usersAllNotification?.map((items, index) => {
                          return (
                            <>
                              <div
                                key={index}
                                className={`dropdown-item  ${
                                  items?.isRead === false
                                    ? "new-notification"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleNotification(
                                    items.notificationId,
                                    items.type,
                                    items.typeId
                                  )
                                }
                              >
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
                                  <h4 className="notification-name">
                                    {items.description}
                                  </h4>
                                  <span className="notification-date">
                                    {moment(items.createDate).format(
                                      "MMM Do, YYYY"
                                    )}
                                  </span>
                                  <div className="project-date-wrapper">
                                    <div className="project-date start-date">
                                      <label className="date-lable">
                                        Start Date:
                                      </label>
                                      <div className="date-value">
                                        {moment(items.startDateTime).format(
                                          "MMM Do, YYYY"
                                        )}
                                      </div>
                                    </div>
                                    <div className="project-date finish-date">
                                      <label className="date-lable">
                                        Finish Date:
                                      </label>
                                      <div className="date-value">
                                        {moment(items.endDateTime).format(
                                          "MMM Do, YYYY"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })
                      )}

                      {HasMore && (
                        <div className="pagination_loader" ref={lastElementRef}>
                          <div
                            className="spinner-border text-secondary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {notifyCountAll ? (
                  <span className="notification-number">{notifyCountAll}</span>
                ) : (
                  " "
                )}
              </div>
              <div
                className="user-detail-dropdown"
                onClick={handleProfileClick}
              >
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {/* {userTokendata?.photo === "null" ? (
                      <Image className="profile-pic" src={image.UserProfile} />
                    ) : (
                      <img className="profile-pic" src={userTokendata?.photo} />
                    )} */}
                    {userTokendata && userTokendata.photo ? (
                      <img
                        className="notification-icon"
                        src={userTokendata?.photo}
                        alt="User icon"
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
                        {userTokendata?.username}
                        {/* {users
                          ? users.username
                          : socialUserDataState
                          ? socialUserDataState.userName
                          : ""} */}
                      </h4>
                      <span className="user-email">
                        {userTokendata?.emailId}
                        {/* {users
                          ? users.emailId
                          : socialUserDataState
                          ? socialUserDataState.email
                          : ""} */}
                      </span>
                    </div>
                    <ul className="user-profile-details">
                      {userTokendata?.skypeName ? (
                        <li>
                          <label>My Profile</label>
                          <span className="value">
                            <label className="skype-name">
                              {userTokendata
                                ? userTokendata?.skypeName
                                : "Skype Name"}
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
                      ) : (
                        <li>
                          <a
                            className="dropdown-menu-link"
                            onClick={editProfile}
                          >
                            My Profile
                          </a>
                        </li>
                      )}
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
      )}
    </>
  );
}

export default Conditionalheader;
