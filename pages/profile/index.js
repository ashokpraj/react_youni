import React, { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import backArrow from "../../style/assets/images/back-arrow.svg";

function index() {
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
  const today = new Date();

  useEffect(() => {
    const query = router.query;

    const userData = JSON.parse(localStorage.getItem("userData"));

    setTimeout(function () {
      if (!users && userData) {
        setUserId(userData.userID);
        dispatch(userAllData(userData.userID));
      }
    }, 1000);

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
  }, [router.query, users, userId]);

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
    setStartDate(date);
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
    const checkImage = e.target.files[0];
    if (!checkImage?.name?.match(/.(jpg|jpeg|png)$/i) && checkImage !== undefined) {
      toast.error("This file format is not supported");
    } else {
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
              setLoader(false);
            }
            setEditFormStar({ ...editFormStar, ["photo"]: URLS });
          });
        }
      );
    }
  };

  const validateProfileForm = () => {
    let isValid = true;

    if (editFormStar?.skypeName) {
      if (!/^[a-zA-Z0-9.: ]+$/.test(editFormStar.skypeName)) {
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

    // console.log("sendData :::", sendData);
    // return;
    if (isValid === true) {
      dispatch(editUserProfile(sendData));
    }
  };

  const [startDate, setStartDate] = useState(new Date());

  return (
    <>
      <Conditionalheader />
      <div className="profile-edit-section">
        <div className="user-profile-section">
        <button className="back-btn" onClick={() => router.push("/viewProfile")}>
              <span className="back-arrow-img">
                <Image src={backArrow} className="back-arrow" alt="back icon" />
              </span>
              <span className="back-label">Back</span>
            </button>
          <div className="profile-image-section">
            {users?.photo === undefined || users?.photo === null ? (
              <Image className="profile-pic" src={image.UserProfile} />
            ) : (
              <img
                className="profile-pic"
                src={urlState ? urlState : users?.photo}
              />
            )}

            <div className="edit-icon-wrapper">
              <label for="file" className="edit-icon">
                <Image
                  src={image.WhiteEdit}
                  onChange={onHandleEditProfileChange}
                />
              </label>

              <input
                type="file"
                name="attachments"
                id="file"
                accept="image/*"
                onChange={onHandleEditProfileChange}
              />
            </div>
            {loader && (
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
            )}
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
                    className="form-control"
                    selected={startDate}
                    maxDate={moment().toDate()}
                    onChange={(date) => handleStartDobChange(date)}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    value={
                      dob
                        ? moment(dob).format("yyyy-MM-DD")
                        : "yyyy-mm-dd"
                    }
                  />
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

export default index;
