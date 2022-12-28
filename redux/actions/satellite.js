import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import * as type from "../types/type";

const APIURL = "https://apiyouni.rlogical.com/api";

const addSatellite = (data) => {
  return {
    type: type.ADD_SATELLITE_DATA,
    payload: data,
  };
};

const singleSatelliteDetails = (resp) => {
  return {
    type: type.GET_SINGLE_SATELLITE_BY_ID,
    payload: resp,
  };
};

const satelliteTeamsDetails = (resp) => {
  return {
    type: type.GET_SINGLE_SATELLITE_TEAMS_BY_ID,
    payload: resp,
  };
};

const satelliteTeamsAttachments = (resp) => {
  return {
    type: type.GET_SINGLE_SATELLITE_FILES_BY_ID,
    payload: resp,
  };
};

export const successAddSatellite = (datas) => {
  return {
    type: type.ADD_SATELLITE_SUCCESS_DATA,
    payload: datas,
  };
};

const editSatelliteSuccess = (resp) => {
  return {
    type: type.EDIT_SATELLITE_SUCCESS_DATA,
    payload: resp,
  };
};

const getMoonDetailsByIdData = (resp) => {
  return {
    type: type.GET_MOON_DETAILS_BY_ID,
    payload: resp,
  };
};

const getAllSatlliteByMoon = (resp) => {
  return {
    type: type.GET_ALL_SATELLITE_BY_MOON_ID,
    payload: resp,
  };
};

const deleteSatellite = (resp) => {
  return {
    type: type.DELETE_SATELLITE,
    payload: resp,
  };
};

export const satellitesCounts = (resp) => {
  return {
    type: type.SATELLITE_COUNT_DATA,
    payload: resp,
  };
};

export const selectedSatellite = (user) => {
  return {
    type: type.SELECTED_SATELLITE_SUCCESS,
    payload: user,
  };
};

const archiveSatellitesData = (datas) => {
  return {
    type: type.GET_ARCHIVE_SATELLITE,
    payload: datas,
  };
};

const archiveSatelliteDataOfUser = (datas) => {
  return {
    type: type.GET_ARCHIVE_SATELLITE_OF_SUERS,
    payload: datas,
  };
};

const getAllSatlliteByMoonOfUser = (datas) => {
  return {
    type: type.GET_SATELLITE_OF_MOON_OF_USERS,
    payload: datas,
  };
};

const requestAddSatellite = () => {
  return {
    type: type.ADD_SATELLITE_REQUEST,
  };
};

const failAddSatellite = () => {
  return {
    type: type.ADD_SATELLITE_FAIL,
  };
};

const successAddSatelliteAlldata = () => {
  return {
    type: type.ADD_SATELLITE_SUCCESS_ALL_DATA,
  };
};

export const storeExpiredSatelliteData = (data) => {
  return {
    type: type.GET_EXPIRED_SATELLITE_DATA,
    payload: data,
  };
};

export const storeExpiredSatelliteDataOfUser = (data) => {
  return {
    type: type.GET_EXPIRED_SATELLITE_DATA_ALL,
    payload: data,
  };
};

