import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import * as type from "../types/type";

const APIURL = "https://apiyouni.rlogical.com/api";

const requestResetPassword = () => {
  return {
    type: type.RESET_PASSWORD_REQUEST,
  };
};

const successResetPassword = (resp) => {
  return {
    type: type.RESET_PASSWORD_SUCCESS,
    payload: resp,
  };
};

const failurResetPassword = (error) => {
  return {
    type: type.RESET_PASSWORD_FAILUE,
    payload: error,
  };
};

export const resetPasswordAction = (data) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    dispatch(requestResetPassword());

    axios({
      method: "post",
      url: `${APIURL}/Authenticate/ResetPassword`,
      data: data,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          successResetPassword(response.data);
          toast.success("Your password has been updated successfully.");
          Router.push("/");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        toast.error(response.response.data.message);
        failurResetPassword(response.response.data.message);
      });
  };
};
