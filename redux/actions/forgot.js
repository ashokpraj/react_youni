import axios from "axios";
import { toast } from "react-toastify";
import * as type from "../types/type";

const APIURL = "https://apiyouni.rlogical.com/api";
const requestForgotPassword = () => {
  return {
    type: type.FORGOT_PASSWORD_REQUEST,
  };
};

const successForgotPassword = (resp) => {
  return {
    type: type.FORGOT_PASSWORD_SUCCESS,
    payload: resp,
  };
};

const failurForgotPassword = (error) => {
  return {
    type: type.FORGOT_PASSWORD_FAILUE,
    payload: error,
  };
};

export const forgotPasswordLink = (email) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    dispatch(requestForgotPassword());

    const emailData = {
      EmailId: email,
    };

    axios({
      method: "post",
      url: `${APIURL}/Authenticate/ForgotPassword`,
      data: emailData,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        dispatch(successForgotPassword(response.data));
        toast.success(
          "The reset password link has been sent to your email address successfully."
        );
        document
          .getElementById("forgotModalToggle")
          .classList.remove("show", "modal-open");
        var lights = document.getElementsByClassName("modal-backdrop");
        while (lights.length)
          lights[0].className = lights[0].className.replace(
            /\modal-backdrop\b/g,
            ""
          );
      })
      .catch(function (error) {
        if (error.response.data.code === 400) {
          dispatch(failurForgotPassword(error.response.data.message));
          toast.error(error.response.data.message);
        }
      });
  };
};