export const addSatellitesData = (
  satellites,
  pageNumber,
  PageSize,
  moonId,
  notificationData,
  singleUserData
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    dispatch(requestAddSatellite());
    // console.log(JSON.stringify(satellites));
    // return;
    // console.log("notificationData?.notifyTo ::::", notificationData);
    // return;

    axios({
      method: "post",
      data: JSON.stringify(satellites),
      url: `${APIURL}/Satellites/AddsateliteFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          toast.success("Satellite has been saved successfully!");
          dispatch(successAddSatelliteAlldata(response?.data?.data));
          if (notificationData?.notifyTo?.length > 0) {
            notificationData.typeId = Number(response?.data?.data?.sateliteId);
            axios({
              method: "post",
              data: JSON.stringify(notificationData),
              url: `${APIURL}/Notifications/AddNotification`,
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            })
              .then(function (response) {
                // console.log("Resposnse", response);
              })
              .catch(function (response) {
                if (response.response.data.code === 400) {
                  toast.error(response.response.data.message);
                }
              });
          }
          dispatch(addSatellite(response.data.data));
          const message = "success";
          dispatch(successAddSatellite(message));
          dispatch(getSatelliteByMoon(pageNumber, PageSize, moonId, token));
        } else {
          dispatch(failAddSatellite());
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        dispatch(failAddSatellite());
        if (response.response.data.code === 400) {
          dispatch(failAddSatellite());
          toast.error(response.response.data.message);
        }
      });
  };
};

export const getPlanetDetailsById = (moonId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetSateliteById?id=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const moonName = response.data.data.moonName;
        dispatch(planetById(moonName));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getSatelliteDeailsById = (satelliteId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetSateliteById?id=${satelliteId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(singleSatelliteDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getSatelliteTeamMember = (satelliteId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetTeamsofSatelite?sateliteId=${satelliteId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(satelliteTeamsDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getSatelliteImages = (satelliteId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetAttachmentsofSatelite?staeliteId=${satelliteId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(satelliteTeamsAttachments(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const editSatelliteData = (editSatellite, notificationData) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log(JSON.stringify(editSatellite));
    // return;
    axios({
      method: "PUT",
      data: JSON.stringify(editSatellite),
      url: `${APIURL}/Satellites/UpdateSateliteFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          if (notificationData.notifyTo) {
            notificationData.typeId = Number(
              response.data.data.updateSateliteId
            );
            axios({
              method: "post",
              data: JSON.stringify(notificationData),
              url: `${APIURL}/Notifications/AddNotification`,
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            })
              .then(function (response) {
                dispatch(successAddPlanet());
                // console.log("Resposnse", response.data.data);
              })
              .catch(function (response) {
                if (response.response.data.code === 400) {
                  toast.error(response.response.data.message);
                }
              });
          }

          toast.success("Satellite has been update successfully!");
          const message = "success";
          dispatch(editSatelliteSuccess(message));
          Router.push({
            pathname: '/satellite',
            query: { moonId: editSatellite.moonId }
        }, '/satellite');
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const getMoonDetailsById = (moonId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetMoonById?id=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(getMoonDetailsByIdData(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getSatelliteByMoon = (pageNumber, PageSize, moonId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("moons", moonId);
    // return;
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetSatelitesofMoon?PageNumber=${pageNumber}&PageSize=${PageSize}&moonId=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(getAllSatlliteByMoon(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getSatelliteByMoonOfUser = (moonId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("moons", moonId);
    // return;
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetSatelitesofMoon?moonId=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(getAllSatlliteByMoonOfUser(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const deleteSatelliteData = (
  pageNumber,
  PageSize,
  moonId,
  sateliteId,
  userId,
  count
) => {
  const token = localStorage.getItem("loginToken");
  const sendData = {
    userid: userId,
    sateliteid: sateliteId,
  };

  return function (dispatch) {
    axios({
      method: "DELETE",
      data: sendData,
      url: `${APIURL}/Satellites/DeleteSatelite`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        toast.success("Satellite has been deleted successfully!");
        var count_final = count?.length - 1;
          var remainder = (count_final % 10);
          if (remainder === 0) {
            pageNumber = pageNumber - 1
          }
        dispatch(deleteSatellite(moonId));
        dispatch(getSatelliteByMoon(pageNumber, PageSize, moonId));
        dispatch(satelliteAllCountOfUser(userId));
        dispatch(satellitesCounts(""));
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          toast.error(response.response.data.message);
        }
      });
  };
};

export const satelliteAllCountOfUser = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Authenticate/GetSateliteLimitStatus?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("response", response);
      })
      .catch(function (response) {
        // console.log("response", response);
        if (response.response.data.code === 400) {
          dispatch(satellitesCounts(response.response.data.message));
        }
      });
  };
};

export const addArchiveSatellitesOfUser = (
  Satellites,
  type,
  pageNumber,
  PageSize,
  moonId
) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    // console.log("Satellites :::", Satellites, pageNumber, PageSize, moonId);
    // return;
    axios({
      method: "post",
      data: JSON.stringify(Satellites),
      url: `${APIURL}/Satellites/ArchiveUnArchiveSatellite`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          const message = "success";
          // dispatch(successAddSatr(message));
          if (type === "add") {
            toast.success("Archive Satellite successfully!");
            Router.push({
              pathname: '/satellite',
              query: { moonId: moonId }
          }, '/satellite');
          } else {
            toast.success("Remove from Archive successfully!");
            dispatch(getArchiveSatellite(pageNumber, PageSize, moonId));
          }
          // dispatch(getSatelliteByMoon(pageNumber, PageSize, moonId, token));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          toast.error(response.response.data.message);
        }
      });
  };
};

export const getArchiveSatellite = (pageNumber, pageSize, moonId) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetArchiveSatellitesofUser?PageNumber=${pageNumber}&PageSize=${pageSize}&moonId=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(archiveSatellitesData(response.data.data));
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const getArchiveSatelliteOfUser = (moonId) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetArchiveSatellitesofUser?moonId=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(archiveSatelliteDataOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const getExpiredSatellitesData = (moonId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetFinishedDateProject?moonId=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredPlantesData(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getExpiredSatellitesDataOfUser = (
  pageNumber,
  pageSize,
  moonId
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Satellites/GetFinishedDateProject?PageNumber=${pageNumber}&PageSize=${pageSize}&moonId=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredSatelliteDataOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};
