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
import { chnageMoonPopupStateValue } from "../../redux/actions/popup";
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
  addArchiveMoonsOfUser,
  addMoonsData,
  editMoonData,
  // getMoonDetailsById,
} from "../../redux/actions/moon";
import tagCloseIcon from "../../style/assets/images/close-icon.svg";
import { getStorage } from "firebase/storage";
import { editMoonSuccess } from "../../redux/actions/moon";
import { successAddMoon } from "../../redux/actions/moon";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const Addmoon = ({
  singleMoonData,
  moonTeams,
  moonImages,
  moonId,
  planetId,
  pageNumber,
  PageSize,
}) => {
  const [startSelectedDate, setStartSelectedDate] = useState();
  const [endSelectedDate, setEndSelectedDate] = useState();
  const [alarmSelectedDate, setAlarmSelectedDate] = useState();
  const [images, setImages] = useState("");
  const [prjectNameErr, setmoonNameErr] = useState("");
  const [startDateTimeErr, setStartDateTimeErr] = useState("");
  const [FinishTimeErr, setFinishDateTimeErr] = useState("");
  const [AlarmTimeErr, setAlarmDateTimeErr] = useState("");
  const [memberErr, setAMemberErr] = useState("");
  const [priorityErr, setPriorityErr] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");
  const [notesErr, setNotesErr] = useState("");
  const [attachmentsErr, setAttachmentsErr] = useState("");
  const [userId, setUserId] = useState();
  const today = new Date();
  const dispatch = useDispatch();
  const [percent, setPercent] = useState(0);
  const [urlState, setUrlState] = useState();
  const [newMemberAdd, setNewMemberAdd] = useState([]);
  const [newMemberIDs, setNewMemberIDs] = useState([]);
  const [combineMember, setCombineMember] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedUserFlag, setSelectedUserFlag] = useState(false);
  const [selectedMemberAddFlag, setSelectedMemberAddFlag] = useState(false);
  const [newTags, setNewtags] = useState([]);
  const [sendUserIds, setSendUserIds] = useState([]);
  const [multiAttachments, setMultiAttachments] = useState([]);
  const [filterDataImages, setFilterDataImages] = useState([]);
  const [editMoonIds, setEditMoonIds] = useState();
  const [value, setValue] = useState();
  const router = useRouter();
  const isLoading = useSelector((state) => state.moon.loading);

  const singlePlanetData = useSelector(
    (state) => state.planet?.signlePlanet?.teams
  );

  useEffect(() => {
    const query = router.query;

    setTimeout(function () {
      // if (query.planetId) {
      //   dispatch(getMoonDetailsById(query.moonId));
      // }
    }, 1000);

    if (query.editMoonId) {
      setEditMoonIds(query.editMoonId);
      popupState = true;
      dispatch(chnageMoonPopupStateValue(popupState));
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData.userID) {
      setUserId(userData.userID);
    }

    //For check Moon images is there or not.
    if (moonImages?.length > 0) {
      setImages(moonImages);
    }
  }, [userId,moonImages?.length]);

  const allUsers = useSelector((state) => state.user.allUsers);

  const commaSep = "";
  useEffect(() => {
    if (singleMoonData) {
      setAddMoon({ ...singleMoonData });
    }
  }, [singleMoonData]);

  const [addMoon, setAddMoon] = useState({
    moonName: "",
    startDateTime: "",
    endDateTime: "",
    alarmDateTime: "",
    note: "",
    teams: [],
    description: "",
  });
  const popupState = useSelector((state) => state.data.moonModal);
  const successState = useSelector((state) => state.moon.successMessage);
  const editSuceessSate = useSelector((state) => state.moon.editSuccess);
  const singleUserData = useSelector((state) => state?.signin?.signin);
  const userTokendata = useSelector((state) => state.signin.signin);
  const moonTeamData = useSelector((state) => state?.moon);
  const filterNotify = addMoon?.teams?.filter(
    (id) => id?.userId !== singleUserData?.userid
  );

  useEffect(() => {
    if (Object.keys(singleUserData).length > 0) {
      addMoon?.teams?.push({
        userId: singleUserData?.userid,
        userName: singleUserData?.username,
      });
      setAddMoon(addMoon);
    }
  }, [singleUserData]);

  if (editSuceessSate === "success" && popupState === true) {
    popupState = false;
    dispatch(chnageMoonPopupStateValue(popupState));
    dispatch(editMoonSuccess(""));
    Router.push({
      pathname: '/satellite',
      query: { moonId: moonId }
  }, '/satellite');
  }

  if (successState === "success" && popupState === true) {
    popupState = false;
    dispatch(chnageMoonPopupStateValue(popupState));
    dispatch(successAddMoon(""));
  }

  const handleRange = (e) => {
    let inputRange = e.target.value;
    setPriorityErr("");
    if (singleMoonData) {
      setEditFormStar({ ...editFormStar, ["priority"]: inputRange });
    } else {
      setAddMoon({ ...addMoon, ["priority"]: inputRange });
    }
  };

  const closeMoonPopup = () => {
    popupState = false;
    dispatch(chnageMoonPopupStateValue(popupState));
    setAddMoon({
      moonName: "",
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
    setmoonNameErr("");
    setDescriptionErr("");
    setNotesErr("");
    setAttachmentsErr("");
    setStartDateTimeErr("");
    setFinishDateTimeErr("");
    setAlarmDateTimeErr("");
    setPriorityErr("");
  };

  const [loader, setLoader] = useState(false);
  const [removeLoader, setRemoveLoader] = useState(false);

  const URLS = "";
  const multiURLS = [];

  const onHandleMoonChange = (e) => {
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
          const storageRef = ref(storage, `/moons/${file.name}`);
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
                  if (moonImages?.length > 0) {
                    setLoader(false);
                    moonImages.push({
                      attachmentPath: URLS,
                    });
                  } else {
                    setUrlState(URLS);
                    // multiURLS.push(URLS);
                    multiAttachments.push(URLS);
                    setLoader(false);
                  }
                }
                setAttachmentsErr("");
              });
            }
          );
        });
        setAddMoon({ ...addMoon, ["attachments"]: URLS });
      }
    }
  };

  const deleteImages = (index, attachMents) => {
    if (moonImages?.length > 0) {
      const filterData = moonImages.splice(index, 1);
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

    // if (singleMoonData) {
    //   if (isEmpty(editFormStar.moonName)) {
    //     setmoonNameErr("Please enter moon name");
    //     isValid = false;
    //   } else {
    //     if (!/^[a-zA-Z0-9_ ]*$/.test(editFormStar.moonName)) {
    //       setmoonNameErr("Special character are not allowed");
    //       isValid = false;
    //     }
    //   }
    // } else {
    if (isEmpty(addMoon.moonName)) {
      setmoonNameErr("Please enter moon name");
      isValid = false;
    } else {
      if (!/^[a-zA-Z0-9-.@\s]+$/.test(addMoon?.moonName)) {
        setmoonNameErr("Special character are not allowed");
        isValid = false;
      }
    }
    if (!addMoon.startDateTime) {
      setStartDateTimeErr("Please select start datetime");
      isValid = false;
    }
    if (!addMoon.endDateTime) {
      setFinishDateTimeErr("Please select finish datetime");
      isValid = false;
    }
    // if (!addMoon.alarmDateTime) {
    //   setAlarmDateTimeErr("Please select alarm datetime");
    //   isValid = false;
    // }

    return isValid;
  };

  const handleChangeStar = (e) => {
    let { name, value } = e.target;

    if (e.target.name === "moonName") {
      setmoonNameErr("");
    }

    setAddMoon({
      ...addMoon,
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
      setAddMoon({ ...addMoon, ["startDateTime"]: startDate });
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
      setAddMoon({ ...addMoon, ["endDateTime"]: finishDate });
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
      setAddMoon({ ...addMoon, ["alarmDateTime"]: alarmDate });
      // setEditFormStar({ ...editFormStar, ["alarmDateTime"]: alarmDate });
    }
  };

  const dataSend = {};
  const sendIamge = "";
  const notification = "";
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateStarForm();

    if (singleMoonData) {
      if (moonImages.length > 0) {
        sendIamge = moonImages.map((item) => {
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
        updatemoonId: moonId.toString(),
        planetId: Number(singleMoonData.planetId),
        moonName: addMoon?.moonName,
        description: addMoon?.description,
        startDateTime: addMoon?.startDateTime,
        endDateTime: addMoon?.endDateTime,
        alarmDateTime: addMoon?.alarmDateTime,
        priority: addMoon?.priority.toString(),
        note: addMoon?.note,
        createdBy: userId.toString(),
        teams: addMoon?.teams?.map((item) => {
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
            singleUserData.username + " has update moon" + addMoon?.moonName,
          type: "Moon",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addMoon?.startDateTime,
          endDateTime: addMoon?.endDateTime,
        };
      }

      // console.log("notification :::::", notification);
      // console.log("moonImages", moonImages);
      // console.log("dataSend", dataSendEdit);
      // return;
      if (isValid) {
        dispatch(editMoonData(dataSendEdit, notification));
      }
    } else {
      if (addMoon) {
        dataSend = {
          planetId: Number(planetId),
          moonName: addMoon.moonName,
          description: addMoon.description,
          startDateTime: addMoon.startDateTime,
          endDateTime: addMoon.endDateTime,
          alarmDateTime: addMoon.alarmDateTime,
          priority: addMoon.priority ? addMoon.priority : "5",
          note: addMoon.note,
          createdBy: userId.toString(),
          teams: addMoon?.teams?.map((item) => {
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
            userTokendata.username + " has created moon " + addMoon?.moonName,
          type: "Moon",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addMoon.startDateTime,
          endDateTime: addMoon.endDateTime,
        };
      }

      // console.log("dataSend", dataSend);
      // return;

      if (isValid) {
        dispatch(
          addMoonsData(
            dataSend,
            pageNumber,
            PageSize,
            planetId,
            notification,
            singleUserData
          )
        );
        setAddMoon({
          moonName: "",
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
  const already_add_member = [];
  const addMembers = (value) => {
    // if (singlePlanetData) {
    //   singlePlanetData?.map((item) => {
    //     already_add_member.push(item.userId);
    //     setSendUserIds(already_add_member);
    //   });

    //   dispatch(getAllUsersData(value, userId, sendUserIds));
    // } else 
    if (!value && addMoon?.teams.length > 0) {
      dispatch(getAllUsersData("", userId, sendUserIds, "Removetag"));
    } else {
      if (addMoon?.teams?.length > 0) {
        addMoon?.teams?.map((item) => {
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

  //At the time of selection of member
  // useEffect(() => {
  //   if (selectedUser.length > 0) {
  //     selectedUser.map((item) => {
  //       array.push(item.userId);
  //       setSendUserIds(array);
  //     });

  //     dispatch(getAllUsersData("", userId, sendUserIds));
  //   }

  //   if (addMoon?.teams?.length > 0) {
  //     addMoon?.teams?.map((item) => {
  //       edit_array.push(item.userId);
  //       setSendUserIds(edit_array);
  //     });

  //     dispatch(getAllUsersData("", userId, sendUserIds, "Removetag"));
  //   }
  // }, [selectedUser, moonTeams]);

  let getArrayOfTeam = [];
  if (moonTeams) {
    if (selectedUser.length !== moonTeams.length && !selectedUserFlag) {
      for (let i = 0; i < moonTeams.length; i++) {
        getArrayOfTeam.push({
          userId: moonTeams[i].userId,
          label: moonTeams[i].username,
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
    if (addMoon?.teams.length === 0) {
      addMoon?.teams([]);
    } else {
      // setSelectedUser(addMoon?.teams.filter((el, i) => i !== index));
      setAddMoon((addMoon) => ({
        ...addMoon,
        teams: addMoon?.teams.filter((items, i) => index !== i),
      }));
    }
  };

  //handle space
  const handleMemberKeyDown = (e) => {
    if (e.key === " " && addMoon?.teams?.length === 0) {
      e.preventDefault();
    }
  };

  const handleKeyDownSpace = (e) => {
    if (e.key === " " && addMoon?.moonName?.length === 0) {
      e.preventDefault();
    }
  };

  const handleDesKey = (e) => {
    if (e.key === " " && addMoon?.description?.length === 0) {
      e.preventDefault();
    }
  };

  const handleNoteKey = (e) => {
    if (e.key === " " && addMoon?.note?.length === 0) {
      e.preventDefault();
    }
  };

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  //Add Muliple member
  const prevAddMoon = "";
  const handleMulipleArray = (Members) => {
    setValue();
    if (addMoon?.teams !== undefined && prevAddMoon !== undefined) {
      setAddMoon((prevAddMoon) => ({
        ...prevAddMoon,
        teams: [
          ...prevAddMoon?.teams,
          {
            userId: Members.value.toString(),
            userName: Members.label,
          },
        ],
      }));
    } else {
      setAddMoon((prevAddMoon) => ({
        ...prevAddMoon,
        teams: [
          {
            userId: Members.value.toString(),
            userName: Members.label,
          },
        ],
      }));
    }
  };

  // console.log("singleMoonData?.planetId ::::", singleMoonData);
  // return;
  const handleMoveToArchive = () => {
    const sendData = {
      moonId: Number(moonId),
      isArchive: true,
      userId: userId,
    };

    const type = "add";
    dispatch(
      addArchiveMoonsOfUser(sendData, type, 1, 10, singleMoonData?.planetId)
    );
  };

  const changeCase = (event) => {
    event.preventDefault();
    const data =
      addMoon?.moonName?.charAt(0).toUpperCase() + addMoon?.moonName?.slice(1);
    setAddMoon({ ...addMoon, ["moonName"]: data });
  };

  return (
    <>
      <div className="addmoon-popup-wrapper">
        <div className="add-moon-form">
          <div className="add-moon-form-body">
            <div className="moon-form-wrapper">
              <form onSubmit={handleSubmit}>
                <div className="form-field-wrapper">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={NotesIcone} />
                      Moon Name
                    </label>
                    <span className="input-field-wrapper">
                      <input
                        type="text"
                        autoComplete="off"
                        name="moonName"
                        placeholder="Moon Name"
                        className="form-control"
                        onKeyUp={changeCase}
                        onChange={handleChangeStar}
                        value={addMoon?.moonName || ""}
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
                            : addMoon?.startDateTime
                            ? moment(addMoon?.startDateTime).format(
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
                        placeholderText="Finish DateTime"
                        selected={endSelectedDate}
                        minDate={startSelectedDate ? startSelectedDate : today}
                        // onChange={(date) => setEndSelectedDate(date)}
                        onChange={(date) => finishDateTime(date)}
                        value={
                          endSelectedDate
                            ? moment(endSelectedDate).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : addMoon?.endDateTime
                            ? moment(addMoon?.endDateTime).format(
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
                        selected={alarmSelectedDate}
                        placeholderText="Alarm DateTime"
                        showTimeSelect
                        onChange={(date) => alarmDateTimeChange(date)}
                        value={
                          alarmSelectedDate
                            ? moment(alarmSelectedDate).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : addMoon?.alarmDateTime
                            ? moment(addMoon?.alarmDateTime).format(
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
                          {addMoon?.teams?.map((newTags, index) => (
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
                              addMoon?.priority == item.name ? "true" : "false"
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
                      Moon Description
                    </label>
                    <span className="textarea-field-wrapper">
                      <textarea
                        className="form-control"
                        placeholder="Moon Description"
                        name="description"
                        onChange={handleChangeStar}
                        value={addMoon?.description || ""}
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
                        value={addMoon?.note || ""}
                        onKeyDown={handleNoteKey}
                      ></textarea>
                    </span>
                  </div>
                </div>

                <div className="form-field-wrapper form-full-width file-upload-input-moon">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={PriorityIcon} />
                      Upload Document
                    </label>
                    <div className="upload-document-wrapper-moon">
                      <label htmlFor="moon-file" className="custom-file-moon">
                        Upload Document
                      </label>
                      <input
                        type="file"
                        name="attachments"
                        id="moon-file"
                        // accept="image/*"
                        onChange={onHandleMoonChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="show_images">
                  {!moonImages?.length ? (
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
                  ) : moonImages && moonImages.length > 0 ? (
                    moonImages.map((items, index) => {
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
                    "12331"
                  )}
                </div>

                <div className="add-btn-wrapper">
                  <input
                    type="button"
                    name=""
                    value="Cancel"
                    className="submit-btn-wrapper gradient-btn"
                    onClick={closeMoonPopup}
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
                    value={singleMoonData ? "Update" : "Add"}
                    className="submit-btn-wrapper gradient-btn"
                  />
                </div>
              </form>
              {singleMoonData && (
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

export default Addmoon;
