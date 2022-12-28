import axios from "axios";
import { toast } from "react-toastify";
import * as type from "../types/type";
import Router from "next/router";
import {
  getStarDetailsById,
  projectsAllData,
  starAllCountOfUser,
  starCounts,
} from "./dashboard";
import { getArchiveProjectsOfUser } from "../../components/api/api";
import { planetsByProjectAllDatas } from "./planet";
// import { projectsAllDatas } from "./calendar";

const APIURL = "https://apiyouni.rlogical.com/api";

const addStar = (data) => {
  return {
    type: type.ADD_STAR_DATA,
    payload: data,
  };
};

const requestAddStar = () => {
  return {
    type: type.ADD_STAR_REQUEST,
  };
};

export const successAddSatr = (message) => {
  return {
    type: type.ADD_STAR_SUCCESS_DATA,
    payload: message,
  };
};

export const failAddStar = () => {
  return {
    type: type.ADD_STAR_FAIL,
  };
};

const editSatars = (data) => {
  return {
    type: type.EDIT_STAR_DATA,
    payload: data,
  };
};

export const editStarsSuccess = (message) => {
  return {
    type: type.EDIT_STAR_SUCCESS_DATA,
    payload: message,
  };
};

const deleteStarData = (id) => {
  return {
    type: type.DELETE_STAR,
    payload: id,
  };
};

export const selectedStar = (user) => {
  return {
    type: type.SELECTED_STAR_SUCCESS,
    payload: user,
  };
};

const successUpcomeingAddSatr = (message) => {
  return {
    type: type.UPCOMEING_ADD_STARS_DATA,
    payload: message,
  };
};

const storeUpcomeingStars = (datas) => {
  return {
    type: type.UPCOMEING_STARS_DATA,
    payload: datas,
  };
};

const storeUpcomeingStarsMessage = (msg) => {
  return {
    type: type.UPCOMEING_STARS_DATA_SUCCESS,
    payload: msg,
  };
};

const storeUpcomeingStarsOfUser = (data) => {
  return {
    type: type.UPCOMEING_STARS_OF_USERS,
    payload: data,
  };
};

const singleUpcomngSars = (data) => {
  return {
    type: type.SINGLE_UPCOMEING_STARS_DATA,
    payload: data,
  };
};

const editSingleUpcomingStar = (data) => {
  return {
    type: type.UPCOMEING_EDIT_STARS_DATA,
    payload: data,
  };
};

const storeEditMessage = (msg) => {
  return {
    type: type.UPCOMEING_EDIT_STARS_DATA_SUCCESS,
    payload: msg,
  };
};

const deleteSuccessStar = (msg) => {
  return {
    type: type.DELETE_UPCOMEING_STARS_SUCCESS,
    payload: msg,
  };
};

const archiveStarsData = (datas) => {
  return {
    type: type.ARCHIVE_STAR_DATA,
    payload: datas,
  };
};

const archiveStarsDataOfUser = (datas) => {
  return {
    type: type.ARCHIVE_STAR_DATA_OF_USER,
    payload: datas,
  };
};

const archiveStarsSuccess = (msg) => {
  return {
    type: type.ADD_ARCHIVE_STAR_SUCCESS,
    payload: msg,
  };
};

export const singleStarDataname = (data) => {
  return {
    type: type.SIGNLE_STAR_NAME_DATA,
    payload: data,
  };
};

export const addSatarsData = (
  stars,
  pageNumber,
  PageSize,
  userId,
  notificationData,
  singleUserData
) => {
  return function (dispatch) {
    // console.log("JSON.stringify(stars) ", JSON.stringify(stars));
    // return;
    dispatch(requestAddStar());
    const token = localStorage.getItem("loginToken");
    axios({
      method: "post",
      data: JSON.stringify(stars),
      url: `${APIURL}/Projects/AddProjectFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(async function (response) {
        if (response.data.code === 200) {
          dispatch(starAllCountOfUser(stars.createdBy));
          toast.success("Star has been saved successfully!");

          if (notificationData.notifyTo) {
            notificationData.typeId = Number(response.data.data.projectId);

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
                dispatch(successAddSatr());
              })
              .catch(function (response) {
                if (response.response.data.code === 400) {
                  toast.error(response.response.data.message);
                }
              });
          }

          dispatch(addStar(response.data.data));
          const message = "success";
          dispatch(successAddSatr(message));
          dispatch(projectsAllData(pageNumber, PageSize, userId));
        } else {
          dispatch(failAddStar());
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        dispatch(failAddStar());
        // console.log("resposnse", response);
        // return;
        if (response.response?.data?.code === 400) {
          toast.error(response.response.data.message);
        }
      });
  };
};

export const editSatarsData = (editStars, notificationData) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("notificationData.notifyTo ::::", JSON.stringify(editStars));
    // return;
    // console.log(editStars);
    // return;
    axios({
      method: "PUT",
      data: JSON.stringify(editStars),
      url: `${APIURL}/Projects/UpdateProjectFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          toast.success("Star has been update successfully!");

          if (notificationData.notifyTo) {
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

          dispatch(editSatars(response.data.data));
          const message = "success";
          dispatch(editStarsSuccess(message));
          dispatch(planetsByProjectAllDatas(editStars?.updateProjectId));
          dispatch(getStarDetailsById(editStars?.updateProjectId));
          // Router.push("/dashboard");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const deleteStar = (starId, pageNumber, PageSize, userId,count) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    const sendData = {
      userid: userId,
      projectid: starId,
    };

    axios({
      method: "DELETE",
      data: sendData,
      url: `${APIURL}/Projects/DeleteProject`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          toast.error(response.data.message);
        } else {
          dispatch(deleteStarData(starId));
          toast.success("Star has been deleted successfully!");
          var count_final = count - 1;
          pageNumber = (count_final + PageSize - 1) / PageSize;
          pageNumber = Math.floor(pageNumber)
          dispatch(projectsAllData(pageNumber, PageSize, userId));
          // dispatch(projectsAllDatas(userId))
          dispatch(starAllCountOfUser(userId));
          dispatch(starCounts(""));
        }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          toast.error(response.response.data.message);
        }
      });
  };
};

