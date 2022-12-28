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
import {
  chnageCometPopupStateValue,
  chnagePanetPopupStateValue,
  chnagePopupStateValue,
} from "../../redux/actions/popup";
import { docShow, imageShow, pdfShow, videoShow } from "../utils/showImages";
import {
  getAllUsersData,
  setAllSelectedMember,
} from "../../redux/actions/users";
import isEmpty from "../validation/isEmpty";
import moment from "moment";
import {
  addArchiveCometsOfUser,
  addCometData,
  editCometData,
  getAllCometsByUserId,
} from "../../redux/actions/comet";
import { storage } from "../../lib/firebase-config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Router, { useRouter } from "next/router";
import tagCloseIcon from "../../style/assets/images/close-icon.svg";
import { getStorage } from "firebase/storage";
import { editCometSuccess, successAddComet } from "../../redux/actions/comet";
import { get as _get } from "lodash";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";
const Addcomet = ({
  singleCometData,
  cometImages,
  cometId,
  pageNumber,
  PageSize,
  bearerToken,
}) => {
  const router = useRouter();

  const [startSelectedDate, setStartSelectedDate] = useState();
  const [endSelectedDate, setEndSelectedDate] = useState();
  const [alarmSelectedDate, setAlarmSelectedDate] = useState();
  const [images, setImages] = useState("");
  const [tags, setTags] = useState([]);
  const [prjectNameErr, setcometNameErr] = useState("");
  const [startDateTimeErr, setStartDateTimeErr] = useState("");
  const [FinishTimeErr, setFinishDateTimeErr] = useState("");
  const [AlarmTimeErr, setAlarmDateTimeErr] = useState("");
  const [userId, setUserId] = useState();
  const today = new Date();
  const dispatch = useDispatch();
  const [percent, setPercent] = useState(0);
  const [urlState, setUrlState] = useState();
  const comets = useSelector((state) => state.comet.cometsData);
  const popupCometState = useSelector((state) => state.data.cometModal);
  const [selectedUserFlag, setSelectedUserFlag] = useState(false);
  const [newTags, setNewtags] = useState([]);
  const [sendUserIds, setSendUserIds] = useState([]);
  const [multiAttachments, setMultiAttachments] = useState([]);
  const [filterDataImages, setFilterDataImages] = useState([]);
  const [slugValue, setSlugValue] = useState("");
  const [value, setValue] = useState();
  const [onBoardId, setOnBoardId] = useState();
  const query = router.query;
  let URL = "";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.userID) {
      setUserId(userData.userID);
    }
    URL = window.location.href.split("/");
    setSlugValue(URL[3]);

    //For check Star images is there or not.
    if (cometImages?.length > 0) {
      setImages(cometImages);
    }
  }, [userId, comets,cometImages?.length]);

  const allUsers = useSelector((state) => state.user.allUsers);
  const singleUserData = useSelector((state) => state?.signin?.signin);
  const isLoading = useSelector((state) => state.comet.loading);
  const planetPopupState = useSelector((state) => state.data.planetModal);

  const commaSep = "";
  useEffect(() => {
    if (query.onBoardId) {
      setOnBoardId(query.onBoardId);
    }
    if (singleCometData) {
      setAddComet(singleCometData);
    }
  }, [singleCometData]);

  const [addComet, setAddComet] = useState({
    cometName: "",
    startDateTime: "",
    endDateTime: "",
    alarmDateTime: "",
    description: "",
    note: "",
    teams: [],
  });
  const filterNotify = addComet?.teams?.filter(
    (id) => id?.userId !== singleUserData?.userid
  );
  useEffect(() => {
    if (Object.keys(singleUserData).length > 0) {
      addComet?.teams?.push({
        userId: singleUserData?.userid,
        userName: singleUserData?.username,
      });
      setAddComet(addComet);
    }
  }, [singleUserData]);

  const popupState = useSelector((state) => state?.data?.cometModal);

  const successState = useSelector((state) => state.comet.successMessage);
  const editSuceessSate = useSelector((state) => state.comet.editSuccess);

  if (editSuceessSate === "success" && popupState === true) {
    emptyState();
    popupState = false;
    dispatch(chnageCometPopupStateValue(popupState));
    if (slugValue === "dashboard") {
      Router.push("/dashboard");
    } else {
      Router.push({
        pathname: '/comet',
        query: { userId: userId }
    }, '/comet');
    }
    dispatch(editCometSuccess(""));
  }

  if (successState === "success" && popupState === true) {
    dispatch(chnageCometPopupStateValue(popupState));
    if (slugValue === "dashboard") {
      Router.push("/dashboard");
    } else {
      Router.push({
        pathname: '/comet',
        query: { userId: userId }
    }, '/comet');
    }
    popupState = false;
    dispatch(chnageCometPopupStateValue(popupState));
    dispatch(successAddComet(""));
  }

  const handleRange = (e) => {
    let inputRange = e.target.value;

    setAddComet({ ...addComet, ["priority"]: inputRange });
  };

  const emptyValidation = (e) => {
    setcometNameErr("");
    setStartDateTimeErr("");
    setFinishDateTimeErr("");
    setAlarmDateTimeErr("");
  };

  const [loader, setLoader] = useState(false);
  const [removeLoader, setRemoveLoader] = useState(false);

  const URLS = "";
  const multiURLS = [];

  const onHandleCometChnage = (e) => {
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
          const storageRef = ref(storage, `/comets/${file.name}`);
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
                  if (cometImages?.length > 0) {
                    setLoader(false);
                    cometImages.push({
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
          setAddComet({ ...addComet, ["attachments"]: URLS });
        });
      }
    }
  };

  const deleteImages = (index, attachMents) => {
    if (cometImages?.length > 0) {
      const filterData = cometImages.splice(index, 1);
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
      // multiAttachments.map((items) => {
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

    if (isEmpty(addComet?.cometName)) {
      setcometNameErr("Please enter comet name");
      isValid = false;
    } else {
      if (!/^[a-zA-Z0-9-.@\s]+$/.test(addComet.cometName)) {
        setcometNameErr("Special character are not allowed");
        isValid = false;
      }
    }
    if (!addComet?.startDateTime) {
      setStartDateTimeErr("Please select start datetime");
      isValid = false;
    }
    if (!addComet?.endDateTime) {
      setFinishDateTimeErr("Please select finish datetime");
      isValid = false;
    }
    // if (!addComet?.alarmDateTime) {
    //   setAlarmDateTimeErr("Please select alarm datetime");
    //   isValid = false;
    // }

    return isValid;
  };

  const handleChangeStar = (e) => {
    let { name, value } = e.target;
    // setEditFormStar({ ...editFormStar, [name]: value });

    if (e.target.name === "cometName") {
      setcometNameErr("");
    }

    setAddComet({
      ...addComet,
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
      setAddComet({ ...addComet, ["startDateTime"]: startDate });
    }
  };

  const finishDateTime = (date) => {
    if (!date) {
      setEndSelectedDate("Please select finish datetime");
    } else {
      setFinishDateTimeErr("");
      setEndSelectedDate(date);
      let finishDate = moment(date).format();
      setAddComet({ ...addComet, ["endDateTime"]: finishDate });
    }
  };

  const alarmDateTimeChange = (date) => {
    if (!date) {
      setAlarmDateTimeErr("Please select alarm datetime");
    } else {
      setAlarmDateTimeErr("");
      setAlarmSelectedDate(date);
      let alarmDate = moment(date).format();
      setAddComet({ ...addComet, ["alarmDateTime"]: alarmDate });
    }
  };

  const notification = "";
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateStarForm();

    const dataSend = "";
    const sendIamge = "";
    if (singleCometData) {
      planetPopupState = false;
      dispatch(chnagePanetPopupStateValue(planetPopupState));
    }
    if (singleCometData) {
      if (cometImages?.length > 0) {
        sendIamge = cometImages?.map((item) => {
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
        cometId: Number(cometId),
        updateCometId: cometId.toString(),
        cometName: addComet?.cometName,
        description: addComet?.description,
        startDateTime: addComet?.startDateTime,
        endDateTime: addComet?.endDateTime,
        alarmDateTime: addComet?.alarmDateTime,
        priority: addComet?.priority?.toString(),
        note: addComet?.note,
        createdBy: userId.toString(),
        teams: addComet?.teams?.map((item) => {
          {
            return {
              userId: item?.userId?.toString(),
              userName: item?.userName,
            };
          }
        }),
        attachments: sendIamge,
      };

      if (filterNotify?.length > 0) {
        notification = {
          typeId: cometId,
          description:
            singleUserData.username +
            " has update comet " +
            addComet?.cometName,
          type: "Comet",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addComet?.startDateTime,
          endDateTime: addComet?.endDateTime,
        };
      }

      // console.log("notification :::::", notification);
      // console.log("dataSend", JSON.stringify(dataSendEdit));
      // return;
      if (isValid) {
        dispatch(editCometData(dataSendEdit, notification));
        dispatch({ type: "CLEAR_COMET_STATE" });
        setImages("");
      }
    } else if (addComet) {
      dataSend = {
        cometName: addComet?.cometName,
        description: addComet?.description,
        startDateTime: addComet?.startDateTime,
        endDateTime: addComet?.endDateTime,
        alarmDateTime: addComet?.alarmDateTime,
        priority: addComet?.priority ? addComet?.priority : 5,
        note: addComet?.note,
        createdBy: userId.toString(),
        teams: addComet?.teams?.map((item) => {
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

      if (filterNotify?.length > 0) {
        notification = {
          description:
            singleUserData.username + " has added comet " + addComet?.cometName,
          type: "Comet",
          notifyTo: filterNotify?.map((item) => {
            return Number(item.userId);
          }),
          notifyBy: userId,
          isRead: false,
          startDateTime: addComet?.startDateTime,
          endDateTime: addComet?.endDateTime,
        };
      }

      // console.log("notification ::::", notification);
      // return;

      if (isValid) {
        dispatch(
          addCometData(
            dataSend,
            pageNumber,
            PageSize,
            userId,
            singleUserData,
            notification
          )
        );

        setAddComet({
          cometName: "",
          startDateTime: "",
          endDateTime: "",
          alarmDateTime: "",
          description: "",
          note: "",
          teams: [
            {
              userId: singleUserData?.userid,
              userName: singleUserData?.username,
            },
          ],
        });
        setMultiAttachments([]);
        setImages("");
        emptyValidation();
        dispatch({ type: "CLEAR_COMET_STATE" });
      }
    }
  };

  //While onchange of member
  const debounce = null;
  const handlechange = (e) => {
    // clearTimeout(debounce);
    // debounce = setTimeout(() => {
    setValue(e.target.value);
    addMembers(e.target.value, bearerToken);
    // }, 300);
  };

  const edit_array = [];
  const addMembers = (value) => {
    if (!value && addComet?.teams.length > 0) {
      dispatch(getAllUsersData("", userId, sendUserIds, "Removetag"));
    } else {
      if (addComet?.teams?.length > 0) {
        addComet?.teams?.map((item) => {
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
    if (addComet && addComet?.teams?.length > 0) {
      addComet?.teams?.map((item) => {
        array.push(item.userId);
        setSendUserIds(array);
      });

      // dispatch(getAllUsersData("", userId, sendUserIds, bearerToken));
    }
  }, [addComet]);

  const Priorities = [
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 },
    { id: 5, name: 5 },
  ];

  const removeTags = (index) => {
    setSelectedUserFlag(true);
    if (addComet?.teams.length === 0) {
      addComet?.teams([]);
    } else {
      setAddComet((addComet) => ({
        ...addComet,
        teams: addComet?.teams.filter((items, i) => index !== i),
      }));
    }
  };

  //handle space

  const handleMemberKeyDown = (e) => {
    if (e.key === " " && addComet?.teams?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " " && addComet?.cometName?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleDesKey = (e) => {
    if (e.key === " " && addComet?.description?.length === undefined) {
      e.preventDefault();
    }
  };

  const handleNoteKey = (e) => {
    if (e.key === " " && addComet?.note?.length === undefined) {
      e.preventDefault();
    }
  };

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  function emptyState() {
    setAddComet({
      cometName: "",
      startDateTime: "",
      endDateTime: "",
      alarmDateTime: "",
      description: "",
      note: "",
      teams: [
        {
          userId: singleUserData?.userid,
          userName: singleUserData?.username,
        },
      ],
      priority: 5,
    });
    setMultiAttachments([]);
  }

  const closeStarPopup = () => {
    popupState = false;
    dispatch(chnageCometPopupStateValue(popupState));

    dispatch({ type: "CLEAR_COMET_STATE" });

    if (onBoardId) {
      Router.push({
        pathname: '/upcomingcomet',
        query: { userId: userId }
    }, '/upcomingcomet');

    } else {
      if (slugValue === "dashboard") {
      } else {
        Router.push({
          pathname: '/comet',
          query: { userId: userId }
      }, '/comet');
      }
    }

    emptyValidation();
    emptyState();
    setImages("");
  };

  const handleMoveToArchive = (cometId) => {
    const sendData = {
      cometId: Number(cometId),
      isArchive: true,
      userId: userId,
    };

    const type = "add";
    dispatch(addArchiveCometsOfUser(sendData, type));
    if (popupCometState === true) {
      popupCometState = false;
      dispatch(chnageCometPopupStateValue(popupCometState));
      Router.push({
        pathname: '/comet',
        query: { userId: userId }
    }, '/comet');
    }
  };

  //Add Muliple member
  const prevAddStar = "";
  const handleMulipleArray = (Members) => {
    setValue();
    if (addComet?.teams !== undefined && prevAddStar !== undefined) {
      setAddComet((prevAddStar) => ({
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
      setAddComet((prevAddStar) => ({
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
      addComet?.cometName?.charAt(0).toUpperCase() +
      addComet?.cometName?.slice(1);
    setAddComet({ ...addComet, ["cometName"]: data });
  };

  return (
    <>
      <div className="addcomet-popup-wrapper">
        <div className="add-comet-form">
          <div className="add-comet-form-body">
            <div className="form-wrapper">
              <form onSubmit={handleSubmit}>
                <div className="form-field-wrapper">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={NotesIcone} />
                      Comet Name
                    </label>
                    <span className="input-field-wrapper">
                      <input
                        type="text"
                        autoComplete="off"
                        name="cometName"
                        placeholder="Comet Name"
                        className="form-control"
                        onKeyUp={changeCase}
                        onChange={handleChangeStar}
                        value={addComet?.cometName || ""}
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
                          addComet?.startDateTime
                            ? moment(addComet?.startDateTime).format(
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
                        placeholderText="Finish DateTime"
                        showTimeSelect
                        type="text"
                        autoComplete="off"
                        name="endDateTime"
                        selected={endSelectedDate}
                        minDate={startSelectedDate ? startSelectedDate : today}
                        onChange={(date) => finishDateTime(date)}
                        value={
                          addComet?.endDateTime
                            ? moment(addComet?.endDateTime).format(
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
                          addComet?.alarmDateTime
                            ? moment(addComet?.alarmDateTime).format(
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
                        name="teams"
                        placeholder="Add Members"
                        onChange={handlechange}
                        onKeyDown={handleMemberKeyDown}
                      />

                      <div className="tags-wrapper">
                        <div className="tags-results-wrap">
                          {addComet?.teams?.map((newTags, index) => (
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
                      onChange={(e) => handleRange(e)}
                    >
                      {Priorities.map((item, i) => {
                        return (
                          <option
                            name="priority"
                            key={i}
                            value={item.name}
                            selected={
                              addComet?.priority == item.name ? "true" : "false"
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
                      Comet Description
                    </label>
                    <span className="textarea-field-wrapper">
                      <textarea
                        className="form-control"
                        placeholder="Comet Description"
                        name="description"
                        onChange={handleChangeStar}
                        value={addComet?.description || ""}
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
                        value={addComet?.note || ""}
                        onKeyDown={handleNoteKey}
                        pattern="[^\s]+"
                      ></textarea>
                    </span>
                  </div>
                </div>

                <div className="form-field-wrapper form-full-width file-upload-input-comet">
                  <div className="form-group">
                    <label>
                      <Image className="form-icon" src={PriorityIcon} />
                      Upload Document
                    </label>
                    <div className="upload-document-wrapper-commet">
                      <label
                        htmlFor="comet-file"
                        className="custom-file-upload"
                      >
                        Upload Document
                      </label>
                      <input
                        type="file"
                        name="attachments"
                        id="comet-file"
                        // accept="image/*"
                        onChange={onHandleCometChnage}
                      />
                    </div>
                  </div>
                </div>
                <div className="show_images">
                  {!cometImages?.length > 0 ? (
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
                  ) : cometImages && cometImages.length > 0 ? (
                    cometImages.map((items, index) => {
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
                    "4564"
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
                    value={singleCometData?.cometId ? "Update" : "Add"}
                    className="submit-btn-wrapper gradient-btn"
                  />
                </div>
              </form>
              {singleCometData?.cometId  && !onBoardId ? (
                <input
                  type="submit"
                  name=""
                  value="Mark as done"
                  className="submit-btn-wrapper gradient-btn mark-done-btn"
                  onClick={() => handleMoveToArchive(singleCometData?.cometId)}
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

export default Addcomet;
