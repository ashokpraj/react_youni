import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import * as type from "../types/type";
import { cometAllCountOfUser, cometCounts } from "./dashboard";
import { getAllCometsByUserData } from "../../components/api/api";
import { checkToken } from "../../components/utils/encryption";

const APIURL = "https://apiyouni.rlogical.com/api";

const addComet = (data) => {
  return {
    type: type.ADD_COMET_DATA,
    payload: data,
  };
};

export const successAddComet = (message) => {
  return {
    type: type.ADD_COMET_SUCCESS_DATA,
    payload: message,
  };
};

export const singleCometDetails = (resp) => {
  return {
    type: type.GET_SINGLE_COMET_BY_ID,
    payload: resp,
  };
};

export const cometTeamsDetails = (resp) => {
  return {
    type: type.GET_SINGLE_COMET_TEAMS_BY_ID,
    payload: resp,
  };
};

export const cometTeamsAttachments = (resp) => {
  return {
    type: type.GET_SINGLE_COMET_FILES_BY_ID,
    payload: resp,
  };
};

export const editCometSuccess = (resp) => {
  return {
    type: type.EDIT_COMET_SUCCESS_DATA,
    payload: resp,
  };
};

const cometsAllDataByUser = (resp) => {
  return {
    type: type.GET_ALL_COMETS_BY_USERID,
    payload: resp,
  };
};

const totalCometsCount = (resp) => {
  return {
    type: type.TOTAL_COMETS_COUNT,
    payload: resp,
  };
};

const deleteCometData = (id) => {
  return {
    type: type.DELETE_COMET,
    payload: id,
  };
};

const firstCometData = (resp) => {
  return {
    type: type.FIRST_COMET_ID,
    payload: resp,
  };
};

export const selectedComet = (user) => {
  return {
    type: type.SELECTED_COMET_SUCCESS,
    payload: user,
  };
};

const storeUpcomeingComets = (datas) => {
  return {
    type: type.GET_UPCOMING_COMET,
    payload: datas,
  };
};

const storeUpcomeingCometsOfUser = (data) => {
  return {
    type: type.UPCOMING_COMET_OF_USERS,
    payload: data,
  };
};

const archiveCometsData = (datas) => {
  return {
    type: type.GET_ARCHIVE_COMETS,
    payload: datas,
  };
};

const archiveCometsDataUsers = (datas) => {
  return {
    type: type.GET_ARCHIVE_COMETS_OF_SUERS,
    payload: datas,
  };
};

const getCometsDataUsers = (datas) => {
  return {
    type: type.GET_COMET_OF_USERS_ALL,
    payload: datas,
  };
};

const requestAddComet = () => {
  return {
    type: type.ADD_COMET_REQUEST,
  };
};

export const failAddComet = () => {
  return {
    type: type.ADD_COMET_FAIL,
  };
};

export const storeExpiredCometsData = (data) => {
  return {
    type: type.GET_EXPIRED_COMET_DATA,
    payload: data,
  };
};

export const storeExpiredCometsDataOfUser = (data) => {
  return {
    type: type.GET_EXPIRED_COMET_DATA_ALL,
    payload: data,
  };
};

export const getAllCometsByUserId = (pageNumber, PageSize, userId) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    getAllCometsByUserData(pageNumber, PageSize, userId)
      .then((response) => {
        dispatch(totalCometsCount(response?.data?.totalRecords));
        dispatch(cometsAllDataByUser(response?.data?.data));
        dispatch(checkToken(token));
      })
      .catch((err) => {
        toast.error(err?.response?.message);
        // if
        // localStorage.clear();
        // Router.push("/");
      });
  };
};

