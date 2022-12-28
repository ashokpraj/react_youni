import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import * as type from "../types/type";

const APIURL = "https://apiyouni.rlogical.com/api";

const addMoon = (data) => {
  return {
    type: type.ADD_MOON_DATA,
    payload: data,
  };
};

const moonsPlanetsAllDataByUser = (resp) => {
  return {
    type: type.GET_ALL_MOON_BY_PLANET_ID,
    payload: resp,
  };
};

const planetById = (resp) => {
  return {
    type: type.GET_PLANET_BY_ID,
    payload: resp,
  };
};

const deleteMoon = (resp) => {
  return {
    type: type.DELETE_MOON,
    payload: resp,
  };
};

export const successAddMoon = (message) => {
  return {
    type: type.ADD_MOON_SUCCESS_DATA,
    payload: message,
  };
};

const singleMoonDetails = (resp) => {
  return {
    type: type.GET_SINGLE_MOON_BY_ID,
    payload: resp,
  };
};

const moonTeamsDetails = (resp) => {
  return {
    type: type.GET_SINGLE_MOON_TEAMS_BY_ID,
    payload: resp,
  };
};

const moonTeamsAttachments = (resp) => {
  return {
    type: type.GET_SINGLE_MOON_FILES_BY_ID,
    payload: resp,
  };
};

export const editMoonSuccess = (resp) => {
  return {
    type: type.EDIT_MOON_SUCCESS_DATA,
    payload: resp,
  };
};

const editMoons = (data) => {
  return {
    type: type.EDIT_MOON_DATA,
    payload: data,
  };
};

const firstMoonData = (resp) => {
  return {
    type: type.FIRST_MOON_ID,
    payload: resp,
  };
};

export const moonsCounts = (resp) => {
  return {
    type: type.MOON_COUNT_DATA,
    payload: resp,
  };
};

export const selectedMoon = (user) => {
  return {
    type: type.SELECTED_MOON_SUCCESS,
    payload: user,
  };
};

const archiveMoonsData = (datas) => {
  return {
    type: type.GET_ARCHIVE_MOONS,
    payload: datas,
  };
};

const archiveMoonsDataOfUser = (datas) => {
  return {
    type: type.GET_ARCHIVE_MOONS_OF_SUERS,
    payload: datas,
  };
};

const storePlanetMoonData = (datas) => {
  return {
    type: type.GET_MOONS_ALL_DATA_BY_PLANT,
    payload: datas,
  };
};

const requestAddMoon = () => {
  return {
    type: type.ADD_MOON_REQUEST,
  };
};

export const failAddMoon = () => {
  return {
    type: type.ADD_MOON_FAIL,
  };
};

export const storeExpiredMoonsData = (data) => {
  return {
    type: type.GET_EXPIRED_MOONS_DATA,
    payload: data,
  };
};

export const storeExpiredMoonsDataOfUser = (data) => {
  return {
    type: type.GET_EXPIRED_MOONS_DATA_ALL,
    payload: data,
  };
};