export const getUcomeingStars = (pageNumber, pageSize, userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetUpcomingProjectsofUser?PageNumber=${pageNumber}&PageSize=${pageSize}&userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(storeUpcomeingStars(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const addUpcomingStar = (
  upcomingStars,
  pageNumber,
  PageSize,
  userId
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("upcomingStars", JSON.stringify(upcomingStars));
    // return;
    axios({
      method: "post",
      data: JSON.stringify(upcomingStars),
      url: `${APIURL}/Projects/AddProjectFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(addStar(response.data.data));
          const message = "success";
          toast.success("Star has been saved successfully!");
          dispatch(storeUpcomeingStarsMessage(message));
          dispatch(getUcomeingStars(pageNumber, PageSize, userId, token));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        toast.error(response.response.data.message);
      });
  };
};

export const getUpcomingStarOfUsers = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetUpcomingProjectsofUser?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(storeUpcomeingStarsOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getSingleUpcomingStarOfUsers = (Id) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetProjectById?id=${Id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          console.log("response.data.data :::", response.data.data);
          dispatch(singleUpcomngSars(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const editUpcomingStar = (
  editUpcomingStars,
  pageNumber,
  PageSize,
  userId
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("editUpcomingStars", JSON.stringify(editUpcomingStars));
    // return;
    axios({
      method: "PUT",
      data: JSON.stringify(editUpcomingStars),
      url: `${APIURL}/Projects/UpdateProjectFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(editSingleUpcomingStar(response.data.data));
          const message = "success";
          toast.success("Star has been update successfully!");
          dispatch(storeEditMessage(message));
          dispatch(getUcomeingStars(pageNumber, PageSize, userId, token));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const deleteUpcomeingStar = (starId, pageNumber, PageSize, userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    const sendData = {
      userid: userId,
      projectid: starId,
    };

    axios({
      method: "DELETE",
      data: sendData,
      url: `${APIURL}/Projects/DeleteProject`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          toast.error(response.data.message);
        } else {
          toast.success("Star has been deleted successfully!");
          dispatch(deleteStarData(starId));
          dispatch(getUcomeingStars(pageNumber, PageSize, userId, token));
          const message = "success";
          dispatch(deleteSuccessStar(message));
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const getArchiveStars = (pageNumber, pageSize, userId) => {
  return function (dispatch) {
    getArchiveProjectsOfUser(pageNumber, pageSize, userId)
      .then((response) => {
        if (response.status === 200) {
          dispatch(archiveStarsData(response.data.data));
          dispatch(archiveStarsDataOfUser(response.data.totalRecords));
        }
      })
      .catch((err) => {
        toast.error(err?.response?.message);
      });
  };
};

// export const getArchiveStarsOfUser = (userId) => {
//   const token = localStorage.getItem("loginToken");
//   return function (dispatch) {
//     axios({
//       method: "get",
//       url: `${APIURL}/Projects/GetArchiveProjectsofUser?userId=${userId}`,
//       headers: {
//         Authorization: "Bearer " + token,
//         "Content-Type": "application/json",
//       },
//     })
//       .then(function (response) {
//         if (response.status === 200) {
//           dispatch(archiveStarsDataOfUser(response.data.data));
//         }
//       })
//       .catch(function (response) {
//         console.log("Catch Console", response);
//         // if (response.response.data === 400) {
//         //   console.log("message", response.response.data.message);
//         // }
//       });
//   };
// };

export const addArchiveStarsOfUser = (stars, type, pageNumber, PageSize,count) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    console.log("page :::::::::::",pageNumber,PageSize,count);
    axios({
      method: "post",
      data: JSON.stringify(stars),
      url: `${APIURL}/Projects/ArchiveUnArchiveProject`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("response.data", response.data);
        if (response.data.code === 200) {
          const message = "success";
          dispatch(successAddSatr(message));
          if (type === "add") {
            Router.push("/dashboard");
            toast.success("Archive Star successfully!");
          } else {
            toast.success("Remove from Archive successfully!");
          }
          var count_final = count - 1;
          var remainder = (count_final % 10);
          console.log("remainder",remainder)
          if (remainder === 0) {
            pageNumber = pageNumber - 1
          }
          dispatch(getArchiveStars(pageNumber, PageSize, stars?.userId));
          dispatch(projectsAllData(pageNumber, PageSize, stars.userId, token));
          // dispatch(projectsAllDatas(userId))
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
