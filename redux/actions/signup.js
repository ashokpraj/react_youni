import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import * as type from "../../redux/types/type";
import { sigInFacebook, sigInGoogle, sigInTwitter, signInuser } from "./signin";
const APIURL = "https://apiyouni.rlogical.com/api";
import { db, auth } from "../../lib/firebase";

const SignupRequest = () => {
  return {
    type: type.SIGNUP_REQUEST,
  };
};

const SignupSuccess = (data) => {
  return {
    type: type.SIGNUP_SUCCESS,
    payload: data,
  };
};

const SignupFailure = (data) => {
  return {
    type: type.SIGNUP_FAILURE,
    payload: data,
  };
};

export const saveUserToDB = (user_id, user_name, email_id, isActive) => {
  var docData = {
    status: "online",
    user_id,
    user_name,
    email_id,
    isActive,
    user_profile_picture: "https://ptetutorials.com/images/user-profile.png",
  };
  db.collection("User")
    .doc(auth.id)
    .set(docData)
    .then(function () {
      // console.log("User created");
    });
};

export const UserSignp = (signup, router,check) => {
  return function (dispatch) {
    dispatch(SignupRequest());
    signup.IsSubscribed = "false";
    // console.log("signup", signup);
    // return;
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/Add`,
      data: JSON.stringify(signup),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(SignupSuccess());
          // console.log(response.data.data);
          // return;
          const data = response.data.data;
          const userData = JSON.stringify({
            userID: response.data.data.userid,
          });

          const userDataSend = {
            userEmail: response.data.data.emailId,
            password: response.data.data.password,
          };

          dispatch(signInuser(userDataSend, router,check));
          saveUserToDB(data.userid, data.username, data.emailId, data.isActive);

          // dispatch(SignupSuccess());
          // Router.push("/dashboard");
          // document
          //   .getElementById("signupModalToggle")
          //   .classList.remove("show", "modal-open");
          // var lights = document.getElementsByClassName("modal-backdrop");
          // while (lights.length)
          //   lights[0].className = lights[0].className.replace(
          //     /\modal-backdrop\b/g,
          //     ""
          //   );
          // toast.success("User created successgully, Please check your mail !");
        } else {
          dispatch(SignupFailure());
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        dispatch(SignupFailure());
        if (response?.response?.data?.code === 400) {
          dispatch(SignupFailure());
          toast.error(response.response.data.message);
        } else {
          dispatch(SignupFailure());
        }
      });
  };
};

export const signupFacebbok = (users, router) => {
  return function (dispatch) {
    users.IsSubscribed = "false";
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SocialMediaSignIn`,
      data: users,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          toast.error(response.data.message);
          dispatch(SignupFailure(response.data.message));
        } else {
          const data = response.data.data;

          const dataSend = {
            UserName: data.username,
            LoginType: data.loginType,
          };
          dispatch(sigInFacebook("", dataSend, router));

          saveUserToDB(data.userid, data.username, data.emailId, data.isActive);
          var lights = document.getElementsByClassName("modal-backdrop");
          while (lights.length)
            lights[0].className = lights[0].className.replace(
              /\modal-backdrop\b/g,
              ""
            );
        }
      })
      .catch(function (err) {
        toast.error(err?.response?.data?.message);
      });
  };
};

export const signupWithGoogle = (users, router) => {
  return function (dispatch) {
    users.IsSubscribed = "false";
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SocialMediaSignIn`,
      data: users,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          toast.error(response.data.message);
          dispatch(SignupFailure(response.data.message));
        } else {
          const data = response.data.data;

          const dataSend = {
            UserName: data.username,
            LoginType: data.loginType,
          };

          dispatch(sigInGoogle("", dataSend, router));

          saveUserToDB(data.userid, data.username, data.emailId, data.isActive);
          Router.push("/dashboard").then(() => router.reload());
          // Router.push("/dashboard");
          var lights = document.getElementsByClassName("modal-backdrop");
          while (lights.length)
            lights[0].className = lights[0].className.replace(
              /\modal-backdrop\b/g,
              ""
            );
        }
      })
      .catch(function (err) {
        toast.error(err?.response?.data?.message);
      });
  };
};

export const signupWithTwitter = (users, router) => {
  return function (dispatch) {
    users.IsSubscribed = "false";
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SocialMediaSignIn`,
      data: users,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          toast.error(response.data.message);
          dispatch(SignupFailure(response.data.message));
        } else {
          const data = response.data.data;

          const dataSend = {
            UserName: data.username,
            LoginType: data.loginType,
          };
          dispatch(sigInTwitter(response,dataSend, router));
          var lights = document.getElementsByClassName("modal-backdrop");
          while (lights.length)
            lights[0].className = lights[0].className.replace(
              /\modal-backdrop\b/g,
              ""
            );
        }
      })
      .catch(function (err) {
        toast.error(err?.response?.data?.message);
      });
  };
};

export const signupWithLinedIn = (users, router) => {
  return function (dispatch) {
    users.IsSubscribed = "false";
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SignInUsingLinkedIn`,
      data: users,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        // console.log(response.data);
        if (response.data.code === 400) {
          // toast.error(response.data.message);
          dispatch(SignupFailure(response.data.message));
        } else {
          const socialDataDisp = JSON.stringify({
            userName: response.data.data.username,
          });

          const userData = JSON.stringify({
            userID: response.data.data.userid,
          });

          localStorage.setItem("userData", userData);
          localStorage.setItem("socialData", socialDataDisp);
          localStorage.setItem("loginToken", response.data.accessToken);
          // Router.push("/dashboard");
          Router.push("/dashboard").then(() => router.reload());
          var lights = document.getElementsByClassName("modal-backdrop");
          while (lights.length)
            lights[0].className = lights[0].className.replace(
              /\modal-backdrop\b/g,
              ""
            );
        }
      })
      .catch(function (response) {
        console.log(response);
      });
  };
};
