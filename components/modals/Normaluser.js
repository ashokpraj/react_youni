import Image from "next/image";
import { useEffect, useState } from "react";
import isEmpty from "../validation/isEmpty";
import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup, signOut } from "firebase/auth";
import * as image from "../../public/imagesURL";
import { auth, google, facebook, twitter } from "../../lib/firebase-config";
import {
  signupFacebbok,
  signupWithGoogle,
  signupWithLinedIn,
  signupWithTwitter,
  UserSignp,
} from "../../redux/actions/signup";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import Router, { useRouter } from "next/router";
import Loader from "../loader/Loader";

const NormalUser = ({ removeNormalUser }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoading = useSelector((state) => state.signup.loading);

  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  //Click of Facebook Signup
  const singupFB = (providerFb) => {
    signInWithPopup(auth, providerFb)
      .then((res) => {
        const tokenDataFacebook = res._tokenResponse;

        const userDataFacebbok = {
          Username: tokenDataFacebook.displayName,
          EmailId: tokenDataFacebook.email,
          UserTypeId: 2,
          MacAddress: "",
          LoginType: "Facebook",
          AccessToken: tokenDataFacebook.oauthAccessToken,
          UniqueId: res.user.uid,
          Photo: tokenDataFacebook.photoUrl,
          skypeName: "",
          dob: "",
          gender: 3,
          address: "",
        };

        dispatch(signupFacebbok(userDataFacebbok, router));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Click of Google Signup
  const signupGoogle = (provider) => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const tokenDataGoogle = res._tokenResponse;

        const userDataGoogle = {
          Username: tokenDataGoogle.displayName,
          EmailId: res.user.email,
          UserTypeId: 2,
          LoginType: "Google",
          AccessToken: tokenDataGoogle.oauthAccessToken,
          UniqueId: res.user.uid,
          Photo: tokenDataGoogle.photoUrl,
          skypeName: "",
          dob: "",
          gender: 3,
          address: "",
          IsSubscribed: "false",
        };

        // console.log("userDataGoogle :::", userDataGoogle);
        // return;
        dispatch(signupWithGoogle(userDataGoogle, router));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const signupTwitter = (providerTwitter) => {
    signInWithPopup(auth, providerTwitter).then((res) => {
      const tokenDataTwitter = res._tokenResponse;

      const userDataTwitter = {
        Username: tokenDataTwitter.displayName,
        UserTypeId: 2,
        macAddress: "",
        LoginType: "Twitter",
        AccessToken: res.user.accessToken,
        UniqueId: res.user.uid,
        Photo: tokenDataTwitter.photoUrl,
        skypeName: "",
        dob: "",
        gender: 3,
        address: "",
      };

      dispatch(signupWithTwitter(userDataTwitter, router));
    });
  };

  const [linkedinURL, setLinkedinURL] = useState("");

  useEffect(() => {
    const URL = `${window.location.origin}/linkedin`;
    setLinkedinURL(URL);
  }, []);

  // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
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
      dispatch(signupWithLinedIn(userDataLinkedin, router));
    },
    scope: "r_emailaddress r_liteprofile",
    onError: (error) => {
      console.log(error);
    },
  });

  const var1 = process.env.NEXT_PUBLIC_NORMAL_USER_ID;
  // console.log("Local Variable", var1);

  const var2 = process.env.NORMAL_USER_ID;
  // console.log("Without local", var2);

  const [normalUser, setNormalUser] = useState({
    username: "",
    skypename: null,
    emailId: "",
    userTypeId: 2,
    gender: 3,
    password: "",
  });

  const [userNameErr, setUserNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [skypeNameErr, setSkypeNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [privacyErr, setPrivacyErr] = useState("");
  const [check, setCheck] = useState(false);
  const [privacy_policy, setPrivacyPolicy] = useState("");
  // const Stripe = require("stripe");

  const validateNormalUserForm = () => {
    let isValid = true;

    if (
      !isEmpty(normalUser.skypename) &&
      !/^[a-zA-Z0-9.:]+$/.test(normalUser.skypename)
    ) {
      setSkypeNameErr("Invalid skype name");
      isValid = false;
    }

    if (isEmpty(normalUser.username)) {
      setUserNameErr("Please enter your user name");
      isValid = false;
    } else if (normalUser.username.length < 3) {
      setUserNameErr("Please enter atleast 3 character");
      isValid = false;
    } else if (normalUser.username.length > 50) {
      setUserNameErr("You reached exceed limit");
      isValid = false;
    } else {
      if (!/^[a-zA-Z0-9-.@\s_]+$/.test(normalUser.username)) {
        setUserNameErr("Special character are not allowed");
        isValid = false;
      }
    }

    if (isEmpty(normalUser.emailId)) {
      setEmailErr("Please enter your email address");
      isValid = false;
    } else {
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(normalUser.emailId)
      ) {
        setEmailErr("Please enter valid email");
        isValid = false;
      }
    }

    if (isEmpty(normalUser.password)) {
      passwordErr = "Please enter your password";
      setPasswordErr(passwordErr);
      isValid = false;
    } else {
      if (!/[0-9]/.test(normalUser.password)) {
        setPasswordErr("Please enter at least one numeric digit letter");
        isValid = false;
      }
      if (!/[A-Z]/.test(normalUser.password)) {
        setPasswordErr("Please enter at least one uppercase letter");
        isValid = false;
      }
      if (!/[a-z]/.test(normalUser.password)) {
        setPasswordErr("Please enter at least one lowercase letter");
        isValid = false;
      }
      if (!/[$@!#_=%]/.test(normalUser.password)) {
        setPasswordErr("Please enter at least one special character letter");
        isValid = false;
      }
      if (normalUser.password.length < 7) {
        setPasswordErr("Please enter your password of at least 8 characters");
        isValid = false;
      }
    }
    if (!check) {
      setPrivacyErr("Please select terms of service and privacy policy");
      isValid = false;
    }

    return isValid;
  };

  const handleCheckBox = () => {
    if (!check) {
      setCheck(true);
      setPrivacyErr(" ");
    } else {
      setCheck(false);
      // setPrivacyErr("Please select privacy policy and terms");
    }
  };

  const emptyErrors = () => {
    setUserNameErr("");
    setSkypeNameErr("");
    setEmailErr("");
    setPasswordErr("");
    setPrivacyErr("");
  };

  const handleNormalChnage = (e) => {
    if (e.target.name === "username") {
      setUserNameErr("");
    }
    if (e.target.name === "skypename") {
      setSkypeNameErr("");
    }
    if (e.target.name === "emailId") {
      setEmailErr("");
    }
    if (e.target.name === "password") {
      setPasswordErr("");
    }

    setNormalUser({
      ...normalUser,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (removeNormalUser === true) {
      setNormalUser({
        username: "",
        skypename: null,
        emailId: "",
        userTypeId: 2,
        gender: 3,
        password: "",
      });
    }
    emptyErrors();
  }, [removeNormalUser]);

  const handleNormalUserSignup = (e) => {
    e.preventDefault();

    const isValid = validateNormalUserForm();
    if (isValid) {
      // console.log("normalUser :::", normalUser);
      // return;

      const sendData = {
        username: normalUser.username.toLocaleLowerCase(),
        skypename: normalUser.skypename ? normalUser.skypename : null,
        emailId: normalUser.emailId.toLocaleLowerCase(),
        userTypeId: 2,
        gender: 3,
        password: normalUser.password,
      };

      // console.log("sendDatasendDatasendData :::", sendData);
      // return;
      dispatch(UserSignp(sendData, router,check));
    }
  };

  //handle space
  const handleKeyDownuserName = (e) => {
    if (e.key === " " && normalUser?.username?.length === 0) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handleTerms = (e) => {
    Router.push("/termsservices");
  };

  const handlePrivacy = (e) => {
    Router.push("/privacypolicy");
  };

  return (
    <div
      className="tab-pane fade show active"
      id="normal"
      role="tabpanel"
      aria-labelledby="normal-tab"
    >
      <div className="form-wrapper">
        <form onSubmit={handleNormalUserSignup}>
          <div className="form-group">
            <label>
              <Image className="form-icon" src={image.Usericon} />
              User Name
            </label>
            <input
              type="text"
              name="username"
              placeholder="User Name"
              className="form-control"
              // autoComplete="off"
              onChange={handleNormalChnage}
              onKeyDown={handleKeyDownuserName}
              value={normalUser.username}
            />
            {userNameErr && <span className="error-msg">{userNameErr}</span>}
          </div>
          <div className="form-group">
            <label>
              <Image className="form-icon" src={image.Skyicon} />
              Skype Name
            </label>
            <input
              type="text"
              name="skypename"
              placeholder="Skype Name"
              className="form-control"
              autoComplete="off"
              onChange={handleNormalChnage}
              onKeyDown={handleKeyDown}
              value={normalUser.skypename}
            />
            {skypeNameErr && <span className="error-msg">{skypeNameErr}</span>}
          </div>
          <div className="form-group">
            <label>
              <Image className="form-icon" src={image.Mailicon} />
              Email Address
            </label>
            <input
              type="text"
              name="emailId"
              placeholder="Email Address"
              className="form-control"
              autoComplete="off"
              onChange={handleNormalChnage}
              onKeyDown={handleKeyDown}
              value={normalUser.emailId}
            />
            {emailErr && <span className="error-msg">{emailErr}</span>}
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
                autoComplete="off"
                onChange={handleNormalChnage}
                onKeyDown={handleKeyDown}
                value={normalUser.password}
              />
              <span className="pass-show-icon" onClick={handleToggle}>
                <Icon icon={icon} />
              </span>
              {passwordErr && <span className="error-msg">{passwordErr}</span>}
            </div>
          </div>
          <div className="checkbox-wrapper">
            <label className="check-label">
              By signing up, you will be agree to
              <br /> YOUNI{" "}
              <a href="#" style={{ cursor: "pointer" }} onClick={handleTerms}>
                Terms of service
              </a>{" "}
              and{" "}
              <a href="#" style={{ cursor: "pointer" }} onClick={handlePrivacy}>
                Privacy Policy
              </a>
              <input
                type="checkbox"
                name="privacy_policy"
                onChange={handleCheckBox}
              />
              <span className="checkmark"></span>
            </label>
            {privacyErr && <span className="error-msg">{privacyErr}</span>}
          </div>

          <div className="form-group submit-form-wrapper">
            <input
              type="submit"
              name=""
              value="Sign Up"
              className="submit-btn-wrapper common-btn-pattern"
            />
          </div>
          <div className="sign-in-redirection">
            <span>You are already member?</span>
            <a
              href="#"
              className="form-link-redirection"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalToggle"
            >
              Sign In!
            </a>
          </div>
          <div className="form-footer">
            <span>Sign up with</span>
            <ul className="sign-up-opt">
              <li>
                <a href="#" onClick={() => singupFB(facebook)}>
                  <Image src={image.Fbicon} />
                </a>
              </li>
              <li>
                <a>
                  <Image
                    src={image.Emailicon}
                    onClick={() => signupGoogle(google)}
                  />
                </a>
              </li>
              <li>
                <a>
                  {/* <Image
                    onClick={linkedInLogin}
                    src={linkedin}
                    alt="Sign in with Linked In"
                    style={{ maxWidth: "180px", cursor: "pointer" }}
                  /> */}
                  <Image src={image.LinkedIn} onClick={linkedInLogin} />
                </a>
              </li>
              <li>
                <a>
                  <Image
                    src={image.TwitterImage}
                    onClick={() => signupTwitter(twitter)}
                  />
                </a>
              </li>
            </ul>
          </div>
        </form>
        {isLoading === true ? <Loader /> : ""}
      </div>
    </div>
  );
};

export default NormalUser;
