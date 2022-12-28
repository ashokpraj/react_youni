import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import * as type from "../../redux/types/type";
const APIURL = "https://apiyouni.rlogical.com/api";
import _isEmpty from "lodash/isEmpty";
import { db, auth } from "../../lib/firebase";
import {
  saveUserToDB,
  signupFacebbok,
  signupWithGoogle,
  signupWithTwitter,
} from "./signup";
import { signInSuccess } from "../actions/dashboard";

const signInRequest = () => {
  return {
    type: type.SIGNIN_REQUEST,
  };
};

// const signInSuccess = (data) => {
//   return {
//     type: type.SIGNIN_SUCCESS,
//     payload: data,
//   };
// };

const signinFailure = (msg) => {
  return {
    type: type.SIGNIN_FAILURE,
    payload: msg,
  };
};

const reqestSignin = () => {
  return {
    type: type.SIGNIN_REQUEST,
  };
};

const logoutErr = () => ({
  type: type.LOGOUT_REQUEST_ERROR,
});
const doLogout = () => {
  return { type: type.LOGOUT_REQUEST_SUCCESS };
};

export const sigInGoogle = (signInData, sendData, router) => {
  return function (dispatch) {
    // console.log("signInData :::", signInData);
    // return;
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SocialMediaLogin`,
      data: sendData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        const data = response.data.data;

        dispatch(signInSuccess(data));
        localStorage.setItem("loginToken", response.data.token);
        if (response.data.code === 404) {
          const message = response.data.message;
        } else {
          const userData = JSON.stringify({
            userID: response.data.data.userid,
          });
          // localStorage.setItem("loginToken", data.accessToken);
          localStorage.setItem("userData", userData);
          const datas = async () => {
            db.collection("User")
              .where("user_id", "==", response?.data?.data?.userid)
              .get()
              .then((query) => {
                const thing = query.docs[0];
                let tmp = thing.data();
                tmp.status = "online";
                thing.ref.update(tmp);
              })
              .catch(() => {
                saveUserToDB(
                  data.userid,
                  data.username,
                  data.emailId,
                  data.isActive
                );
              });
          };
          datas();

          // Router.push("/dashboard");
          toast.success("Signin Successfully.");
          var lights = document.getElementsByClassName("modal-backdrop");
          while (lights.length)
            lights[0].className = lights[0].className.replace(
              /\modal-backdrop\b/g,
              ""
            );
          Router.push("/dashboard");
          // Router.push("/dashboard").then(() => router.reload());
        }
      })
      .catch(function (error) {
        const tokenDataGoogle = signInData._tokenResponse;

        const userDataGoogle = {
          Username: tokenDataGoogle.displayName,
          EmailId: signInData.user.email,
          UserTypeId: 2,
          LoginType: "Google",
          AccessToken: tokenDataGoogle.oauthAccessToken,
          UniqueId: signInData.user.uid,
          Photo: tokenDataGoogle.photoUrl,
          skypeName: "",
          dob: "",
          gender: 3,
          address: "",
          IsSubscribed: "false",
        };

        dispatch(signupWithGoogle(userDataGoogle));
        dispatch(signInSuccess(userDataGoogle));
        // dispatch(signinFailure(error.response.data.message));
      });
  };
};

export const sigInFacebook = (resp, users, router) => {
  return function (dispatch) {
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SocialMediaLogin`,
      data: users,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        const userData = JSON.stringify({
          userID: response.data.data.userid,
        });
        const data = response.data.data;
        dispatch(signInSuccess(data));
        localStorage.setItem("userData", userData);
        if (response.data.code === 404) {
          const message = response.data.message;
          dispatch(signinFailure(message));
          // toast.error(message);
        } else {
          localStorage.setItem("loginToken", response.data.token);
          const data = response.data.data;
          const datas = async () => {
            db.collection("User")
              .where("user_id", "==", response?.data?.data?.userid)
              .limit(1)
              .get()
              .then((query) => {
                const thing = query.docs[0];
                let tmp = thing.data();
                tmp.status = "online";
                thing.ref.update(tmp);
              })
              .catch(() => {
                saveUserToDB(
                  data.userid,
                  data.username,
                  data.emailId,
                  data.isActive
                );
              });
          };
          datas();
          toast.success("Signin Successfully.");
          var lights = document.getElementsByClassName("modal-backdrop");
          while (lights.length)
            lights[0].className = lights[0].className.replace(
              /\modal-backdrop\b/g,
              ""
            );
          Router.push("/dashboard");
          // Router.push("/dashboard").then(() => router.reload());
        }
      })
      .catch(function (error) {
        const tokenDataFacebook = resp._tokenResponse;

        const userDataFacebbok = {
          Username: tokenDataFacebook.displayName,
          EmailId: tokenDataFacebook.email,
          UserTypeId: 2,
          MacAddress: "",
          LoginType: "Facebook",
          AccessToken: tokenDataFacebook.oauthAccessToken,
          UniqueId: resp.user.uid,
          Photo: tokenDataFacebook.photoUrl,
          skypeName: "",
          dob: "",
          gender: 3,
          address: "",
          IsSubscribed: "false",
        };

        dispatch(signupFacebbok(userDataFacebbok));
        dispatch(signInSuccess(userDataFacebbok));
        // dispatch(signinFailure(error.response.data.message));
      });
  };
};