// export const getAllCometsByUserId = (pageNumber, PageSize, userId) => {
//   const token = localStorage.getItem("loginToken");
//   return function (dispatch) {
//     // console.log("Action UserID", bearerToken);
//     // return;
//     axios({
//       method: "get",
//       url: `${APIURL}/Comet/GetCometsofUser?PageNumber=${pageNumber}&PageSize=${PageSize}&userId=${userId}`,
//       headers: {
//         Authorization: "Bearer " + token,
//         "Content-Type": "application/json",
//       },
//     })
//       .then(function (response) {
//         // console.log("response", response.data.data);
//         // return;
//         if (response.status === 200) {
//           dispatch(totalCometsCount(response.data.totalRecords));
//           dispatch(cometsAllDataByUser(response.data.data));

//           // dispatch(firstCometData(response.data.data[0].projectId));
//         }
//       })
//       .catch(function (response) {
//         // console.log(response);
//       });
//   };
// };

export const getAllCometsByUser = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("Action UserID", bearerToken);
    // return;
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetCometsofUser?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("response", response.data.data);
        // return;
        if (response.status === 200) {
          dispatch(getCometsDataUsers(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const addCometData = (
  comets,
  pageNumber,
  PageSize,
  userId,
  singleUserData,
  notificationData
) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("notificationData :::", notificationData);
    // return;
    dispatch(requestAddComet());

    axios({
      method: "post",
      data: JSON.stringify(comets),
      url: `${APIURL}/Comet/AddCometFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          if (notificationData?.notifyTo?.length > 0) {
            notificationData.typeId = Number(response?.data?.data?.cometId);

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
                dispatch(successAddComet());
              })
              .catch(function (response) {
                if (response?.response?.data?.code === 400) {
                  toast.error(response?.response?.data?.message);
                }
              });
          }

          toast.success("Comet has been saved successfully!");
          dispatch(successAddComet());
          dispatch(addComet(response.data.data));
          const message = "success";
          dispatch(successAddComet(message));
          dispatch(getAllCometsByUserId(pageNumber, PageSize, userId, token));
          dispatch(cometAllCountOfUser(userId));
        } else {
          dispatch(failAddComet());
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("response :::::::", response);
        if (response.response.data.code === 400) {
          dispatch(failAddComet());
          toast.error(response.response.data.message);
        }
      });
  };
};

export const getCometDetailsById = (cometId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetCometById?id=${cometId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(singleCometDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getCometTeamMember = (cometId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("Edit CometId", cometId);
    // return;
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetTeamsofComet?cometId=${cometId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("response.data.data", response.data.data);
        dispatch(cometTeamsDetails(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getCometImages = (cometId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetAttachmentsofComet?cometId=${cometId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        dispatch(cometTeamsAttachments(response.data.data));
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const editCometData = (editComet, notificationData) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("Comet Edit", JSON.stringify(editComet));
    // return;
    axios({
      method: "PUT",
      data: JSON.stringify(editComet),
      url: `${APIURL}/Comet/UpdateCometFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          // console.log("response.data.data :::", response.data.data);
          // dispatch(editComet(response.data.data));
          if (notificationData?.notifyTo?.length > 0) {
            notificationData.typeId = Number(
              response?.data?.data?.updateCometId
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
                dispatch(successAddComet());
              })
              .catch(function (response) {
                if (response?.response?.data?.code === 400) {
                  toast.error(response?.response?.data?.message);
                }
              });
          }
          toast.success("Comet has been update successfully!");
          const message = "success";
          dispatch(editCometSuccess(message));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const deleteComet = (cometId, pageNumber, PageSize, userId,count) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "DELETE",
      url: `${APIURL}/Comet/DeleteComet?id=${cometId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        toast.success("Comet has been deleted successfully!");
        // if (notificationData?.notifyTo?.length > 0) {
        //   axios({
        //     method: "post",
        //     data: JSON.stringify(notificationData),
        //     url: `${APIURL}/Notifications/AddNotification`,
        //     headers: {
        //       Authorization: "Bearer " + token,
        //       "Content-Type": "application/json",
        //     },
        //   })
        //     .then(function (response) {
        //       // console.log("Resposnse", response);
        //     })
        //     .catch(function (response) {
        //       if (response.response.data.code === 400) {
        //         toast.error(response.response.data.message);
        //       }
        //     });
        // }
        var count_final = count?.length - 1;
        var remainder = (count_final % 10);
        if (remainder === 0) {
          pageNumber = pageNumber - 1
        }
        dispatch(deleteCometData(cometId));
        dispatch(getAllCometsByUserId(pageNumber, PageSize, userId));
        dispatch(cometAllCountOfUser(userId));
        dispatch(cometCounts(""));
        return Promise.resolve(response);
      })
      .catch(function (response) {
        console.log("Catch Console", response);
        return Promise.reject(response);
      });
  };
};

export const getUcomeingComets = (pageNumber, pageSize, userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetUpcomingCometsofUser?PageNumber=${pageNumber}&PageSize=${pageSize}&userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(storeUpcomeingComets(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getUpcomingCometsOfUsers = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetUpcomingCometsofUser?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(storeUpcomeingCometsOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const addUpcomingComets = (
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
      url: `${APIURL}/Comet/AddCometFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          toast.success("Comet has been saved successfully!");
          dispatch(getUcomeingComets(pageNumber, PageSize, userId, token));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const getSingleUpcomingCometOfUsers = (Id) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetCometById?id=${Id}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(singleCometDetails(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const editUpcomingComet = (
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
      url: `${APIURL}/Comet/UpdateCometFull`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          toast.success("Comet has been update successfully!");
          dispatch(getUcomeingComets(pageNumber, PageSize, userId, token));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const deleteUpcomeingComet = (cometId, pageNumber, PageSize, userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    // console.log("cometId ::::", cometId);
    // const sendData = {
    //   userid: userId,
    //   projectid: starId,
    // };

    axios({
      method: "DELETE",
      url: `${APIURL}/Comet/DeleteComet?id=${cometId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          toast.error(response.data.message);
        } else {
          toast.success("Comet has been deleted successfully!");
          dispatch(getUcomeingComets(pageNumber, PageSize, userId, token));
        }
      })
      .catch(function (response) {
        if (response.response.data.code == 400) {
          toast.error(response.response.data.message);
        }
      });
  };
};

export const addArchiveCometsOfUser = (comets, type, pageNumber, PageSize) => {
  const token = localStorage.getItem("loginToken");

  return function (dispatch) {
    // console.log("pageNumber, PageSize :::", pageNumber, PageSize);
    // return;
    // console.log("comets ::", JSON.stringify(comets));
    // return;
    axios({
      method: "post",
      data: JSON.stringify(comets),
      url: `${APIURL}/Comet/ArchiveUnArchiveComet`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          if (type === "add") {
            toast.success("Archive Comet successfully!");
          } else {
            toast.success("Remove from Archive successfully!");
          }
          dispatch(
            getArchiveAllComtes(pageNumber, PageSize, comets.userId, token)
          );
          dispatch(getAllCometsByUserId(pageNumber, PageSize, comets.userId));
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        if (response.response.data.code === 400) {
          toast.error(response.response.data.message);
        }
        // if (response.response.data.length !== 0) {
        //   toast.error(response.response.data.message);
        // }
      });
  };
};

export const getArchiveAllComtes = (pageNumber, pageSize, userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetArchiveCometsofUser?PageNumber=${pageNumber}&PageSize=${pageSize}&userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(archiveCometsData(response.data.data));
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};

export const getArchiveAllComtesUsers = (userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetArchiveCometsofUser?userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          dispatch(archiveCometsDataUsers(response.data.data));
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
        // if (response?.response?.data.code === 400) {
        //   toast.error(response.response.data.message);
        // }
      });
  };
};

export const getExpiredCometsData = (userIds) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetFinishedDateProject?UserId=${userIds}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredCometsData(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getExpiredCometsDataOfUser = (pageNumber, pageSize, userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/Comet/GetFinishedDateProject?PageNumber=${pageNumber}&PageSize=${pageSize}&userId=${userId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storeExpiredCometsDataOfUser(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};
