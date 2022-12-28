import axios from "axios";
import * as type from "../types/type";

const APIURL = "https://apiyouni.rlogical.com/api";

const usersAllData = (data) => {
  return {
    type: type.GET_USERS_DATA,
    payload: data,
  };
};

const selectedUsers = (members) => {
  return {
    type: type.SELECTED_MEMBER,
    payload: members,
  };
};

export const getAllUsersData = (member, userId, userids, remove) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    const data = {
      loggedInUserId: userId,
      userIds: userids,
    };
    if (remove !== "Removetag") {
      data["search"] = member;
    }

    axios({
      method: "post",
      data: JSON.stringify(data),
      url: `${APIURL}/Authenticate/SearchUser`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        // console.log("response:::", response);
        if (response.data.code === 200) {
          dispatch(usersAllData(response.data.data));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const setAllSelectedMember = (members) => {
  return function (dispatch) {
    dispatch(selectedUsers(members));
  };
};
