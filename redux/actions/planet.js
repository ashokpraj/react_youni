import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import { getArchivePlanetsOfProjects } from "../../components/api/api";
import { checkToken } from "../../components/utils/encryption";
import * as type from "../types/type";

const APIURL = "https://apiyouni.rlogical.com/api";

const addPlanet = (data) => {
  return {
    type: type.ADD_PLANET_DATA,
    payload: data,
  };
};

const planetsProjectsAllDataByUser = (resp) => {
  return {
    type: type.GET_ALL_PLANETS_BY_PROJECT_ID,
    payload: resp,
  };
};

export const successAddPlanet = (message) => {
  return {
    type: type.ADD_PLANET_SUCCESS_DATA,
    payload: message,
  };
};

const projectById = (resp) => {
  return {
    type: type.GET_PROJECT_BY_ID,
    payload: resp,
  };
};

const singlePlanetDetails = (resp) => {
  return {
    type: type.GET_SINGLE_PLANET_BY_ID,
    payload: resp,
  };
};

const planetTeamsDetails = (resp) => {
  return {
    type: type.GET_SINGLE_PLANET_TEAMS_BY_ID,
    payload: resp,
  };
};

const planetTeamsAttachments = (resp) => {
  return {
    type: type.GET_SINGLE_PLANET_FILES_BY_ID,
    payload: resp,
  };
};

export const editPlanetSuccess = (resp) => {
  return {
    type: type.EDIT_PLANET_SUCCESS_DATA,
    payload: resp,
  };
};

const editPlanet = (resp) => {
  return {
    type: type.EDIT_PLANET_DATA,
    payload: resp,
  };
};

const deletePlanetData = (resp) => {
  return {
    type: type.DELETE_PLANET,
    payload: resp,
  };
};

const firstPlanetData = (resp) => {
  return {
    type: type.FIRST_PLANET_ID,
    payload: resp,
  };
};

export const planetCounts = (resp) => {
  return {
    type: type.PLANET_COUNT_DATA,
    payload: resp,
  };
};

export const selectedPlanet = (user) => {
  return {
    type: type.SELECTED_PLANET_SUCCESS,
    payload: user,
  };
};

const archivePlanetsData = (datas) => {
  return {
    type: type.GET_ARCHIVE_PLANETS,
    payload: datas,
  };
};

const archivePlanetsDataOfUser = (datas) => {
  return {
    type: type.GET_ARCHIVE_PLANETS_OF_SUERS,
    payload: datas,
  };
};

const planetsAlldata = (datas) => {
  return {
    type: type.PLANTES_ALL_DATA,
    payload: datas,
  };
};

const requestAddPlanet = () => {
  return {
    type: type.ADD_PLANET_REQUEST,
  };
};

export const failAddPlanet = () => {
  return {
    type: type.ADD_PLANET_FAIL,
  };
};

export const storeExpiredPlantesData = (data) => {
  return {
    type: type.GET_EXPIRED_PLANET_DATA,
    payload: data,
  };
};

export const storeExpiredPlantesDataOfUser = (data) => {
  return {
    type: type.GET_EXPIRED_PLANET_DATA_ALL,
    payload: data,
  };
};