export const sigInTwitter = (resp, users,router) => {
  return function (dispatch) {
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SocialMediaLogin`,
      data: users,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        // console.log("response ::::", response);
        // return;
        const userData = JSON.stringify({
          userID: response.data.data.userid,
        });
        const data = response.data.data;
        dispatch(signInSuccess(data));
        localStorage.setItem("userData", userData);
        if (response.data.code === 404) {
          const message = response.data.message;
          dispatch(signinFailure(message));
          Router.push("/dashboard");
        } else {
          localStorage.setItem("loginToken", response.data.token);
          const data = response.data.data;
          const datas = async () => {
            db.collection("User")
              .where("user_id", "==", response?.data?.data?.userid)
              .limit(1)
              .get()
              .then((query) => {
                const thing = query.docs[0];
                let tmp = thing.data();
                tmp.status = "online";
                thing.ref.update(tmp);
              })
              .catch(() => {
                saveUserToDB(
                  data.userid,
                  data.username,
                  data.emailId,
                  data.isActive
                );
              });
          };
          datas();
          // Router.push("/dashboard");
          toast.success("Signin Successfully.");
        }
        var lights = document.getElementsByClassName("modal-backdrop");
        while (lights.length)
          lights[0].className = lights[0].className.replace(
            /\modal-backdrop\b/g,
            ""
          );

        Router.push("/dashboard");
        // Router.push("/dashboard").then(() => router.reload());

      })
      .catch(function (error) {
        const tokenDataTwitter = resp._tokenResponse;
        const userDataTwitter = {
          Username: tokenDataTwitter.displayName,
          UserTypeId: 2,
          macAddress: "",
          LoginType: "Twitter",
          AccessToken: resp.user.accessToken,
          UniqueId: resp.user.uid,
          Photo: tokenDataTwitter.photoUrl,
          skypeName: "",
          dob: "",
          gender: 3,
          address: "",
          IsSubscribed: "false",
        };

        dispatch(signupWithTwitter(userDataTwitter));
        dispatch(signInSuccess(userDataTwitter));
        // dispatch(signinFailure(error.response.data.message));
      });
  };
};

export const signInuser = (users, router,check) => {
  return function (dispatch) {
    dispatch(signInRequest());
    const signInData = {
      username: users.userEmail.toLocaleLowerCase(),
      password: users.password,
    };

    // console.log("signInData ::::", signInData);
    // return;

    axios({
      method: "post",
      url: `${APIURL}/Authenticate/login`,
      data: JSON.stringify(signInData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 404) {
          const message = response.data.message;
          dispatch(signinFailure(message));
          toast.error(message);
        } else {
          
          const data = response.data.data;
          const userData = JSON.stringify({
            userID: response.data.data.userid,
          });
          localStorage.setItem("loginToken", response.data.token);
          localStorage.setItem("userData", userData);

          const storeData = data;
          const datas = async () => {
            db.collection("User")
              .where("user_id", "==", response?.data?.data?.userid)
              .limit(1)
              .get()
              .then((query) => {
                const thing = query.docs[0];
                let tmp = thing.data();
                tmp.status = "online";
                thing.ref.update(tmp);
              })
              .catch(() => {
                saveUserToDB(
                  data.userid,
                  data.username,
                  data.emailId,
                  data.isActive
                );
              });
          };
          datas();
          dispatch(signInSuccess(data));
          if(check){
          toast.success("Signup Successfully.");
          }else{
            toast.success("Signin Successfully.");
          }
          // Router.push("/dashboard").;
          var lights = document.getElementsByClassName("modal-backdrop");
          while (lights.length)
            lights[0].className = lights[0].className.replace(
              /\modal-backdrop\b/g,
              ""
            );
           
          Router.push("/dashboard");
          // Router.push("/dashboard").then(() => router.reload());
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.code === 404) {
          dispatch(signinFailure(error.response.data.message));
          toast.error(error.response.data.message);
        } else {
          const msg = "API is on progres";
          dispatch(signinFailure(msg));
          toast.error(msg);
        }
      });
  };
};

export const LinedInSignin = (users, router) => {
  return function (dispatch) {
    dispatch(reqestSignin());
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SignInUsingLinkedIn`,
      data: users,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        if (response.data.code === 400) {
          if (
            !response.data.data &&
            response.data.data !== "" &&
            response.data.data !== null
          ) {
            axios({
              method: "post",
              url: `${APIURL}/Authenticate/SignInUsingLinkedIn`,
              data: users,
              headers: { "Content-Type": "multipart/form-data" },
            })
              .then(function (response) {
                const socialDataDisp = JSON.stringify({
                  userName: response.data.data.username,
                });

                const userData = JSON.stringify({
                  userID: response.data.data.userid,
                });

                localStorage.setItem("userData", userData);
                localStorage.setItem("socialData", socialDataDisp);
                localStorage.setItem("loginToken", response.data.accessToken);
                const data = response.data.data;
                const datas = async () => {
                  db.collection("User")
                    .where("user_id", "==", response?.data?.data?.userid)
                    .limit(1)
                    .get()
                    .then((query) => {
                      const thing = query.docs[0];
                      let tmp = thing.data();
                      tmp.status = "online";
                      thing.ref.update(tmp);
                    })
                    .catch(() => {
                      saveUserToDB(
                        data.userid,
                        data.username,
                        data.emailId,
                        data.isActive
                      );
                    });
                };
                datas();

                // Router.push("/dashboard");
                var lights = document.getElementsByClassName("modal-backdrop");
                toast.success("Signin Successfully.");
                while (lights.length)
                  lights[0].className = lights[0].className.replace(
                    /\modal-backdrop\b/g,
                    ""
                  );
                 
                Router.push("/dashboard");
                // Router.push("/dashboard").then(() => router.reload());
              })
              .catch(function (response) {
                console.log(response);
              });
          } else {
            const sendData = JSON.stringify({
              UserName: response.data.data.username,
              LoginType: "LinkedIn",
            });
            localStorage.setItem("linkedin", sendData);
          }
        }
      })
      .catch(function (response) {
        console.log("response", response);
      });
  };
};

