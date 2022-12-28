import Image from "next/image";
import Calendaricone from "../../style/assets/images/calendar-icon.png";
import Calendarplaceicone from "../../style/assets/images/calendar-placeholder-icon.png";
import MemberIcon from "../../style/assets/images/icon-user.png";
import NotesIcone from "../../style/assets/images/notes-icon.png";
import PriorityIcon from "../../style/assets/images/flag-icon.png";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-datepicker";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  chnageMoonPopupStateValue,
  chnagePanetPopupStateValue,
} from "../../redux/actions/popup";
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
  addArchivePlanetsOfUser,
  addPlanetsData,
  editPlanetData,
  getProejctDetailsById,
} from "../../redux/actions/planet";
import tagCloseIcon from "../../style/assets/images/close-icon.svg";
import { getStorage } from "firebase/storage";
import { editPlanetSuccess } from "../../redux/actions/planet";
import { successAddPlanet } from "../../redux/actions/planet";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const Addplanet = ({
  singlePlanetData,
  planetTeams,
  planetImage,
  planetId,
  projectId,
  pageNumber,
  PageSize,
}) => {
  const moonPopupState = useSelector((state) => state.data.moonModal);
  const planetPopupState = useSelector((state) => state.data.planetModal);
  const userTokendata = useSelector((state) => state.signin.signin);
  const singleStarTeams = useSelector((state) => state.planet?.starData?.teams);
  const isLoading = useSelector((state) => state.planet.loading);

  const [startSelectedDate, setStartSelectedDate] = useState();
  const [endSelectedDate, setEndSelectedDate] = useState();
  const [alarmSelectedDate, setAlarmSelectedDate] = useState();
  const [images, setImages] = useState("");
  const [prjectNameErr, setplanetNameErr] = useState("");
  const [startDateTimeErr, setStartDateTimeErr] = useState("");
  const [FinishTimeErr, setFinishDateTimeErr] = useState("");
  const [AlarmTimeErr, setAlarmDateTimeErr] = useState("");
  const [userId, setUserId] = useState();
  const today = new Date();
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
  const [editPlanetId, setEditPlanetId] = useState();
  const [editId, setEditId] = useState();
  const [value, setValue] = useState();

  const router = useRouter();
  useEffect(() => {
    const query = router.query;
    // setTimeout(function () {
    //   if (query.projectId) {
    //     dispatch(getProejctDetailsById(query.projectId));
    //   }
    // }, 1000);

    if (query.planetId) {
      setEditPlanetId(query.planetId);
    }

    if (query.editplanetID) {
      setEditId(query.editplanetID);
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userID) {
      setUserId(userData.userID);
    }

    //For check planet images is there or not.
    if (planetImage?.length > 0) {
      setImages(planetImage);
    }
  }, [userId,planetImage?.length]);

  useEffect(() => {
    if (singlePlanetData) {
      setAddPlanet(singlePlanetData);
    }
    // dispatch(getAllUsersData("", userId, sendUserIds));
  }, [singlePlanetData]);

  const [addPlanet, setAddPlanet] = useState({
    planetName: "",
    startDateTime: "",
    endDateTime: "",
    alarmDateTime: "",
    note: "",
    teams: [],
    description: "",
  });

  const allUsers = useSelector((state) => state.user.allUsers);
  const popupState = useSelector((state) => state.data.planetModal);
  const successState = useSelector((state) => state.planet.successMessage);
  const editSuceessSate = useSelector((state) => state.planet.editSuccess);
  const singleUserData = useSelector((state) => state?.signin?.signin);
  const planetTeamData = useSelector((state) => state?.planet);
  const filterNotify = addPlanet?.teams?.filter(
    (id) => id?.userId !== singleUserData?.userid
  );

  useEffect(() => {
    if (Object.keys(singleUserData).length > 0) {
      addPlanet?.teams?.push({
        userId: singleUserData?.userid,
        userName: singleUserData?.username,
      });
      setAddPlanet(addPlanet);
    }
  }, [singleUserData]);

  if (editSuceessSate === "success" && popupState === true) {
    popupState = false;
    dispatch(chnagePanetPopupStateValue(popupState));
    dispatch(editPlanetSuccess(""));
    Router.push({
      pathname: '/moon',
      query: { planetId: planetId }
  }, '/moon');
  }

  if (successState === "success" && popupState === true) {
    popupState = false;
    dispatch(chnagePanetPopupStateValue(popupState));
    dispatch(successAddPlanet(""));
  }

  const handleRange = (e) => {
    let inputRange = e.target.value;

    setAddPlanet({ ...addPlanet, ["priority"]: inputRange });
  };

  const closePlanetPoup = () => {
    if (editId) {
      Router.push({
        pathname: '/moon',
        query: { planetId: planetId }
    }, '/moon');
    }

    if (editPlanetId) {
      Router.push({
        pathname: '/moon',
        query: { planetId: planetId }
    }, '/moon');
    }

    popupState = false;
    dispatch(chnagePanetPopupStateValue(popupState));

    planetPopupState = false;
    dispatch(chnagePanetPopupStateValue(planetPopupState));
    setAddPlanet({
      planetName: "",
      startDateTime: "",
      endDateTime: "",
      alarmDateTime: "",
      note: "",
      teams: [
        { userId: singleUserData?.userid, userName: singleUserData?.username },
      ],
      description: "",
    });
    setplanetNameErr("");
    setStartDateTimeErr("");
    setStartSelectedDate("");
    setEndSelectedDate("");
    setFinishDateTimeErr("");
    setAlarmDateTimeErr("");
    setAlarmSelectedDate("");
    setMultiAttachments([]);
  };

  const [loader, setLoader] = useState(false);
  const [removeLoader, setRemoveLoader] = useState(false);

  const URLS = "";
  const multiURLS = [];

  const onHandlePlanetChange = (e) => {
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
          setImages([...images, ...newImages]);

          file["id"] = Math.random();
          const promises = [];
          const storageRef = ref(storage, `/planets/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          promises.push(uploadTask);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const percent = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              setPercent(percent);
            },
            (err) => console.log(err),
            () => {
              // download url
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                URLS = url;
                if (URLS) {
                  if (planetImage?.length > 0) {
                    setLoader(false);
                    planetImage.push({
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
        setAddPlanet({ ...addPlanet, ["attachments"]: URLS });
      }
    }
  };

  const deleteImages = (index, attachMents) => {
    if (planetImage?.length > 0) {
      const filterData = planetImage.splice(index, 1);
      setFilterDataImages(filterData);
      const storage = getStorage();
      const desertRef = ref(storage, attachMents);

      // Delete the file
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
      // });
    }
  };

  const validateStarForm = () => {
    let isValid = true;

    if (isEmpty(addPlanet?.planetName)) {
      setplanetNameErr("Please enter planet name");
      isValid = false;
    } else {
      if (!/^[a-zA-Z0-9-.@\s]+$/.test(addPlanet.planetName)) {
        setplanetNameErr("Special character are not allowed");
        isValid = false;
      }
    }
    if (!addPlanet?.startDateTime) {
      setStartDateTimeErr("Please select start datetime");
      isValid = false;
    }
    if (!addPlanet?.endDateTime) {
      setFinishDateTimeErr("Please select finish datetime");
      isValid = false;
    }
    // if (!addPlanet?.alarmDateTime) {
    //   setAlarmDateTimeErr("Please select alarm datetime");
    //   isValid = false;
    // }

    return isValid;
  };

  const handleChangePlanet = (e) => {
    let { name, value } = e.target;
    // setEditFormStar({ ...editFormStar, [name]: value });

    if (e.target.name === "planetName") {
      setplanetNameErr("");
    }

    setAddPlanet({
      ...addPlanet,
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
      setAddPlanet({ ...addPlanet, ["startDateTime"]: startDate });
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
      setAddPlanet({ ...addPlanet, ["endDateTime"]: finishDate });
      // setEditFormStar({ ...editFormStar, ["endDateTime"]: finishDate });
    }
  };

  const alarmDateTimeChange = (date) => {
    if (!date) {
      setAlarmDateTimeErr("Please select alarm datetime");
    } else {
      setAlarmDateTimeErr("");
      setAlarmSelectedDate(date);
      let alarmDate = moment(date).format();
      setAddPlanet({ ...addPlanet, ["alarmDateTime"]: alarmDate });
      // setEditFormStar({ ...editFormStar, ["alarmDateTime"]: alarmDate });
    }
  };

  // console.log("singleStarTeams ::::", singleStarTeams);
  // console.log("planetTeams", planetTeams);
  const notification = "";
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateStarForm();

    const dataSend = {};
    const sendIamge = "";
    if (singlePlanetData) {
      moonPopupState = false;
      dispatch(chnageMoonPopupStateValue(moonPopupState));

      if (planetImage.length > 0) {
        sendIamge = planetImage.map((item) => {
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

      // console.log("sendimages", sendIamge);

      const dataSendEdit = {
        updatePlanetId: planetId ? planetId.toString() : 0,
        projectId: Number(singlePlanetData.projectId),
        planetName: addPlanet?.planetName,
        description: addPlanet?.description,
        startDateTime: addPlanet?.startDateTime,
        endDateTime: addPlanet?.endDateTime,
        alarmDateTime: addPlanet?.alarmDateTime,
        priority: addPlanet?.priority ? addPlanet?.priority.toString() : "0",
        note: addPlanet?.note,
        createdBy: userId.toString(),
        teams: addPlanet?.teams?.map((item) => {
          {
            return { userId: item.userId.toString(), userName: item.userName };
          }
        }),
        attachments: sendIamge,
      };

      if (filterNotify?.length > 0) {
        notification = {
          typeId: planetId,
          description:
            singleUserData.username +
            " has update planet " +
            addPlanet?.planetName,
          type: "Planet",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addPlanet?.startDateTime,
          endDateTime: addPlanet?.endDateTime,
        };
      }

      // console.log("dataSend", dataSendEdit);
      // console.log("notification :::::", notification);
      // return;

      if (isValid) {
        dispatch(editPlanetData(dataSendEdit, notification));
      }
    } else if (addPlanet) {
      dataSend = {
        planetName: addPlanet.planetName,
        projectId: Number(projectId),
        description: addPlanet.description,
        startDateTime: addPlanet.startDateTime,
        endDateTime: addPlanet.endDateTime,
        alarmDateTime: addPlanet.alarmDateTime,
        priority: addPlanet.priority ? addPlanet.priority : "5",
        note: addPlanet.note,
        createdBy: userId.toString(),
        teams: addPlanet?.teams?.map((item) => {
          {
            return { userId: item.userId.toString(), userName: item.userName };
          }
        }),
        attachments: multiAttachments.map((item) => {
          {
            return { attachmentPath: item };
          }
        }),
      };

      // console.log("Isvalid", isValid);
      // console.log("dataSend", dataSend);
      // return;

      //Notification Users Array
      if (filterNotify?.length > 0) {
        notification = {
          description:
            userTokendata.username +
            " has created planet " +
            addPlanet?.planetName,
          type: "Planet",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addPlanet.startDateTime,
          endDateTime: addPlanet.endDateTime,
        };
      }

      if (isValid) {
        dispatch(
          addPlanetsData(
            dataSend,
            pageNumber,
            PageSize,
            projectId,
            notification,
            singleUserData
          )
        );
        setAddPlanet({
          planetName: "",
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
    setValue(e.target.value);
    addMembers(e.target.value);
  };

  const array = [];
  const edit_array = [];
  const already_add_member = [];
  const addMembers = (value) => {
    if (!value && addPlanet?.teams.length > 0) {
      dispatch(getAllUsersData("", userId, sendUserIds, "Removetag"));
    } else {
      if (addPlanet?.teams?.length > 0) {
        addPlanet?.teams?.map((item) => {
          edit_array.push(item.userId);
          setSendUserIds(edit_array);
        });

        dispatch(getAllUsersData(value, userId, sendUserIds));
      } else {
        dispatch(getAllUsersData(value, userId, sendUserIds));
        setNewtags(allUsers);
      }
    }
  };

  let getArrayOfTeam = [];
  if (planetTeams) {
    if (selectedUser.length !== planetTeams.length && !selectedUserFlag) {
      for (let i = 0; i < planetTeams.length; i++) {
        getArrayOfTeam.push({
          userId: planetTeams[i].userId,
          label: planetTeams[i].username,
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
    if (addPlanet?.teams.length === 0) {
      addPlanet?.teams([]);
    } else {
      setAddPlanet((addPlanet) => ({
        ...addPlanet,
        teams: addPlanet?.teams.filter((items, i) => index !== i),
      }));
      // setSelectedUser(addPlanet?.teams.filter((el, i) => i !== index));
    }
  };

  //handle space
  const handleMemberKeyDown = (e) => {
    if (e.key === " " && addPlanet?.teams?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " " && addPlanet?.planetName?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleDesKey = (e) => {
    if (e.key === " " && addPlanet?.description?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleNoteKey = (e) => {
    if (e.key === " " && addPlanet?.note?.length === undefined) {
      e.preventDefault();
    }
  };

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  //Add Muliple member
  const prevAddPlanet = "";
  const handleMulipleArray = (Members) => {
    setValue();
    if (addPlanet?.teams !== undefined && prevAddPlanet !== undefined) {
      setAddPlanet((prevAddPlanet) => ({
        ...prevAddPlanet,
        teams: [
          ...prevAddPlanet?.teams,
          {
            userId: Members.value.toString(),
            userName: Members.label,
          },
        ],
      }));
    } else {
      setAddPlanet((prevAddPlanet) => ({
        ...prevAddPlanet,
        teams: [
          {
            userId: Members.value.toString(),
            userName: Members.label,
          },
        ],
      }));
    }
  };

  // console.log("singlePlanetData.projectId ::::", singlePlanetData.projectId);
  const handleMoveToArchive = () => {
    const sendData = {
      planettId: Number(planetId),
      isArchive: true,
      userId: userId,
    };

    const type = "add";
    dispatch(
      addArchivePlanetsOfUser(
        sendData,
        type,
        1,
        10,
        singlePlanetData?.projectId
      )
    );
  };

  const changeCase = (event) => {
    event.preventDefault();
    const data =
      addPlanet?.planetName?.charAt(0).toUpperCase() +
      addPlanet?.planetName?.slice(1);
    setAddPlanet({ ...addPlanet, ["planetName"]: data });
  };

  return (
    <>
      <div className="addplanet-popup-wrapper">
        <div className="add-planet-form">
          <div className="add-planet-form-body">
            <div className="planet-form-wrapper">
              <form onSubmit={handleSubmit}>
                <div className="form-field-wrapper">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={NotesIcone} />
                      Planet Name
                    </label>
                    <span className="input-field-wrapper">
                      <input
                        type="text"
                        autoComplete="off"
                        name="planetName"
                        placeholder="Planet Name"
                        className="form-control"
                        onKeyUp={changeCase}
                        onChange={handleChangePlanet}
                        value={addPlanet?.planetName || ""}
                        onKeyDown={handleKeyDown}
                        // pattern="[^\s]+"
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
                            : addPlanet?.startDateTime
                            ? moment(addPlanet?.startDateTime).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : ""
                          // : startDateTime
                          // // ? moment(startDateTime).format("DD-MM-yyyy h:mm A")
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
                        placeholderText="Finish DateTime"
                        selected={endSelectedDate}
                        minDate={startSelectedDate ? startSelectedDate : today}
                        onChange={(date) => finishDateTime(date)}
                        value={
                          endSelectedDate
                            ? moment(endSelectedDate).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : addPlanet?.endDateTime
                            ? moment(addPlanet?.endDateTime).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : ""
                          // : endDateTime
                          // ? moment(endDateTime).format("DD-MM-yyyy h:mm A")
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
                            : addPlanet?.alarmDateTime
                            ? moment(addPlanet?.alarmDateTime).format(
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
                          {addPlanet?.teams?.map((newTags, index) => (
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
                              addPlanet?.priority == item.name
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
                      Planet Description
                    </label>
                    <span className="textarea-field-wrapper">
                      <textarea
                        className="form-control"
                        placeholder="Planet Description"
                        name="description"
                        onChange={handleChangePlanet}
                        onKeyDown={handleDesKey}
                        value={addPlanet?.description || ""}
                        // pattern="[^\s]+"
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
                        onChange={handleChangePlanet}
                        value={addPlanet?.note || ""}
                        onKeyDown={handleNoteKey}
                        // pattern="[^\s]+"
                      ></textarea>
                    </span>
                  </div>
                </div>

                <div className="form-field-wrapper form-full-width file-upload-input-planet">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={PriorityIcon} />
                      Upload Document
                    </label>
                    <div className="upload-document-wrapper-planet">
                      <label
                        htmlFor="planet-file"
                        className="custom-file-planet"
                      >
                        Upload Document
                      </label>
                      <input
                        type="file"
                        name="attachments"
                        id="planet-file"
                        // accept="image/*"
                        onChange={onHandlePlanetChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="show_images">
                  {!planetImage?.length ? (
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
                  ) : planetImage && planetImage.length > 0 ? (
                    planetImage.map((items, index) => {
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
                    onClick={closePlanetPoup}
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
                    value={singlePlanetData ? "Update" : "Add"}
                    className="submit-btn-wrapper gradient-btn"
                  />
                </div>
              </form>
              {singlePlanetData && (
                <input
                  type="submit"
                  name=""
                  value="Mark as done"
                  className="submit-btn-wrapper gradient-btn mark-done-btn"
                  onClick={handleMoveToArchive}
                />
              )}
              {isLoading === true ? <Loader /> : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addplanet;