export const addPlanetsData = (
  planets,
  pageNumber,
  PageSize,
  projectId,
  notificationData,
  singleUserData
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    dispatch(requestAddPlanet());
    axios({
      method: "post",
      data: JSON.stringify(planets),
      url: `${APIURL}/Planets/AddPlanetFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          toast.success("Planet has been saved successfully!");
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
          dispatch(addPlanet(response.data.data));
          const message = "success";
          dispatch(successAddPlanet(message));
          dispatch(
            planetsByProjectAllData(pageNumber, PageSize, projectId, token)
          );
          dispatch(planetAllCountOfUser(planets.createdBy));
          // dispatch(successAddPlanet(""));
        } else {
          dispatch(failAddPlanet());
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          dispatch(failAddPlanet());
          toast.error(response.response.data.message);
        }
      });
  };
};

export const planetsByProjectAllData = (pageNumber, pageSize, projectId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Planets/GetPlanetsofProject?PageNumber=${pageNumber}&PageSize=${pageSize}&projectId=${projectId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(planetsProjectsAllDataByUser(response.data.data));
          dispatch(firstPlanetData(response.data.data[0].planetId));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const planetsByProjectAllDatas = (projectId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Planets/GetPlanetsofProject?projectId=${projectId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(planetsAlldata(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getProejctDetailsById = (projectId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("projectId", projectId);
    // return;
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetProjectById?id=${projectId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(projectById(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getPlanetDetailsById = (planetId) => {
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
        dispatch(singlePlanetDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getPlanetTeamMember = (planetId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Planets/GetPlanetTeamsofPlanet?planetId=${planetId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(planetTeamsDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getPlanetImages = (planetId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Planets/GetPlanetAttachmentsofPlanet?planetId=${planetId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(planetTeamsAttachments(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const editPlanetData = (editPlanet, notificationData) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log(editPlanet);
    // return;
    axios({
      method: "PUT",
      data: JSON.stringify(editPlanet),
      url: `${APIURL}/Planets/UpdatePlanetFull`,
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
          toast.success("Planet has been update successfully!");
          const message = "success";
          dispatch(editPlanetSuccess(message));
          Router.push({
            pathname: '/moon',
            query: { planetId: editPlanet.updatePlanetId }
          }, '/moon');
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const deletePlanet = (
  planetId,
  pageNumber,
  PageSize,
  projectID,
  userId,
  count
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    const sendData = {
      userid: userId,
      planetid: planetId,
    };

    axios({
      method: "DELETE",
      data: sendData,
      url: `${APIURL}/Planets/DeletePlanet`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          toast.error(response.data.message);
        } else {
          toast.success("Planet has been deleted successfully!");
          dispatch(deletePlanetData(planetId));
          var count_final = count?.length - 1;
          var remainder = (count_final % 10);
          if (remainder === 0) {
            pageNumber = pageNumber - 1
          }
          dispatch(planetsByProjectAllData(pageNumber, PageSize, projectID));
          dispatch(planetsByProjectAllDatas(projectID));
          dispatch(planetAllCountOfUser(userId));
          dispatch(planetCounts(""));
        }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          toast.error(response.response.data.message);
        }
      });
  };
};

export const planetAllCountOfUser = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Authenticate/GetPlanetLimitStatus?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          dispatch(planetCounts(response.data.message));
        }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          dispatch(planetCounts(response.response.data.message));
        }
      });
  };
};

export const addArchivePlanetsOfUser = (
  planets,
  type,
  pageNumber,
  PageSize,
  projectId
) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    axios({
      method: "post",
      data: JSON.stringify(planets),
      url: `${APIURL}/Planets/ArchiveUnArchivePlanet`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          const message = "success";
          if (type === "add") {
            toast.success("Archive Planet successfully!");
            Router.push({
              pathname: '/planet',
              query: { projectId: projectId }
            }, '/planet');
          } else {
            toast.success("Remove from Archive successfully!");
            dispatch(getArchivePlanets(pageNumber, PageSize, projectId));
            Router.push({
              pathname: '/planet',
              query: { projectId: projectId }
            }, '/planet');
          }

          dispatch(
            planetsByProjectAllData(pageNumber, PageSize, projectId, token)
          );
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

export const getArchivePlanets = (pageNumber, pageSize, projectId) => {
  return function (dispatch) {
    getArchivePlanetsOfProjects(pageNumber, pageSize, projectId)
      .then((response) => {
        if (response.status === 200) {
          dispatch(archivePlanetsData(response?.data?.data));
          dispatch(archivePlanetsDataOfUser(response?.data?.totalRecords));
        }
      })
      .catch((err) => {
        toast.error(err?.response?.message);
      });
  };
};

export const getExpiredPlanetData = (projectID) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Planets/GetFinishedDateProject?projectId=${projectID}`,
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

export const getExpiredPlanetDataOfUser = (pageNumber, pageSize, projectID) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Planets/GetFinishedDateProject?PageNumber=${pageNumber}&PageSize=${pageSize}&projectId=${projectID}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredPlantesDataOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};