export const LinedInSigninExistUser = (users) => {
  return function (dispatch) {
    axios({
      method: "post",
      url: `${APIURL}/Authenticate/SocialMediaLogin`,
      data: users,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        const userData = JSON.stringify({
          userID: response.data.data.userid,
        });
        localStorage.setItem("userData", userData);
        if (response.data.code === 404) {
          const message = response.data.message;
          dispatch(signinFailure(message));
          Router.push("/dashboard");
        } else {
          localStorage.setItem("loginToken", response.data.token);
          Router.push("/dashboard");
        }
        var lights = document.getElementsByClassName("modal-backdrop");
        while (lights.length)
          lights[0].className = lights[0].className.replace(
            /\modal-backdrop\b/g,
            ""
          );
      })
      .catch(function (error) {
        dispatch(signinFailure(error.response.data.message));
      });
  };
};

export const Logout = (id) => {
  return (dispatch) => {
    try {
      db.collection("User")
        .where("user_id", "==", id)
        .limit(1)
        .get()
        .then((query) => {
          const thing = query.docs[0];
          let tmp = thing.data();
          tmp.status = "offline";
          thing.ref.update(tmp);
        });
      localStorage.clear();
      dispatch(doLogout());
    } catch (err) {
      dispatch(logoutErr());
    }
  };
};
