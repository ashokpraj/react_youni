import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import { projectsAllDataMain, pushNotify } from "../../components/api/api";
import * as type from "../types/type";
import _get from "lodash/get";

const APIURL = "https://apiyouni.rlogical.com/api";

const setStorStarIds = (resp) => {
  return {
    type: type.STORE_STAR_ID,
    payload: resp,
  };
};

const dashboardAllData = (resp) => {
  return {
    type: type.DASHBOARD_DATA,
    payload: resp,
  };
};

const projectsAllDataByUser = (resp) => {
  return {
    type: type.GET_ALL_PROJECTS_BY_USERID,
    payload: resp,
  };
};

const totalProjectsCount = (resp) => {
  return {
    type: type.TOTAL_STAR_COUNT,
    payload: resp,
  };
};

const singleStarDetails = (resp) => {
  return {
    type: type.GET_SINGLE_PROJECT_BY_ID,
    payload: resp,
  };
};

const starTeamsDetails = (resp) => {
  return {
    type: type.GET_SINGLE_PROJECT_TEAMS_BY_ID,
    payload: resp,
  };
};

const starTeamsAttachments = (resp) => {
  return {
    type: type.GET_SINGLE_PROJECT_FILES_BY_ID,
    payload: resp,
  };
};

const firstStarData = (resp) => {
  return {
    type: type.FIRST_STAR_ID,
    payload: resp,
  };
};

export const starCounts = (resp) => {
  return {
    type: type.CHECK_STAR_COUNT,
    payload: resp,
  };
};

export const signInSuccess = (data) => {
  return {
    type: type.SIGNIN_SUCCESS,
    payload: data,
  };
};

export const getUsersNotification = (data) => {
  return {
    type: type.GET_USER_NOTIFICATION,
    payload: data,
  };
};

export const storeExpiredProjectsData = (data) => {
  return {
    type: type.GET_EXPIRED_PROJECT_DATA,
    payload: data,
  };
};

export const storeExpiredProjectsDataOfUser = (data) => {
  return {
    type: type.GET_EXPIRED_PROJECT_DATA_ALL,
    payload: data,
  };
};

export const cometCounts = (resp) => {
  return {
    type: type.CHECK_COMET_COUNT,
    payload: resp,
  };
};

export const storeNotifyCounts = (resp) => {
  return {
    type: type.STORE_NOTIFI_COUNT,
    payload: resp,
  };
};

export const cometAllCountOfUser = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Authenticate/GetCometLimitStatus?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          dispatch(cometCounts(response.data.message));
        }
      })
      .catch(function (response) {
        if (response?.response?.data?.code === 400) {
          dispatch(cometCounts(response.response.data.message));
        }
      });
  };
};

export const getUserdataByToken = (token) => {
  return function (dispatch) {
    const sendData = {
      enctoken: token,
    };

    axios({
      method: "post",
      url: `${APIURL}/Authenticate/ValidateUser`,
      data: sendData,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        // console.log("response ::::::", response);
        if (response.data.code === 200) {
          const storeData = response.data.data;
          dispatch(signInSuccess(storeData));
          if (
            response?.data?.data === null ||
            response?.data?.data?.isActive === false
          ) {
            localStorage.clear();
            Router.push("/");
          }
        } else {
          console.log("responseresponseresponseresponseresponseresponse");
        }
      })
      .catch(function (response) {
        localStorage.clear();
        Router.push("/");
      });
  };
};

export const starAllCountOfUser = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Authenticate/GetProjectLimitStatus?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          dispatch(starCounts(response.data.message));
        }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          dispatch(starCounts(response.response.data.message));
        }
      });
  };
};

export const userAllData = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Authenticate/GetUserById?id=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("user response", response);
        // return;
        dispatch(dashboardAllData(response.data));
      })
      .catch(function (response) {
        console.log(response);
      });
  };
};

