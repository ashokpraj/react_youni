import React, { useEffect, useState } from "react";
import Footer from "../../components/layout/Footer";
import Image from "next/image";
import * as image from "../../public/imagesURL";
import { useDispatch, useSelector } from "react-redux";
import { userAllData } from "../../redux/actions/dashboard";
import { useRouter } from "next/router";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-datepicker";
import moment from "moment";
import { editUserProfile } from "../../redux/actions/userprofile";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../lib/firebase";
import Conditionalheader from "../../components/layout/Conditionalheader";

function viewProfile() {
  const dispatch = useDispatch();
  const [editFormStar, setEditFormStar] = useState("");
  const users = useSelector((state) => state.dashboard.userData.data);
  const [startDob, setStartDob] = useState();
  const [userId, setUserId] = useState();
  const [photo, setPhoto] = useState();
  const [percent, setPercent] = useState(0);
  const [urlState, setUrlState] = useState();
  const [images, setImages] = useState("");
  const [skypeNameErr, setSkypeNameErr] = useState();
  const router = useRouter();
  const userTokendata = useSelector((state) => state.signin.signin);

  useEffect(() => {
    const query = router.query;

    const userData = JSON.parse(localStorage.getItem("userData"));

    setTimeout(function () {
      if (!users && userData) {
        setUserId(userData.userID);
        dispatch(userAllData(userData.userID || userId));
      }
    }, 1000);

    // if (!users && userData) {
    //   setUserId(userData.userID);
    //   dispatch(userAllData(userData.userID));
    // }

    if (users) {
      const initialState = {
        skypeName: users ? users.skypeName : "",
        dob: users ? users.dob : "",
        gender: users ? users.gender : "",
        address: users ? users.address : "",
      };
      setEditFormStar({ ...initialState });
      setPhoto(users.photo);
    }
  }, [router.query, users]);

  // console.log("userss", users);
  const { skypeName, dob, gender, address } = editFormStar;

  let dispGender = "";
  if (gender === 0) {
    dispGender = "Female";
  } else {
    dispGender = "Male";
  }

  const handleGenderChange = (e) => {
    const genderValue = e.target.value;
    setEditFormStar({ ...editFormStar, ["gender"]: genderValue });
  };

  const handleStartDobChange = (date) => {
    setStartDob(date);
    setEditFormStar({ ...editFormStar, ["dob"]: moment(date).format() });
    // dob = e.target.value;
    // console.log(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const editProfileChange = (e) => {
    let { name, value } = e.target;
    setEditFormStar({ ...editFormStar, [name]: value });
  };

  const [loader, setLoader] = useState(false);
  const onHandleEditProfileChange = (e) => {
    setLoader(true);
    const file = e.target.files[0];
    setImages(file);
    file["id"] = Math.random();
    const promises = [];
    const storageRef = ref(storage, `/user_profile/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    promises.push(uploadTask);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          let URLS = url;
          if (URLS) {
            setUrlState(URLS);
            setLoader(false);
          }
          setEditFormStar({ ...editFormStar, ["photo"]: URLS });
        });
      }
    );
  };

  const validateProfileForm = () => {
    let isValid = true;

    if (editFormStar?.skypeName) {
      if (!/^[a-zA-Z0-9.:]+$/.test(editFormStar.skypeName)) {
        setSkypeNameErr("Invalid skype name");
        isValid = false;
      } else {
        setSkypeNameErr("");
      }
    }
    return isValid;
  };

  const sendGender = "";
  const handleEditProfile = (e) => {
    e.preventDefault();

    const isValid = validateProfileForm();

    if (
      editFormStar.gender === null ||
      editFormStar.gender === "Please select Gender"
    ) {
      sendGender = 3;
    } else {
      sendGender = editFormStar.gender;
    }

    const sendData = "";
    if (urlState) {
      sendData = {
        Userid: userTokendata?.userid,
        SkypeName: editFormStar.skypeName,
        Dob: editFormStar.dob,
        Gender: editFormStar.gender ? editFormStar.gender : sendGender,
        Address: editFormStar.address,
        UserTypeId: users ? users.userTypeId : "",
        Username: users ? users.username : "",
        EmailId: users ? users.emailId : "",
        PhotoUrl: urlState,
      };
    } else {
      sendData = {
        Userid: userTokendata?.userid,
        SkypeName: editFormStar.skypeName,
        Dob: editFormStar.dob,
        Gender: sendGender,
        Address: editFormStar.address ? editFormStar.address : "",
        UserTypeId: users ? users.userTypeId : "",
        Username: users ? users.username : "",
        EmailId: users ? users.emailId : "",
        PhotoUrl: photo,
      };
    }

    if (isValid === true) {
      dispatch(editUserProfile(sendData));
    }
  };

  return (
    <>
      <Conditionalheader />
      <div className="profile-edit-section">
        <div className="user-profile-section">
          <div className="profile-image-section">
            {photo && photo ? (
              <img className="profile-pic" src={photo} />
            ) : urlState ? (
              <img className="profile-pic" src={urlState} />
            ) : (
              <Image className="profile-pic" src={image.UserProfile} />
            )}
            {/* <input
              type="file"
              name="PhotoUrl"
              id="file"
              accept="image/*"
              onChange={onHandleEditProfileChange}
            /> */}
            <div className="edit-icon-wrapper">
              <label for="file" className="edit-icon">
                <Image
                  src={image.WhiteEdit}
                  onChange={onHandleEditProfileChange}
                />
              </label>
              {loader ? (
                <>
                  {" "}
                  <div className="cssloader_main">
                    {" "}
                    <div className="lds-ellipsis">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>{" "}
                    </div>{" "}
                  </div>
                </>
              ) : (
                <input
                  type="file"
                  name="attachments"
                  id="file"
                  accept="image/*"
                  onChange={onHandleEditProfileChange}
                />
              )}
            </div>
          </div>
          <div className="user-name-details">
            <h3 className="user-name">{users ? users.username : ""}</h3>
            <span className="user-email">{users ? users.emailId : ""}</span>
          </div>
        </div>

        <div className="user-profile-input-details">
          <div className="user-profile-form">
            <form onSubmit={handleEditProfile}>
              <div className="user-profile-form-wrapper">
                <div className="form-group">
                  <label>Skype Name</label>
                  <input
                    type="text"
                    name="skypeName"
                    className="form-control"
                    placeholder="Skype Name"
                    value={skypeName ? skypeName : ""}
                    onChange={editProfileChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                {skypeNameErr && (
                  <span className="error-msg">{skypeNameErr}</span>
                )}

                <div className="form-group">
                  <label>Date of Birth</label>
                  <Datepicker
                    dateFormat="yyyy/MM/dd"
                    className="form-control"
                    placeholderText="Date of Birth"
                    type="text"
                    name="dob"
                    selected={startDob}
                    onChange={(date) => handleStartDobChange(date)}
                    value={
                      dob
                        ? moment(dob).format("yyyy-MM-DD")
                        : dob
                        ? moment(startDob).format("yyyy-MM-DD")
                        : ""
                    }
                  />
                  {/* <input
                    type="date"
                    name="dod"
                    className="form-control"
                    placeholder="Date of Birth"
                    // value={dob || "dsd"}
                    onChange={handleDOBChange}
                    selected={dob}
                  /> */}
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={gender}
                    onChange={handleGenderChange}
                    className="form-control"
                  >
                    <option>Please select Gender</option>
                    <option name="gender" value="1">
                      {" "}
                      Male
                    </option>
                    <option name="gender" value="0">
                      Female
                    </option>
                  </select>

                  {/* <input
                    type="text"
                    name="gender"
                    className="form-control"
                    placeholder="Gender"
                    value={gender || ""}
                  /> */}
                </div>
              </div>
              <div className="form-group user-profile-address">
                <label>Address</label>
                <textarea
                  className="form-control"
                  placeholder="Address"
                  name="address"
                  value={address || ""}
                  onChange={editProfileChange}
                ></textarea>
              </div>
              <div className="form-group form-btn-wrap">
                <input
                  type="submit"
                  name=""
                  value="Update"
                  className="common-btn-pattern"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default viewProfile;
