import React, { useEffect, useState } from "react";
import Image from "next/image";
import * as image from "../../public/imagesURL";
import { useDispatch, useSelector } from "react-redux";
import { userAllData } from "../../redux/actions/dashboard";
import Router, { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Conditionalheader from "../../components/layout/Conditionalheader";
import backArrow from "../../style/assets/images/back-arrow.svg";

function index() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.dashboard.userData.data);
  const [userId, setUserId] = useState();
  const router = useRouter();
  const query = router.query;

  function checkURLConditions() {
    // if (Object.keys(query).length > 0) {
    if (query.userId || userId) {
      setUserId(query.userId || userId);
      dispatch(userAllData(query.userId || userId));
    } else {
      // Router.push("/notfound");
    }
  }
  // }

  useEffect(() => {
    // const userData = JSON.parse(localStorage.getItem("userData"));
    if (query.userId) {
      localStorage.setItem("userId", query.userId);
      setUserId(query.userId);
    }
    else if (localStorage.getItem("userId")) {
      setUserId(localStorage.getItem("userId"));
    }
    checkURLConditions();
  }, [router.query, userId]);

  const handleEditProfile = (e) => {
    Router.push(`/profile`);
  };

  return (
    <>
      <Conditionalheader />
      <div className="profile-edit-section">
        <div className="user-profile-section">
          <button className="back-btn" onClick={() => router.push("/dashboard")}>
            <span className="back-arrow-img">
              <Image src={backArrow} className="back-arrow" alt="back icon" />
            </span>
            <span className="back-label">Back</span>
          </button>
          <div className="profile-image-section">
            {/* {photo && photo ? (
              <img className="profile-pic" src={photo} />
            ) : urlState ? (
              <img className="profile-pic" src={urlState} />
            ) : (
              <Image className="profile-pic" src={image.UserProfile} />
            )} */}

            {users?.photo ? (
              <img className="profile-pic" src={users?.photo} />
            ) : (
              <Image className="profile-pic" src={image.UserProfile} />
            )}
          </div>
          <div className="user-name-details">
            <h3 className="user-name">{users ? users.username : ""}</h3>
            <span className="user-email">{users ? users.emailId : ""}</span>
          </div>
        </div>

        <div className="user-profile-input-details user-view-profile">
          <div className="user-profile-form">
            <div className="user-profile-form-wrapper">
              <div className="form-group">
                <label>
                  <Image className="form-icon" src={image.NotesIcone} />
                  Skype Name:-
                </label>
                <div className="profile-input-value">
                  {users?.skypeName ? users?.skypeName : ""}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Image className="form-icon" src={image.Calendaricone} />
                  Date of Birth:-
                </label>
                <div className="profile-input-value">
                  {users?.dob ? moment(users?.dob).format("DD-MM-yyyy") : ""}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Image className="form-icon" src={image.TaskIcon} />
                  Gender:-
                </label>
                <div className="profile-input-value">
                  {users?.gender === 1
                    ? "Male"
                    : "Female"
                      ? users?.gender === 3
                      : ""}
                </div>
              </div>
            </div>
            <div className="form-group user-profile-address">
              <label>
                <Image className="form-icon" src={image.NotesIcone} />
                Address:-
              </label>
              <div className="profile-input-value">{users?.address}</div>
            </div>
            <div className="form-group form-btn-wrap">
              <input
                type="submit"
                name=""
                value="Edit"
                className="common-btn-pattern"
                onClick={handleEditProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default index;