export const projectsAllData = (pageNumber, pageSize, userId) => {
  return function (dispatch) {
    projectsAllDataMain(pageNumber, pageSize, userId)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(totalProjectsCount(response?.data?.totalRecords));
          dispatch(projectsAllDataByUser(response?.data?.data));
          dispatch(firstStarData(response?.data?.data[0]?.projectId));
        }
      })
      .catch((err) => {
        toast.error(err?.response?.message);
      });
  };

  // const token = localStorage.getItem("loginToken");
  // return function (dispatch) {
  //   axios({
  //     method: "get",
  //     url: `${APIURL}/Projects/GetProjectsofUser?PageNumber=${pageNumber}&PageSize=${pageSize}&userId=${userId}`,
  //     headers: {
  //       Authorization: "Bearer " + token,
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(function (response) {
  //       if (response.status === 200) {
  //         dispatch(totalProjectsCount(response.data.totalRecords));
  //         dispatch(projectsAllDataByUser(response.data.data));
  //         dispatch(firstStarData(response.data.data[0].projectId));
  //       }
  //     })
  //     .catch(function (response) {
  //       // console.log(response);
  //     });
  // };
};

export const getStarDetailsById = (starId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetProjectById?id=${starId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(singleStarDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getStarTeamMember = (starId) => {
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetProjectTeamsbyProjectId?projectId=${starId}`,
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        dispatch(starTeamsDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getStarImages = (starId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetProjectAttachments?projectId=${starId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(starTeamsAttachments(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const storeStarsIds = (starID) => {
  return function (dispatch) {
    console.log("StarIds", starID);
    dispatch(storeStarsIds(starID));
  };
};

export const usersNotification = (page, callback = () => {}) => {
  const token = localStorage.getItem("loginToken");
  const userData = JSON.parse(localStorage.getItem("userData"));
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Notifications/getNotifications?PageNumber=${page}&PageSize=4&UserId=${userData?.userID}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        dispatch(storeNotifyCounts(response?.data?.totalUnreadCount));
        dispatch(getUsersNotification(response.data.data));
        return response;
      })
      .then((res) => {
        setTimeout(() => {
          callback(res?.data?.data?.length > 0);
        }, 2000);
      })
      .catch((response) => {
        console.log(response);
      });
  };
};

export const notification = () => {
  const token = localStorage.getItem("loginToken");
  const userData = JSON.parse(localStorage.getItem("userData"));
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Notifications/getNotifications?UserId=${userData?.userID}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        dispatch(storeNotifyCounts(response?.data?.totalUnreadCount));
        return response;
      })
      .catch((response) => {
        console.log(response);
      });
  };
};

export const markAdReadNotification = (notifyId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "post",
      url: `${APIURL}/Notifications/MarkAsRead?NotificationId=${notifyId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(notification());
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getExpiredProjectData = (userIds) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetFinishedDateProject?UserId=${userIds}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredProjectsData(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getExpiredProjectDataOfUser = (pageNumber, pageSize, userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Projects/GetFinishedDateProject?PageNumber=${pageNumber}&PageSize=${pageSize}&userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredProjectsDataOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const saveTheSubscribeUser = (loggedInUserId, subscribeUser) => {
  const notificationObj = {
    userId: loggedInUserId,
    lstBrowserIds: [
      {
        endpoint: _get(subscribeUser, "endpoint", ""),
        keys: {
          p256dh: btoa(
            String.fromCharCode.apply(
              null,
              new Uint8Array(subscribeUser.getKey("p256dh"))
            )
          ),
          auth: btoa(
            String.fromCharCode.apply(
              null,
              new Uint8Array(subscribeUser.getKey("auth"))
            )
          ),
        },
      },
    ],
  };

  return pushNotify(notificationObj);
};
export const getUserSubscribe = (userId) => {
  // return userGetSubscribe(userId)
  //   .then((res) => {
  //     return _get(res, "data.subscribeData.web_push_tokens", []);
  //   })
  //   .catch((err) => {
  //     console.log("error", err);
  //   });
};
