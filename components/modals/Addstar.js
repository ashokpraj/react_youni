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
  chnagePanetPopupStateValue,
  chnagePopupStateValue,
} from "../../redux/actions/popup";
import { docShow, imageShow, pdfShow } from "../utils/showImages";
import { getAllUsersData } from "../../redux/actions/users";
import isEmpty from "../validation/isEmpty";
import moment from "moment";
import {
  addArchiveStarsOfUser,
  addSatarsData,
  editSatarsData,
} from "../../redux/actions/star";
import { storage } from "../../lib/firebase-config";
import { getStorage } from "firebase/storage";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Router, { useRouter } from "next/router";
import tagCloseIcon from "../../style/assets/images/close-icon.svg";
import { editStarsSuccess } from "../../redux/actions/star";
import { successAddSatr } from "../../redux/actions/star";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";

const Addstar = ({
  singleStarData,
  starImages,
  starId,
  pageNumber,
  PageSize,
}) => {
  const planetPopupState = useSelector((state) => state.data.planetModal);
  const [startSelectedDate, setStartSelectedDate] = useState();
  const [endSelectedDate, setEndSelectedDate] = useState();
  const [alarmSelectedDate, setAlarmSelectedDate] = useState();
  const [images, setImages] = useState("");
  const [prjectNameErr, setProjectNameErr] = useState("");
  const [startDateTimeErr, setStartDateTimeErr] = useState("");
  const [FinishTimeErr, setFinishDateTimeErr] = useState("");
  const [AlarmTimeErr, setAlarmDateTimeErr] = useState("");
  const [userId, setUserId] = useState();
  const today = new Date();
  const dispatch = useDispatch();
  const [percent, setPercent] = useState(0);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedMemberAddFlag, setSelectedMemberAddFlag] = useState(false);
  const [newTags, setNewtags] = useState([]);
  const [sendUserIds, setSendUserIds] = useState([]);
  const [multiAttachments, setMultiAttachments] = useState([]);
  const [value, setValue] = useState();
  const [slugValue, setSlugValue] = useState("");
  const router = useRouter();
  const [onBoardId, setOnBoardId] = useState();
  const [localOnBoardId,setlocalOnBoardId] = useState();
  let URL = "";

  const singleUserData = useSelector((state) => state?.signin?.signin);

  useEffect(() => {
    URL = window.location.href.split("/");
    setSlugValue(URL[3]);

    const query = router.query;

    if (query.onBoardId) {
      setOnBoardId(query.onBoardId)
      localStorage.setItem("onBoardId", query.onBoardId);
      setlocalOnBoardId(query.onBoardId)
    } else {
      setlocalOnBoardId(localStorage.getItem("onBoardId"));
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userID) {
      setUserId(userData.userID);
    }

    //For check Star images is there or not.
    if (starImages?.length > 0) {
      setImages(starImages);
    }
  }, [userId, starImages?.length,localOnBoardId]);

  const [addStar, setAddStar] = useState({
    projectName: "",
    startDateTime: "",
    endDateTime: "",
    alarmDateTime: "",
    note: "",
    teams: [],
    description: "",
  });

  const filterNotify = addStar?.teams?.filter(
    (id) => id?.userId !== singleUserData?.userid
  );

  useEffect(() => {
    if (singleStarData) {
      setAddStar(singleStarData);
    }
  }, [singleStarData]);

  useEffect(() => {
    if (Object.keys(singleUserData).length > 0) {
      addStar?.teams?.push({
        userId: singleUserData?.userid,
        userName: singleUserData?.username,
      });
      setAddStar(addStar);
    }
  }, [singleUserData]);

  const allUsers = useSelector((state) => state.user.allUsers);
  const isLoading = useSelector((state) => state.star.loading);
  const popupState = useSelector((state) => state.data.starModal);
  const successState = useSelector((state) => state.star.successMessage);
  const editSuceessSate = useSelector((state) => state.star.editSuccess);

  if (editSuceessSate === "success" && popupState === true) {
    popupState = false;
    dispatch(chnagePopupStateValue(popupState));
    dispatch(editStarsSuccess(""));
    Router.push({
      pathname: '/planet',
      query: { projectId: starId }
  }, '/planet');
  }

  if (successState === "success" && popupState === true) {
    popupState = false;
    dispatch(chnagePopupStateValue(popupState));
    dispatch(successAddSatr(""));
  }

  const handleRange = (e) => {
    let inputRange = e.target.value;
    setAddStar({ ...addStar, ["priority"]: inputRange });
  };

  const closeStarPopup = () => {
    setAddStar({
      projectName: "",
      startDateTime: "",
      endDateTime: "",
      alarmDateTime: "",
      note: "",
      teams: [
        {
          userId: singleUserData?.userid,
          userName: singleUserData?.username,
        },
      ],
      description: "",
    });
    setStartSelectedDate("");
    setEndSelectedDate("");
    setAlarmSelectedDate("");
    setSelectedUser([]);
    setMultiAttachments([]);
    emptyValidation();

    if (onBoardId || localOnBoardId) {
      Router.push(`/upcomingstars`);
    } else {
      if (slugValue === "dashboard") {
        Router.push(`/dashboard`);
      } else {
        Router.push({
          pathname: '/planet',
          query: { projectId: starId }
      }, '/planet');
      }
    }

    popupState = false;
    dispatch(chnagePopupStateValue(popupState));

    planetPopupState = false;
    dispatch(chnagePanetPopupStateValue(planetPopupState));
  };

  const [loader, setLoader] = useState(false);
  const [removeLoader, setRemoveLoader] = useState(false);

  const URLS = "";

  const onHandleStarChange = (e) => {
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
          if (err) {
          }
          setImages([...images, ...newImages]);

          //Upload Image on Firebase
          file["id"] = Math.random();
          const promises = [];
          const storageRef = ref(storage, `/star/${file.name}`);
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
                  if (starImages?.length > 0) {
                    setLoader(false);
                    starImages.push({
                      attachmentPath: URLS,
                    });
                  } else {
                    multiAttachments.push(URLS);
                    setLoader(false);
                  }
                }
              });
            }
          );
          setAddStar({ ...addStar, ["attachments"]: URLS });
        });
      }
    }
  };
  const deleteImages = (index, attachMents) => {
    if (starImages?.length > 0) {
      const storage = getStorage();
      const desertRef = ref(storage, attachMents);

      // Delete the file
      setRemoveLoader(true);
      deleteObject(desertRef)
        .then(() => {
          setRemoveLoader(false);
        })
        .catch((error) => {
          setRemoveLoader(false);
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

    if (isEmpty(addStar?.projectName)) {
      setProjectNameErr("Please enter star name");
      isValid = false;
    } else {
      if (!/^[a-zA-Z0-9-.@\s]+$/.test(addStar?.projectName)) {
        setProjectNameErr("Special character are not allowed");
        isValid = false;
      }
    }
    if (!addStar?.startDateTime) {
      setStartDateTimeErr("Please select start datetime");
      isValid = false;
    }
    if (!addStar?.endDateTime) {
      setFinishDateTimeErr("Please select finish datetime");
      isValid = false;
    }
    // if (!addStar?.alarmDateTime) {
    //   setAlarmDateTimeErr("Please select alarm datetime");
    //   isValid = false;
    // }

    return isValid;
  };

  const handleChangeStar = (e) => {
    let { name, value } = e.target;

    if (e.target.name === "projectName") {
      setProjectNameErr("");
    }

    setAddStar({ ...addStar, [name]: value });
  };

  const startDateTimeChange = (date) => {
    if (!date) {
      setStartDateTimeErr("Please select start datetime");
    } else {
      setStartDateTimeErr("");
      setStartSelectedDate(date);
      let startDate = moment(date).format();
      setAddStar({ ...addStar, ["startDateTime"]: startDate });
    }
  };

  const finishDateTime = (date) => {
    if (!date) {
      setEndSelectedDate("Please select finish datetime");
    } else {
      setFinishDateTimeErr("");
      setEndSelectedDate(date);
      let finishDate = moment(date).format();
      setAddStar({ ...addStar, ["endDateTime"]: finishDate });
    }
  };

  const alarmDateTimeChange = (date) => {
    if (!date) {
      setAlarmDateTimeErr("Please select alarm datetime");
    } else {
      setAlarmDateTimeErr("");
      setAlarmSelectedDate(date);
      let alarmDate = moment(date).format();

      setAddStar({ ...addStar, ["alarmDateTime"]: alarmDate });
    }
  };

  const notification = "";
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateStarForm();

    const dataSend = "";
    const sendIamge = "";
    if (singleStarData) {
      planetPopupState = false;
      dispatch(chnagePanetPopupStateValue(planetPopupState));

      if (starImages?.length > 0) {
        sendIamge = starImages?.map((item) => {
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

      // console.log("addStar?.teams ::::", addStar?.teams);

      const dataSendEdit = {
        updateProjectId: starId?.toString(),
        projectName: addStar?.projectName,
        description: addStar?.description,
        startDateTime: addStar?.startDateTime,
        endDateTime: addStar?.endDateTime,
        alarmDateTime: addStar?.alarmDateTime,
        priority: addStar?.priority.toString(),
        note: addStar?.note,
        createdBy: userId?.toString(),
        teams: addStar?.teams?.map((item) => {
          {
            return {
              userId: item?.userId?.toString(),
              userName: item?.userName,
            };
          }
        }),
        attachments: sendIamge,
      };

      // console.log("dataSendEdit ::::", dataSendEdit);
      // return;

      if (filterNotify?.length > 0) {
        notification = {
          typeId: starId,
          description:
            singleUserData.username +
            " has updated star " +
            addStar?.projectName,
          type: "Star",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addStar?.startDateTime,
          endDateTime: addStar?.endDateTime,
        };
      }

      // console.log("filterNotify :::::", filterNotify);
      // return;
      if (isValid) {
        localStorage.removeItem("onBoardId");
        dispatch(editSatarsData(dataSendEdit, notification));
      }
    } else if (addStar) {
      dataSend = {
        projectName: addStar?.projectName,
        description: addStar?.description,
        startDateTime: addStar?.startDateTime,
        endDateTime: addStar?.endDateTime,
        alarmDateTime: addStar?.alarmDateTime,
        priority: addStar?.priority ? addStar?.priority : "5",
        note: addStar?.note,
        createdBy: userId.toString(),
        teams: addStar?.teams?.map((item) => {
          {
            return {
              userId: item?.userId?.toString(),
              userName: item?.userName,
            };
          }
        }),
        attachments: multiAttachments.map((item) => {
          {
            return { attachmentPath: item };
          }
        }),
      };

      // console.log("dataSend ::::", dataSend);
      // return;
      //Notification Users Array

      if (filterNotify?.length > 0) {
        notification = {
          description:
            singleUserData.username +
            " has created star  " +
            addStar?.projectName,
          type: "Star",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addStar.startDateTime,
          endDateTime: addStar.endDateTime,
        };
      }

      // console.log("notification :::::::", notification);
      // return;
      if (isValid) {
        dispatch(
          addSatarsData(
            dataSend,
            pageNumber,
            PageSize,
            userId,
            notification,
            singleUserData
          )
        );

        setAddStar({
          projectName: "",
          startDateTime: "",
          endDateTime: "",
          alarmDateTime: "",
          note: "",
          teams: [
            {
              userId: singleUserData?.userid,
              userName: singleUserData?.username,
            },
          ],
          description: "",
        });
        setStartSelectedDate("");
        setEndSelectedDate("");
        setAlarmSelectedDate("");
        setSelectedUser([]);
        setMultiAttachments([]);
      }
    }
  };
  const emptyValidation = (e) => {
    setProjectNameErr("");
    setStartDateTimeErr("");
    setFinishDateTimeErr("");
    setAlarmDateTimeErr("");
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

  const edit_array = [];
  const addMembers = (value) => {
    if (!value && addStar?.teams.length > 0) {
      dispatch(getAllUsersData("", userId, sendUserIds, "Removetag"));
    } else {
      if (addStar?.teams?.length > 0) {
        addStar?.teams?.map((item) => {
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
  const array = [];
  useEffect(() => {
    if (selectedUser.length > 0) {
      selectedUser.map((item) => {
        array.push(item.userId);
        setSendUserIds(array);
      });

      dispatch(getAllUsersData("", userId, sendUserIds));
    }
  }, [selectedUser]);

  let getArrayOfTeam = [];

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
    if (addStar?.teams.length === 0) {
      addStar?.teams([]);
    } else {
      setAddStar((addStar) => ({
        ...addStar,
        teams: addStar?.teams.filter((items, i) => index !== i),
      }));
    }
  };

  //handle space
  const handleMemberKeyDown = (e) => {
    if (e.key === " " && addStar?.teams?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " " && addStar?.projectName?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleDesKey = (e) => {
    if (e.key === " " && addStar?.description?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleNoteKey = (e) => {
    if (e.key === " " && addStar?.note?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleMoveToArchive = () => {
    const sendData = {
      projectId: Number(starId),
      isArchive: true,
      userId: userId,
    };

    const type = "add";
    dispatch(addArchiveStarsOfUser(sendData, type));
  };

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  //Add Muliple member
  const prevAddStar = "";
  const handleMulipleArray = (Members) => {
    setValue();
    if (addStar?.teams !== undefined && prevAddStar !== undefined) {
      setAddStar((prevAddStar) => ({
        ...prevAddStar,
        teams: [
          ...prevAddStar?.teams,
          {
            userId: Members.value.toString(),
            userName: Members.label,
          },
        ],
      }));
    } else {
      setAddStar((prevAddStar) => ({
        ...prevAddStar,
        teams: [
          {
            userId: Members.value.toString(),
            userName: Members.label,
          },
        ],
      }));
    }
  };

  const changeCase = (event) => {
    event.preventDefault();
    const data =
      addStar?.projectName?.charAt(0).toUpperCase() +
      addStar?.projectName?.slice(1);
    setAddStar({ ...addStar, ["projectName"]: data });
  };

  return (
    <>
      <div className="common-popup-wrapper">
        <div className="common-add-form">
          <div className="common-add-form-body">
            <div className="form-wrapper">
              <form onSubmit={handleSubmit}>
                <div className="form-field-wrapper">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={NotesIcone} />
                      Star Name
                    </label>
                    <span className="input-field-wrapper">
                      <input
                        type="text"
                        name="projectName"
                        placeholder="Star Name"
                        className="form-control"
                        onKeyUp={changeCase}
                        onChange={handleChangeStar}
                        value={addStar?.projectName || ""}
                        onKeyDown={handleKeyDown}
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
                            : addStar?.startDateTime
                            ? moment(addStar?.startDateTime).format(
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
                        onChange={(date) => finishDateTime(date)}
                        value={
                          endSelectedDate
                            ? moment(endSelectedDate).format(
                                "DD-MM-yyyy h:mm A"
                              )
                            : addStar?.endDateTime
                            ? moment(addStar?.endDateTime).format(
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
                            : addStar?.alarmDateTime
                            ? moment(addStar?.alarmDateTime).format(
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
                        autoComplete="off"
                        className="tags-input"
                        name="member"
                        placeholder="Add Members"
                        onChange={handlechange}
                        onKeyDown={handleMemberKeyDown}
                      />
                      <div className="tags-wrapper">
                        <div className="tags-results-wrap">
                          {addStar?.teams?.map((newTags, index) => (
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
                      defaultValue="5"
                    >
                      {Priorities.map((item, i) => {
                        return (
                          <option
                            name="priority"
                            key={i}
                            value={item.name}
                            selected={
                              addStar?.priority == item.name ? "true" : "false"
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
                      Star Description
                    </label>
                    <span className="textarea-field-wrapper">
                      <textarea
                        className="form-control"
                        placeholder="Star Description"
                        name="description"
                        onChange={handleChangeStar}
                        onKeyDown={handleDesKey}
                        value={addStar?.description || ""}
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
                        value={addStar?.note || ""}
                        onKeyDown={handleNoteKey}
                        pattern="[^\s]+"
                      ></textarea>
                    </span>
                  </div>
                </div>

                <div className="form-field-wrapper form-full-width file-upload-input-star">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={PriorityIcon} />
                      Upload Document
                    </label>
                    <div className="upload-document-wrapper-star">
                      <label
                        htmlFor="star-file"
                        className="custom-file-wrapper"
                      >
                        Upload Document
                      </label>
                      <input
                        type="file"
                        name="attachments"
                        id="star-file"
                        // accept="image/*"
                        onChange={onHandleStarChange}
                        // multiple
                      />
                    </div>
                  </div>
                </div>

                <div className="show_images">
                  {!starImages?.length ? (
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
                  ) : starImages && starImages.length > 0 ? (
                    starImages.map((items, index) => {
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
                                deleteImages(index, items?.attachmentPath)
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
                    onClick={closeStarPopup}
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
                    value={singleStarData ? "Update" : "Add"}
                    className="submit-btn-wrapper gradient-btn"
                  />
                </div>
              </form>
              {singleStarData && !onBoardId && (
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

export default Addstar;