export const addMoonsData = (
  moons,
  pageNumber,
  PageSize,
  planetId,
  notificationData,
  singleUserData
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    dispatch(requestAddMoon());
    // console.log(JSON.stringify(moons));
    // return;
    axios({
      method: "post",
      data: JSON.stringify(moons),
      url: `${APIURL}/Moons/AddMoonFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          toast.success("Moon has been saved successfully!");
          dispatch(successAddMoon());
          if (notificationData.notifyTo) {
            notificationData.typeId = Number(response.data.data.moonId);
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
          dispatch(addMoon(response.data.data));
          const message = "success";
          dispatch(successAddMoon(message));
          dispatch(moonsByPlanetAllData(pageNumber, PageSize, planetId));
          dispatch(getPlanetDetailsByIdData(planetId));
          dispatch(moonsAllCountOfUser(moons.createdBy));
        } else {
          // console.log("response.data", response.data);
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        if (response?.response?.data?.code === 400) {
          toast.error(response.response.data.message);
        }
      });
  };
};

export const moonsByPlanetAllData = (pageNumber, pageSize, planetId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetMoonsofPlanet?PageNumber=${pageNumber}&PageSize=${pageSize}&planetId=${planetId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("Action data", response.data);
        if (response.status === 200) {
          dispatch(moonsPlanetsAllDataByUser(response.data.data));
          if (response.data.data[0]) {
            dispatch(firstMoonData(response.data.data[0].moonId));
          }
        }
        // dispatch(projectById(response.data.data.projectName));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getPlanetDetailsByIdDataOfUsers = (planetId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetMoonsofPlanet?planetId=${planetId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(storePlanetMoonData(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getPlanetDetailsByIdData = (planetId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Planets/GetPlanetById?id=${planetId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const planetName = response.data.data;
        dispatch(planetById(planetName));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getProejctDetailsById = (projectId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetProjectById?id=${projectId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const starName = response.data.data.projectName;
        dispatch(projectById(starName));
      })
      .catch(function (response) {
        // console.log(response);
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
        dispatch(singleMoonDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getMoonTeamMember = (moonId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetMoonTeamsofMoonId?moonId=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(moonTeamsDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getMoonImages = (moonId) => {
  return function (dispatch) {
    const token = localStorage.getItem("loginToken");
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetMoonAttachmentsofMoon?moonId=${moonId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(moonTeamsAttachments(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const editMoonData = (editMoon, notificationData) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log(JSON.stringify(editMoon));
    // console.log(editMoon.planetId);
    // return;
    axios({
      method: "PUT",
      data: JSON.stringify(editMoon),
      url: `${APIURL}/Moons/UpdateMoonFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          if (notificationData.notifyTo) {
            notificationData.typeId = Number(response.data.data.planetId);
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
          toast.success("Moon has been update successfully!");
          dispatch(editMoons(response.data.data));
          const message = "success";
          dispatch(editMoonSuccess(message));
          Router.push({
            pathname: '/satellite',
            query: { moonId: editMoon.planetId }
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

export const deleteMoonData = (
  moonId,
  pageNumber,
  PageSize,
  planetId,
  userId,
  count
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    const sendData = {
      userid: userId,
      moonid: moonId,
    };
    axios({
      method: "DELETE",
      data: sendData,
      url: `${APIURL}/Moons/DeleteMoon`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          toast.error(response.data.message);
        } else {
          toast.success("Moon has been deleted successfully!");
          var count_final = count?.length - 1;
          var remainder = (count_final % 10);
          if (remainder === 0) {
            pageNumber = pageNumber - 1
          }
          dispatch(deleteMoon(moonId));
          dispatch(getPlanetDetailsByIdDataOfUsers(planetId))
          dispatch(moonsByPlanetAllData(pageNumber, PageSize, planetId, token));
          dispatch(moonsAllCountOfUser(userId));
          dispatch(moonsCounts(""));
        }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          toast.error(response.response.data.message);
        }
      });
  };
};

export const moonsAllCountOfUser = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Authenticate/GetMoonLimitStatus?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("response", response);
        // if (response.data.code === 400) {
        //   dispatch(moonsCounts(response.data.message));
        // }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          dispatch(moonsCounts(response.response.data.message));
        }
      });
  };
};

export const addArchiveMoonsOfUser = (
  moons,
  type,
  pageNumber,
  PageSize,
  planetId,
  count
) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    axios({
      method: "post",
      data: JSON.stringify(moons),
      url: `${APIURL}/Moons/ArchiveUnArchiveMoon`,
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
            toast.success("Archive Moon successfully!");
            Router.push({
              pathname: '/moon',
              query: { planetId: planetId }
            }, '/moon');
          } else {
            var count_final = count?.length - 1;
            var remainder = (count_final % 10);
            if (remainder === 0) {
              pageNumber = pageNumber - 1
            }
            dispatch(getArchiveMoons(pageNumber, PageSize, planetId));
            dispatch(getArchiveMoonsOfUser(planetId))
            toast.success("Remove from Archive successfully!");
          }
          // dispatch(moonsByPlanetAllData(pageNumber, PageSize, planetId));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("response :::", response);
        // if (response.response.data.code === 400) {
        //   toast.error(response.response.data.message);
        // }
      });
  };
};

export const getArchiveMoons = (pageNumber, pageSize, planetId) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetArchiveMoonsofUser?PageNumber=${pageNumber}&PageSize=${pageSize}&planetId=${planetId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(archiveMoonsData(response.data.data));
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const getArchiveMoonsOfUser = (planetId) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetArchiveMoonsofUser?planetId=${planetId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(archiveMoonsDataOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const getExpiredMoonsData = (planetID) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("planetID ::::", planetID);
    // return;
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetFinishedDateProject?planetId=${planetID}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredMoonsData(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getExpiredMoonsDataOfUser = (pageNumber, pageSize, planetID) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("planetID ::::", planetID);
    // return;
    axios({
      method: "get",
      url: `${APIURL}/Moons/GetFinishedDateProject?PageNumber=${pageNumber}&PageSize=${pageSize}&planetId=${planetID}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredMoonsDataOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};
