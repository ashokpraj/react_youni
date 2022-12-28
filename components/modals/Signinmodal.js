import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sigInGoogle,
  LinedInSignin,
  LinedInSigninExistUser,
  sigInFacebook,
  sigInTwitter,
  signInuser,
} from "../../redux/actions/signin";
import { auth, google, facebook, twitter } from "../../lib/firebase-config";
import { signInWithPopup } from "firebase/auth";
import ForgotpasswordModal from "./Forgotpassword";
import * as image from "../../public/imagesURL";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import Loader from "../loader/Loader";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

const Signinmodal = () => {
  const dispatch = useDispatch();
  const [signin, setSignin] = useState({
    userEmail: "",
    password: "",
  });

  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const [userEmailErr, setUserEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [linkedInData, setLinkedInData] = useState("");
  const isLoading = useSelector((state) => state.signin.loading);
  const signInError = useSelector((state) => state.signin);
  const signUpError = useSelector((state) => state.signup);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("linkedin")) {
      const linkedInDatas = localStorage.getItem("linkedin");
      setLinkedInData(linkedInDatas);
      const sendDataToApi = JSON.parse(linkedInDatas);

      const signInData = {
        UserName: sendDataToApi.UserName,
        LoginType: sendDataToApi.LoginType,
      };

      if (linkedInDatas) {
        dispatch(LinedInSigninExistUser(signInData));
      }
    }
  }, [signInError]);

  const handleInputChange = (e) => {
    if (e.target.name === "userEmail") {
      setUserEmailErr("");
    }
    if (e.target.name === "password") {
      setPasswordErr("");
    }

    setSignin({
      ...signin,
      [e.target.name]: e.target.value,
    });
  };

  const validateNormalUserForm = () => {
    let isValid = true;
    if (isEmpty(signin.userEmail)) {
      setUserEmailErr("Please enter your email address");
      isValid = false;
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(signin.userEmail)) {
        setUserEmailErr("Please enter valid email");
        isValid = false;
      }
    }

    if (!signin.password) {
      setPasswordErr("Please enter your password");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateNormalUserForm();

    if (isValid) {
      dispatch(signInuser(signin, router));
    }
  };

  //Signin With Google
  const signinGoogle = (provider) => {
    signInWithPopup(auth, provider)
      .then((resp) => {
        const tokenDataGoogle = resp._tokenResponse;

        if (signUpError) {
          const userDataGoogle = {
            UserName: tokenDataGoogle.displayName,
            LoginType: "Google",
          };

          dispatch(sigInGoogle(resp, userDataGoogle, router));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Signin With Facebook
  const singinFB = (providerFb) => {
    signInWithPopup(auth, providerFb)
      .then((resp) => {
        const tokenDataFacebook = resp._tokenResponse;

        if (signUpError) {
          const userDataFacebbok = {
            UserName: tokenDataFacebook.displayName,
            LoginType: "Facebook",
          };

          dispatch(sigInFacebook(resp, userDataFacebbok, router));
        }
      })
      .catch((err) => {
        console.log("Catch error", err);
      });
  };

  //Signin With Twitter
  const singinTwitter = (providerTwitter) => {
    signInWithPopup(auth, providerTwitter)
      .then((resp) => {
        const tokenDataTwitter = resp._tokenResponse;

        if (signUpError) {
          const userDataTwitter = {
            UserName: tokenDataTwitter.displayName,
            LoginType: "Twitter",
          };

          dispatch(sigInTwitter(resp, userDataTwitter, router));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Siginn with Linkedin
  const { linkedInLogin } = useLinkedIn({
    clientId: "77h8n5nvamk1rz",
    redirectUri: `${
      typeof window === "object" && window.location.origin
    }/linkedin`,
    onSuccess: (code) => {
      const userDataLinkedin = {
        AuthorizationCode: code,
        UserTypeId: 2,
      };
      dispatch(LinedInSignin(userDataLinkedin, router));
    },
    scope: "r_emailaddress r_liteprofile",
    onError: (error) => {
      console.log(error);
    },
  });

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  //handle space
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="modal-popup-wrapper">
        <div
          className="modal fade modal-form-wrapper login-form"
          id="exampleModalToggle"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="form-title">Sign In</h2>
                <span className="form-sub-text">Welcome Let's go Started!</span>
              </div>
              <div className="modal-body">
                <div className="form-wrapper">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>
                        <Image className="form-icon" src={image.Usericon} />
                        Email Address
                      </label>
                      <input
                        type="text"
                        name="userEmail"
                        placeholder="Email Address"
                        className="form-control"
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                      />
                      {userEmailErr && (
                        <span className="error-msg">{userEmailErr}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>
                        <Image className="form-icon" src={image.Lockicon} />
                        Password
                      </label>
                      <div className="password-input-wrap">
                        <input
                          type={type}
                          name="password"
                          placeholder="Password"
                          className="form-control"
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          autoComplete="off"
                        />
                        <span className="pass-show-icon" onClick={handleToggle}>
                          <Icon icon={icon} />
                        </span>
                      </div>
                      {passwordErr && (
                        <span className="error-msg">{passwordErr}</span>
                      )}
                    </div>

                    <a
                      href="#forgotModalToggle"
                      className="link-redirection"
                      data-bs-toggle="modal"
                    >
                      Forgot Password
                    </a>
                    <div className="form-group submit-form-wrapper">
                      <input
                        type="submit"
                        name=""
                        value="Sign In"
                        className="submit-btn-wrapper common-btn-pattern"
                      />
                    </div>
                    <div className="form-footer">
                      <span>You are not a member</span>
                      <a
                        href="#"
                        className="form-link-redirection"
                        data-bs-toggle="modal"
                        data-bs-target="#signupModalToggle"
                      >
                        Register Now!
                      </a>
                    </div>
                  </form>
                  {isLoading === true ? <Loader /> : ""}
                </div>
              </div>
              <div className="form-footer">
                <span>Sign in with</span>
                <ul className="sign-up-opt">
                  <li>
                    <a href="#" onClick={() => singinFB(facebook)}>
                      <Image src={image.Fbicon} />
                    </a>
                  </li>
                  <li>
                    <a>
                      <Image
                        src={image.Emailicon}
                        onClick={() => signinGoogle(google)}
                      />
                    </a>
                  </li>
                  <li>
                    <a>
                      <Image src={image.LinkedIn} onClick={linkedInLogin} />
                    </a>
                  </li>
                  <li>
                    <a>
                      <Image
                        src={image.TwitterImage}
                        onClick={() => singinTwitter(twitter)}
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ForgotpasswordModal />
    </>
  );
};

export default Signinmodal;
