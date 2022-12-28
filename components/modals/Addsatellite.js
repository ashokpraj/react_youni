import Image from "next/image";
import Calendaricone from "../../style/assets/images/calendar-icon.png";
import Calendarplaceicone from "../../style/assets/images/calendar-placeholder-icon.png";
import MemberIcon from "../../style/assets/images/icon-user.png";
import NotesIcone from "../../style/assets/images/notes-icon.png";
import PriorityIcon from "../../style/assets/images/flag-icon.png";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-datepicker";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chnageSatelliteopupStateValue } from "../../redux/actions/popup";
import { docShow, imageShow, pdfShow } from "../utils/showImages";
import { getAllUsersData } from "../../redux/actions/users";
import isEmpty from "../validation/isEmpty";
import moment from "moment";
import { storage } from "../../lib/firebase-config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Router, { useRouter } from "next/router";
import {
  addArchiveSatellitesOfUser,
  addSatellitesData,
  editSatelliteData,
  successAddSatellite,
} from "../../redux/actions/satellite";
import tagCloseIcon from "../../style/assets/images/close-icon.svg";
import { getStorage } from "firebase/storage";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const Addsatellite = ({
  singleSatelliteData,
  satelliteTeams,
  satelliteImages,
  satelliteId,
  moonId,
  moonsId,
  pageNumber,
  PageSize,
}) => {
  const [startSelectedDate, setStartSelectedDate] = useState();
  const [endSelectedDate, setEndSelectedDate] = useState();
  const [alarmSelectedDate, setAlarmSelectedDate] = useState();
  const [rangeValue, setRangeValue] = useState(1);
  const [images, setImages] = useState("");
  const [tags, setTags] = useState([]);
  const [tagsName, setTagsName] = useState([]);
  const [tagsIDS, setTagsIDS] = useState([]);
  const [userName, SetUserName] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [prjectNameErr, setsateliteNameErr] = useState("");
  const [startDateTimeErr, setStartDateTimeErr] = useState("");
  const [FinishTimeErr, setFinishDateTimeErr] = useState("");
  const [AlarmTimeErr, setAlarmDateTimeErr] = useState("");
  const [userId, setUserId] = useState();
  const today = new Date();
  // let PageSize = 10;
  // const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const [percent, setPercent] = useState(0);
  const [urlState, setUrlState] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserFlag, setSelectedUserFlag] = useState(false);
  const [selectedMemberAddFlag, setSelectedMemberAddFlag] = useState(false);
  const [newTags, setNewtags] = useState([]);
  const [sendUserIds, setSendUserIds] = useState([]);
  const [multiAttachments, setMultiAttachments] = useState([]);
  const [filterDataImages, setFilterDataImages] = useState([]);
  const [editMoonIds, setEditMoonIds] = useState();
  const [moonIDS, setMoonIDS] = useState();
  const [value, setValue] = useState();

  const isLoading = useSelector((state) => state.satellite.loading);

  const router = useRouter();
  useEffect(() => {
    const query = router.query;

    if (query.moonId) {
      setMoonIDS(query.moonId);
    }

    if (query?.editMoonId) {
      setEditMoonIds(query.editMoonId);
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userID) {
      setUserId(userData.userID);
    }

    //For check Moon images is there or not.
    if (satelliteImages?.length > 0) {
      setImages(satelliteImages);
    }
  }, [userId,satelliteImages?.length]);

  const allUsers = useSelector((state) => state.user.allUsers);

  const commaSep = "";
  useEffect(() => {
    if (singleSatelliteData) {
      setAddSatellite({ ...singleSatelliteData });
    }
    if (satelliteTeams) {
      commaSep = satelliteTeams.map((item) => item.username).join(", ");
      setTags(commaSep);
      // setTags({ ...tags, ["member"]: commaSep });
    }
  }, [singleSatelliteData]);

  const [addSatellite, setAddSatellite] = useState({
    sateliteName: "",
    startDateTime: "",
    endDateTime: "",
    alarmDateTime: "",
    teams: [],
    note: "",
    description: "",
  });

  const popupState = useSelector((state) => state.data.satelliteModal);
  const successState = useSelector((state) => state.satellite.successMessage);
  const singleUserData = useSelector((state) => state?.signin?.signin);
  const userTokendata = useSelector((state) => state.signin.signin);
  const filterNotify = addSatellite?.teams?.filter(
    (id) => id?.userId !== singleUserData?.userid
  );

  useEffect(() => {
    if (Object.keys(singleUserData).length > 0) {
      addSatellite?.teams?.push({
        userId: singleUserData?.userid,
        userName: singleUserData?.username,
      });
      setAddSatellite(addSatellite);
    }
  }, [singleUserData]);

  if (successState === "success" && popupState === true) {
    popupState = false;
    dispatch(chnageSatelliteopupStateValue(popupState));
    Router.push({
      pathname: '/satellite',
      query: { moonId: moonId }
  }, '/satellite');
    dispatch(successAddSatellite(""));
  }

  const handleRange = (e) => {
    let inputRange = e.target.value;
    setAddSatellite({ ...addSatellite, ["priority"]: inputRange });
  };

  const closeSatellitePopup = () => {
    dispatch({ type: "CLEAR_SATELLITE_STATE" });
    popupState = false;
    dispatch(chnageSatelliteopupStateValue(popupState));
    setAddSatellite({
      sateliteName: "",
      description: "",
      note: "",
      teams: [
        {
          userId: singleUserData?.userid,
          userName: singleUserData?.username,
        },
      ],
    });
    setStartSelectedDate("");
    setEndSelectedDate("");
    setAlarmSelectedDate("");
    setMultiAttachments([]);
    emptyValidation();
  };

  const emptyValidation = (e) => {
    setsateliteNameErr("");
    setStartDateTimeErr("");
    setFinishDateTimeErr("");
    setAlarmDateTimeErr("");
  };

  const [loader, setLoader] = useState(false);
  const [removeLoader, setRemoveLoader] = useState(false);

  const URLS = "";
  const multiURLS = [];

  const onHandleSatelliteChange = (e) => {
    const checkImage = e.target.files[0];
    if (!checkImage?.name?.match(/.(jpg|jpeg|png|pdf|doc|docx)$/i) && checkImage !== undefined) {
      toast.error("This file format is not supported");
    } else {
      const file = e.target.files;
      const files = [...e.target.files];
      if (images?.length + files?.length > 10) {
        toast.error("Only 10 files accepted.");
      } else {
        let err = "";
        let newImages = [];
        let maxLimit = false;

        files.forEach((file) => {
          if (!file) {
            alert("File does not exist.");
          }

          if (!maxLimit) newImages.push(file);
          setLoader(true);
          // setImages(file);
          setImages([...images, ...newImages]);

          file["id"] = Math.random();
          const promises = [];
          const storageRef = ref(storage, `/satellite/${file.name}`);
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
                URLS = url;
                if (URLS) {
                  if (satelliteImages?.length > 0) {
                    setLoader(false);
                    satelliteImages.push({
                      attachmentPath: URLS,
                    });
                  } else {
                    setUrlState(URLS);
                    multiAttachments.push(URLS);

                    setLoader(false);
                  }
                }
              });
            }
          );
        });

        setAddSatellite({ ...addSatellite, ["attachments"]: URLS });
      }
    }
  };

  const deleteImages = (index, attachMents) => {
    if (satelliteImages?.length > 0) {
      const filterData = satelliteImages.splice(index, 1);
      setFilterDataImages(filterData);
      const storage = getStorage();
      const desertRef = ref(storage, attachMents);

      setRemoveLoader(true);
      deleteObject(desertRef)
        .then(() => {
          setRemoveLoader(false);
        })
        .catch((error) => {
          setRemoveLoader(true);
        });
    } else {
      const newArr = [...multiAttachments];
      newArr.splice(index, 1);
      setMultiAttachments(newArr);
      setImages(newArr);

      setRemoveLoader(true);
      const storage = getStorage();
      const desertRef = ref(storage, attachMents);
      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          setRemoveLoader(false);
        })
        .catch((error) => {
          setRemoveLoader(true);
        });
    }
  };

  const validateStarForm = () => {
    let isValid = true;
    if (isEmpty(addSatellite.sateliteName)) {
      setsateliteNameErr("Please enter satellite Name");
      isValid = false;
    } else {
      if (!/^[a-zA-Z0-9-.@\s]+$/.test(addSatellite.sateliteName)) {
        setsateliteNameErr("Special character are not allowed");
        isValid = false;
      }
    }
    if (!addSatellite.startDateTime) {
      setStartDateTimeErr("Please select start datetime");
      isValid = false;
    }
    if (!addSatellite.endDateTime) {
      setFinishDateTimeErr("Please select finish datetime");
      isValid = false;
    }
    // if (!addSatellite.alarmDateTime) {
    //   setAlarmDateTimeErr("Please select alarm datetime");
    //   isValid = false;
    // }

    return isValid;
  };

  const handleChangeStar = (e) => {
    let { name, value } = e.target;
    // setEditFormStar({ ...editFormStar, [name]: value });

    if (e.target.name === "sateliteName") {
      setsateliteNameErr("");
    }

    setAddSatellite({
      ...addSatellite,
      [name]: value,
    });
  };

  const startDateTimeChange = (date) => {
    if (!date) {
      setStartDateTimeErr("Please select start datetime");
    } else {
      setStartDateTimeErr("");
      setStartSelectedDate(date);
      let startDate = moment(date).format();
      setAddSatellite({ ...addSatellite, ["startDateTime"]: startDate });
      // setEditFormStar({ ...editFormStar, ["startDateTime"]: startDate });
    }
  };

  const finishDateTime = (date) => {
    if (!date) {
      setEndSelectedDate("Please select finish datetime");
    } else {
      setFinishDateTimeErr("");
      setEndSelectedDate(date);
      let finishDate = moment(date).format();
      setAddSatellite({ ...addSatellite, ["endDateTime"]: finishDate });
    }
  };

  const alarmDateTimeChange = (date) => {
    if (!date) {
      setAlarmDateTimeErr("Please select alarm datetime");
    } else {
      setAlarmDateTimeErr("");
      setAlarmSelectedDate(date);
      let alarmDate = moment(date).format();
      setAddSatellite({ ...addSatellite, ["alarmDateTime"]: alarmDate });
    }
  };

  const dataSend = {};
  const sendIamge = "";
  const notification = "";
  // console.log("satelliteTeams", satelliteTeams);
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateStarForm();

    if (singleSatelliteData) {
      if (satelliteImages.length > 0) {
        sendIamge = satelliteImages.map((item) => {
          return {
            attachmentPath: item.attachmentPath,
          };
        });
      } else {
        sendIamge = multiAttachments.map((item) => {
          {
            return { attachmentPath: item };
          }
        });
      }

      const dataSendEdit = {
        updateSateliteId: satelliteId ? satelliteId : 0,
        satelliteId: satelliteId ? Number(satelliteId) : 0,
        moonId: Number(singleSatelliteData.moonId),
        sateliteName: addSatellite?.sateliteName,
        description: addSatellite?.description,
        startDateTime: addSatellite?.startDateTime,
        endDateTime: addSatellite?.endDateTime,
        alarmDateTime: addSatellite?.alarmDateTime,
        priority: addSatellite?.priority
          ? addSatellite?.priority.toString()
          : "1",
        note: addSatellite?.note,
        createdBy: userId.toString(),
        teams: addSatellite?.teams?.map((item) => {
          {
            return { userId: item.userId.toString(), userName: item.userName };
          }
        }),
        attachments: sendIamge,
      };

      if (filterNotify?.length > 0) {
        notification = {
          typeId: moonId,
          description:
            singleUserData.username +
            " has update satellite" +
            addSatellite?.sateliteName,
          type: "Satellite",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addSatellite?.startDateTime,
          endDateTime: addSatellite?.endDateTime,
        };
      }

      // console.log("notification :::::", notification);
      // return;

      // console.log("isValid", isValid);
      // console.log("dataSend", dataSendEdit);
      // return;

      if (isValid) {
        dispatch(editSatelliteData(dataSendEdit, notification));
        setAddSatellite({
          sateliteName: "",
          description: "",
          startDateTime: "",
          endDateTime: "",
          alarmDateTime: "",
          note: "",
          teams: [],
        });
        setMultiAttachments([]);
        // setSelectedUser([]);
      }
    } else {
      if (addSatellite) {
        dataSend = {
          sateliteName: addSatellite.sateliteName,
          moonId: Number(moonId),
          description: addSatellite.description,
          startDateTime: addSatellite.startDateTime,
          endDateTime: addSatellite.endDateTime,
          alarmDateTime: addSatellite.alarmDateTime,
          priority: addSatellite.priority ? addSatellite.priority : "1",
          note: addSatellite.note,
          createdBy: userId.toString(),
          teams: addSatellite?.teams?.map((item) => {
            {
              return {
                userId: item.userId.toString(),
                userName: item.userName,
              };
            }
          }),
          attachments: multiAttachments.map((item) => {
            {
              return { attachmentPath: item };
            }
          }),
        };
      }

      //Notification Users Array
      if (filterNotify?.length > 0) {
        notification = {
          description:
            userTokendata.username +
            " has created satellite " +
            addSatellite?.sateliteName,
          type: "Satellite",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addSatellite.startDateTime,
          endDateTime: addSatellite.endDateTime,
        };
      }

      // console.log("isValid", isValid);
      // console.log("dataSend", dataSend);
      // return;

      if (isValid) {
        dispatch(
          addSatellitesData(
            dataSend,
            pageNumber,
            PageSize,
            moonId,
            notification,
            singleUserData
          )
        );
        setAddSatellite({
          sateliteName: "",
          description: "",
          note: "",
          teams: [
            {
              userId: singleUserData?.userid,
              userName: singleUserData?.username,
            },
          ],
        });
        setStartSelectedDate("");
        setEndSelectedDate("");
        setAlarmSelectedDate("");
        setMultiAttachments([]);
      }
    }
  };

  const Priorities = [
    { id: "1", name: "1" },
    { id: "2", name: "2" },
    { id: "3", name: "3" },
    { id: "4", name: "4" },
    { id: "5", name: "5" },
  ];

  //While onchange of member
  const debounce = null;
  const handlechange = (e) => {
    // clearTimeout(debounce);
    // debounce = setTimeout(() => {
    setValue(e.target.value);
    addMembers(e.target.value);
    // }, 300);
  };

  const array = [];
  const edit_array = [];
  const addMembers = (value) => {
    if (!value && addSatellite?.teams?.length > 0) {
      dispatch(getAllUsersData("", userId, sendUserIds, "Removetag"));
    } else {
      if (addSatellite?.teams?.length > 0) {
        addSatellite?.teams?.map((item) => {
          edit_array.push(item.userId);
          setSendUserIds(edit_array);
        });

        dispatch(getAllUsersData(value, userId, sendUserIds));
      } else {
        dispatch(getAllUsersData(value, userId, sendUserIds));
        setNewtags(allUsers);
      }
      // dispatch(getAllUsersData(value, userId, sendUserIds));
      // setNewtags(allUsers);
    }
  };

  let getArrayOfTeam = [];
  if (satelliteTeams) {
    if (selectedUser.length !== satelliteTeams.length && !selectedUserFlag) {
      for (let i = 0; i < satelliteTeams.length; i++) {
        getArrayOfTeam.push({
          userId: satelliteTeams[i].userId,
          label: satelliteTeams[i].username,
        });
      }
    }
  }

  if (getArrayOfTeam.length > 0 && !selectedMemberAddFlag) {
    setSelectedMemberAddFlag(true);
    getArrayOfTeam.map((item, index) => {
      return selectedUser.push({
        userId: Number(item.userId),
        label: item.label,
      });
    });
  }

  const removeTags = (index) => {
    setSelectedUserFlag(true);
    if (addSatellite?.teams.length === 0) {
      addSatellite?.teams([]);
    } else {
      setAddSatellite((addSatellite) => ({
        ...addSatellite,
        teams: addSatellite?.teams.filter((items, i) => index !== i),
      }));
      // setSelectedUser(selectedUser.filter((el, i) => i !== index));
    }
  };

  //handle space
  const handleMemberKeyDown = (e) => {
    if (e.key === " " && addSatellite?.teams?.length === 0) {
      e.preventDefault();
    }
  };

  const handleKeyDownSpace = (e) => {
    if (e.key === " " && addSatellite?.sateliteName?.length === 0) {
      e.preventDefault();
    }
  };

  const handleDesKey = (e) => {
    if (e.key === " " && addSatellite?.description?.length === 0) {
      e.preventDefault();
    }
  };

  const handleNoteKey = (e) => {
    if (e.key === " " && addSatellite?.note?.length === 0) {
      e.preventDefault();
    }
  };

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  //Add Muliple member
  const prevAddSatellite = "";
  const handleMulipleArray = (Members) => {
    setValue();
    if (addSatellite?.teams !== undefined && prevAddSatellite !== undefined) {
      setAddSatellite((prevAddSatellite) => ({
        ...prevAddSatellite,
        teams: [
          ...prevAddSatellite?.teams,
          {
            userId: Members.value.toString(),
            userName: Members.label,
          },
        ],
      }));
    } else {
      setAddSatellite((prevAddSatellite) => ({
        ...prevAddSatellite,
        teams: [
          {
            userId: Members.value.toString(),
            userName: Members.label,
          },
        ],
      }));
    }
  };

  // console.log("singleSatelliteData :::", singleSatelliteData);
  // return;

  const handleMoveToArchive = () => {
    const sendData = {
      sateliteId: Number(satelliteId),
      isArchive: true,
      userId: userId,
    };

    const type = "add";
    dispatch(
      addArchiveSatellitesOfUser(
        sendData,
        type,
        1,
        10,
        singleSatelliteData?.moonId
      )
    );
    popupState = false;
    dispatch(chnageSatelliteopupStateValue(popupState));
  };

  const changeCase = (event) => {
    event.preventDefault();
    const data =
      addSatellite?.sateliteName?.charAt(0).toUpperCase() +
      addSatellite?.sateliteName?.slice(1);
    setAddSatellite({ ...addSatellite, ["sateliteName"]: data });
  };

  return (
    <>
      <div className="addsatellite-popup-wrapper">
        <div className="add-satellite-form">
          <div className="add-satellite-form-body">
            <div className="satellite-form-wrapper">
              <form onSubmit={handleSubmit}>
                {/* <button
                  type="button"
                  className="btn-close"
                  onClick={closeSatellitePopup}
                ></button> */}
                <div className="form-field-wrapper">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={NotesIcone} />
                      Satellite Name
                    </label>
                    <span className="input-field-wrapper">
                      <input
                        type="text"
                        autoComplete="off"
                        name="sateliteName"
                        placeholder="Satellite Name"
                        className="form-control"
                        onKeyUp={changeCase}
                        onChange={handleChangeStar}
                        value={addSatellite?.sateliteName || ""}
                        onKeyDown={handleKeyDownSpace}
                      />
                      {prjectNameErr && (
                        <span className="error-msg">{prjectNameErr}</span>
                      )}
                    </span>
                  </div>
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={Calendaricone} />
                      Start DateTime
                    </label>
                    <span className="input-field-wrapper">
                      <Datepicker
                        dateFormat="yyyy/MM/dd h:mm"
                        className="form-control"
                        placeholderText="Start DateTime"
                        type="text"
                        autoComplete="off"
                        name="startDateTime"
                        selected={startSelectedDate}
                        minDate={today}
                        onChange={(date) => startDateTimeChange(date)}
                        showTimeSelect
                        value={
                          startSelectedDate
                            ? moment(startSelectedDate).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : addSatellite?.startDateTime
                            ? moment(addSatellite?.startDateTime).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : ""
                        }
                      />
                      {startDateTimeErr && (
                        <span className="error-msg">{startDateTimeErr}</span>
                      )}
                      <span className="placeholder-icon-wrap">
                        <Image
                          className="placeholder-icon"
                          src={Calendarplaceicone}
                        />
                      </span>
                    </span>
                  </div>
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={Calendaricone} />
                      Finish DateTime
                    </label>
                    <span className="input-field-wrapper">
                      <Datepicker
                        className="form-control"
                        dateFormat="yyyy/MM/dd h:mm"
                        showTimeSelect
                        type="text"
                        autoComplete="off"
                        name="endDateTime"
                        selected={endSelectedDate}
                        placeholderText="Finish DateTime"
                        minDate={startSelectedDate ? startSelectedDate : today}
                        onChange={(date) => finishDateTime(date)}
                        value={
                          endSelectedDate
                            ? moment(endSelectedDate).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : addSatellite?.endDateTime
                            ? moment(addSatellite?.endDateTime).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : ""
                        }
                      />
                      {FinishTimeErr && (
                        <span className="error-msg">{FinishTimeErr}</span>
                      )}
                      <span className="placeholder-icon-wrap">
                        <Image
                          className="placeholder-icon"
                          src={Calendarplaceicone}
                        />
                      </span>
                    </span>
                  </div>
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={Calendaricone} />
                      Set Alarm DateTime
                    </label>
                    <span className="input-field-wrapper">
                      <Datepicker
                        dateFormat="yyyy/MM/dd h:mm"
                        className="form-control"
                        placeholder="mm/dd/yyyy"
                        type="text"
                        autoComplete="off"
                        name="alarmDateTime"
                        placeholderText="Alarm DateTime"
                        selected={alarmSelectedDate}
                        showTimeSelect
                        onChange={(date) => alarmDateTimeChange(date)}
                        value={
                          alarmSelectedDate
                            ? moment(alarmSelectedDate).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : addSatellite?.alarmDateTime
                            ? moment(addSatellite?.alarmDateTime).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : ""
                        }
                      />
                      {AlarmTimeErr && (
                        <span className="error-msg">{AlarmTimeErr}</span>
                      )}
                      <span className="placeholder-icon-wrap">
                        <Image
                          className="placeholder-icon"
                          src={Calendarplaceicone}
                        />
                      </span>
                    </span>
                  </div>
                </div>

                <div className="form-field-wrapper member-priority-wrapper">
                  <div className="form-group add-member">
                    <label>
                      <Image className="form-icon" src={MemberIcon} />
                      Add Members
                    </label>

                    <div className="tags-input-container">
                      <input
                        type="text"
                        className="tags-input"
                        name="member"
                        placeholder="Add Members"
                        onChange={handlechange}
                        onKeyDown={handleMemberKeyDown}
                      />
                      <div className="tags-wrapper">
                        <div className="tags-results-wrap">
                          {addSatellite?.teams?.map((newTags, index) => (
                            <div className="tag-item" key={index}>
                              <span className="text">
                                {newTags.userName ? newTags.userName : newTags}
                              </span>
                              {singleUserData.userid === newTags.userId ? (
                                ""
                              ) : (
                                <span
                                  className="close"
                                  onClick={() => removeTags(index)}
                                >
                                  <Image
                                    className="tag-close-icon"
                                    src={tagCloseIcon}
                                  />
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {value && allUsers?.length > 0 && (
                      <div className="tags-dropdown-result">
                        {allUsers?.map((newTags, index) => (
                          <div className="tag-item" key={index}>
                            <span
                              className="text"
                              onClick={() => handleMulipleArray(newTags)}
                            >
                              {newTags.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-group priority-slider">
                    <label>
                      <Image className="form-icon" src={PriorityIcon} />
                      Priority
                    </label>

                    <select
                      className="form-select form-select-sm"
                      aria-label=".form-select-sm example"
                      onChange={handleRange}
                    >
                      {Priorities.map((item, i) => {
                        return (
                          <option
                            name="priority"
                            key={i}
                            value={item.name}
                            selected={
                              addSatellite?.priority == item.name
                                ? "true"
                                : "false"
                            }
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-field-wrapper field-textarea">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={NotesIcone} />
                      Satellite Description
                    </label>
                    <span className="textarea-field-wrapper">
                      <textarea
                        className="form-control"
                        placeholder="Satellite Description"
                        name="description"
                        onChange={handleChangeStar}
                        value={addSatellite?.description || ""}
                        onKeyDown={handleDesKey}
                      ></textarea>
                    </span>
                  </div>
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={NotesIcone} />
                      Notes / Comments
                    </label>
                    <span className="textarea-field-wrapper">
                      <textarea
                        className="form-control"
                        placeholder="Notes / Comments"
                        name="note"
                        onChange={handleChangeStar}
                        value={addSatellite?.note || ""}
                        onKeyDown={handleNoteKey}
                      ></textarea>
                    </span>
                  </div>
                </div>

                <div className="form-field-wrapper form-full-width file-upload-input-satellite">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={PriorityIcon} />
                      Upload Document
                    </label>
                    <div className="upload-document-wrapper-satellite">
                      <label
                        htmlFor="satellite-file"
                        className="custom-file-satellite"
                      >
                        Upload Document
                      </label>
                      <input
                        type="file"
                        name="attachments"
                        id="satellite-file"
                        // accept="image/*"
                        onChange={onHandleSatelliteChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="show_images">
                  {!satelliteImages?.length ? (
                    <>
                      {multiAttachments?.map((img, index) => (
                        <div className="file_img">
                          {get_url_extension(img) === "doc" ||
                          get_url_extension(img) === "docx"
                            ? docShow(img)
                            : get_url_extension(img) === "pdf"
                            ? pdfShow(img)
                            : imageShow(img)}
                          <span onClick={() => deleteImages(index, img)}>
                            &times;
                          </span>
                        </div>
                      ))}
                    </>
                  ) : satelliteImages && satelliteImages.length > 0 ? (
                    satelliteImages.map((items, index) => {
                      return (
                        <>
                          <div className="file_img">
                            {get_url_extension(items.attachmentPath) ===
                              "doc" ||
                            get_url_extension(items.attachmentPath) ===
                              "docx" ? (
                              docShow(items.attachmentPath)
                            ) : get_url_extension(items.attachmentPath) ===
                              "pdf" ? (
                              pdfShow(items.attachmentPath)
                            ) : (
                              <img src={items.attachmentPath} />
                            )}
                            <span
                              onClick={() =>
                                deleteImages(index, items.attachmentPath)
                              }
                            >
                              &times;
                            </span>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    ""
                  )}
                </div>

                <div className="add-btn-wrapper">
                  <input
                    type="button"
                    name=""
                    value="Cancel"
                    className="submit-btn-wrapper gradient-btn"
                    onClick={closeSatellitePopup}
                  />

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
                    ""
                  )}

                  {removeLoader ? (
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
                    ""
                  )}
                  <input
                    type="submit"
                    name=""
                    value={singleSatelliteData?.sateliteId ? "Update" : "Add"}
                    className="submit-btn-wrapper gradient-btn"
                  />
                </div>
              </form>
              {singleSatelliteData ? (
                <input
                  type="submit"
                  name=""
                  value="Mark as done"
                  className="submit-btn-wrapper gradient-btn mark-done-btn"
                  onClick={handleMoveToArchive}
                />
              ) : (
                ""
              )}
              {isLoading === true ? <Loader /> : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addsatellite;
