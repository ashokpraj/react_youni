import Image from "next/image";
import { useEffect, useState } from "react";
import isEmpty from "../validation/isEmpty";
import { useDispatch, useSelector } from "react-redux";
import { UserSignp } from "../../redux/actions/signup";
import * as image from "../../public/imagesURL";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import Router, { useRouter } from "next/router";
import Loader from "../loader/Loader";

const Corporate = ({ removeCorporateState }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [corporateUser, setCorporateUser] = useState({
    username: "",
    skypename: null,
    emailId: "",
    password: "",
    privacy_policy: "",
    corporateid: "",
    UserTypeId: 1,
    gender: 3,
  });
  const [userNameErr, setUserNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [skypeNameErr, setSkypeNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [privacyErr, setPrivacyErr] = useState("");
  const [corporateErr, setCorporateErr] = useState("");
  const [check, setCheck] = useState(false);
  const isLoading = useSelector((state) => state.signup.loading);

  const validateCorporateUserForm = () => {
    let isValid = true;
    if (
      !isEmpty(corporateUser.skypename) &&
      !/^[a-zA-Z0-9.:]+$/.test(corporateUser.skypename)
    ) {
      setSkypeNameErr("Invalid skype name");
      isValid = false;
    }
    if (isEmpty(corporateUser.username)) {
      setUserNameErr("Please enter your user name");
      isValid = false;
    } else if (corporateUser.username.length < 3) {
      setUserNameErr("Please enter atleast 3 character");
      isValid = false;
    } else if (corporateUser.username.length > 50) {
      setUserNameErr("You reached exceed limit");
      isValid = false;
    } else {
      if (!/^[a-zA-Z0-9-.@\s_]+$/.test(corporateUser.username)) {
        setUserNameErr("Special character are not allowed");
        isValid = false;
      }
    }

    // if (isEmpty(corporateUser.skypename)) {
    //   setSkypeNameErr("Please enter your skype name");
    //   isValid = false;
    // } else {

    if (isEmpty(corporateUser.emailId)) {
      setEmailErr("Please enter email address");
      isValid = false;
    } else {
      if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(corporateUser.emailId)
      ) {
        setEmailErr("Please enter valid email");
        isValid = false;
      }
    }

    if (isEmpty(corporateUser.password)) {
      passwordErr = "Please enter your password";
      setPasswordErr(passwordErr);
      isValid = false;
    } else {
      if (!/[0-9]/.test(corporateUser.password)) {
        setPasswordErr("Please enter at least one numeric digit letter");
        isValid = false;
      }
      if (!/[A-Z]/.test(corporateUser.password)) {
        setPasswordErr("Please enter at least one uppercase letter");
        isValid = false;
      }
      if (!/[a-z]/.test(corporateUser.password)) {
        setPasswordErr("Please enter at least one lowercase letter");
        isValid = false;
      }
      if (!/[$@!#_=%]/.test(corporateUser.password)) {
        setPasswordErr("Please enter at least one special character letter");
        isValid = false;
      }
      if (corporateUser.password.length < 7) {
        setPasswordErr("Please enter your password of at least 8 characters");
        isValid = false;
      }
    }

    if (isEmpty(corporateUser.corporateid)) {
      setCorporateErr("Please enter corporate ID");
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

  const handleCorporateChnage = (e) => {
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
    if (e.target.name === "corporateid") {
      setCorporateErr("");
    }

    setCorporateUser({
      ...corporateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleCorporateSignup = (e) => {
    e.preventDefault();

    const isValid = validateCorporateUserForm();

    if (isValid) {
      if (!corporateUser.skypename) {
        let dataSend = {
          username: corporateUser.username.toLocaleLowerCase(),
          emailId: corporateUser.emailId.toLocaleLowerCase(),
          password: corporateUser.password,
          privacy_policy: "",
          corporateid: corporateUser.corporateid,
          UserTypeId: 1,
          gender: 3,
        };
        // console.log("dataSend ::::", dataSend);
        // return;
        dispatch(UserSignp(dataSend, router,check));
      } else {
        // console.log("innn ");
        // return;
        dispatch(UserSignp(corporateUser, router,check));
      }
    }
  };

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

  //handle space
  const handleKeyDownuserName = (e) => {
    if (e.key === " " && normalUser?.username?.length === 0) {
      e.preventDefault();
    }
  };

  //handle space
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

  const emptyErrors = () => {
    setUserNameErr("");
    setSkypeNameErr("");
    setEmailErr("");
    setPasswordErr("");
    setPrivacyErr("");
    setCorporateErr("");
  };

  useEffect(() => {
    if (removeCorporateState === true) {
      setCorporateUser({
        username: "",
        skypename: null,
        emailId: "",
        password: "",
        privacy_policy: "",
        corporateid: "",
        UserTypeId: 1,
        gender: 3,
      });
    }
    emptyErrors();
  }, [removeCorporateState]);

  return (
    <>
      <div
        className="tab-pane fade"
        id="corporate"
        role="tabpanel"
        aria-labelledby="corporate-tab"
      >
        <div className="form-wrapper">
          <form onSubmit={handleCorporateSignup}>
            <div className="form-group">
              <label>
                <Image className="form-icon" src={image.Usericon} />
                Corporate ID
              </label>
              <input
                type="text"
                name="corporateid"
                placeholder="Corporate ID"
                className="form-control"
                onChange={handleCorporateChnage}
                onKeyDown={handleKeyDownuserName}
                value={corporateUser.corporateid}
              />
              {corporateErr && (
                <span className="error-msg">{corporateErr}</span>
              )}
            </div>
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
                onChange={handleCorporateChnage}
                onKeyDown={handleKeyDown}
                value={corporateUser.username}
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
                onChange={handleCorporateChnage}
                onKeyDown={handleKeyDown}
                value={corporateUser.skypename}
              />
              {skypeNameErr && (
                <span className="error-msg">{skypeNameErr}</span>
              )}
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
                onChange={handleCorporateChnage}
                onKeyDown={handleKeyDown}
                value={corporateUser.emailId}
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
                  onChange={handleCorporateChnage}
                  onKeyDown={handleKeyDown}
                  value={corporateUser.password}
                />
                <span className="pass-show-icon" onClick={handleToggle}>
                  <Icon icon={icon} />
                </span>
              </div>
              {passwordErr && <span className="error-msg">{passwordErr}</span>}
            </div>
            <div className="checkbox-wrapper">
              <label className="check-label">
                By signing up, you will be agree to
                <br /> YOUNI{" "}
                <a href="#" style={{ cursor: "pointer" }} onClick={handleTerms}>
                  Terms of service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  style={{ cursor: "pointer" }}
                  onClick={handlePrivacy}
                >
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
          </form>
          {isLoading === true ? <Loader /> : ""}
        </div>
      </div>
    </>
  );
};

export default Corporate;
