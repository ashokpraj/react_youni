import Image from "next/image";
import Lockicon from "../../style/assets/images/icon-lock.png";
import Bigimage from "../../style/assets/images/bg-img.png";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { resetPasswordAction } from "../../redux/actions/reset";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Icon } from "react-icons-kit";
import { eye } from "react-icons-kit/feather/eye";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [emailLocal, setEmailLocal] = useState("");
  const query = router.query;

  useEffect(() => {
    if (window) {
      localStorage.setItem("Email", query.Email);
      if (query.Token !== "") {
        setEmailLocal(query.Token);
      }
      // Cookies.set("Email", query.Email);
    }
  });

  const [resetPassword, setResetPasseord] = useState({
    enctoken: emailLocal,
    NewPassword: "",
    ConfirmPassword: "",
  });
  const [resetErr, setResetErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  const handleResetChange = (e) => {
    if (e.target.name === "NewPassword") {
      setResetErr("");
    }
    if (e.target.name === "ConfirmPassword") {
      setConfirmErr("");
    }

    setResetPasseord({
      ...resetPassword,
      [e.target.name]: e.target.value,
    });
  };

  const validateResetForm = () => {
    let isValid = true;

    if (isEmpty(resetPassword?.NewPassword)) {
      setResetErr("Please enter your new passord");
      isValid = false;
    } else {
      if (!/[0-9]/.test(resetPassword.NewPassword)) {
        setResetErr("Please enter at least one numeric digit letter");
        isValid = false;
      }
      if (!/[A-Z]/.test(resetPassword.NewPassword)) {
        setResetErr("Please enter at least one uppercase letter");
        isValid = false;
      }
      if (!/[a-z]/.test(resetPassword.NewPassword)) {
        setResetErr("Please enter at least one lowercase letterr");
        isValid = false;
      }
      if (!/[$@!#_=%]/.test(resetPassword.NewPassword)) {
        setResetErr("Please enter at least one special character letter");
        isValid = false;
      }
      if (resetPassword?.NewPassword?.length < 7) {
        setResetErr("Please enter your password of at least 8 characters");
        isValid = false;
      }
    }

    if (isEmpty(resetPassword?.ConfirmPassword)) {
      setConfirmErr("Please re-enter your password");
      isValid = false;
    } else {
      if (!/[0-9]/.test(resetPassword.ConfirmPassword)) {
        setConfirmErr("Please enter at least one numeric digit letter");
        isValid = false;
      }
      if (!/[A-Z]/.test(resetPassword.ConfirmPassword)) {
        setConfirmErr("Please enter at least one uppercase letter");
        isValid = false;
      }
      if (!/[a-z]/.test(resetPassword.ConfirmPassword)) {
        setConfirmErr("Please enter at least one lowercase letter");
        isValid = false;
      }
      if (!/[$@!#_=%]/.test(resetPassword.ConfirmPassword)) {
        setConfirmErr("Please enter at least one special character letter");
        isValid = false;
      }
      if (resetPassword?.ConfirmPassword?.length < 7) {
        setConfirmErr(
          "Please enter your confirm password of at least 8 characters"
        );
        isValid = false;
      }
    }

    if (resetPassword?.NewPassword !== resetPassword?.ConfirmPassword) {
      toast.error("New password and Confirm password dosen't match!");
      isValid = false;
    }
    return isValid;
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    const isValid = validateResetForm();

    const dataSend = {
      enctoken: emailLocal,
      NewPassword: resetPassword.NewPassword,
      ConfirmPassword: resetPassword.ConfirmPassword,
    };

    if (isValid) {
      dispatch(resetPasswordAction(dataSend));
      localStorage.removeItem("Email");
    }
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  return (
    <>
      <Header />
      <div className="modal-popup-wrapper">
        <div
          className="modal fade modal-form-wrapper login-form reset-pass-form"
          id="exampleModalToggle"
          aria-hidden="true"
          data-bs-keyboard="false"
          aria-labelledby="exampleModalToggleLabel"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="form-title">Reset Password</h2>
              </div>
              <div className="modal-body">
                <div className="form-wrapper">
                  <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                      <label>
                        <Image className="form-icon" src={Lockicon} />
                        New Password
                      </label>
                      <div className="password-input-wrap">
                        <input
                          type={type}
                          name="NewPassword"
                          placeholder="New Password"
                          className="form-control"
                          onChange={handleResetChange}
                        />
                        <span className="pass-show-icon" onClick={handleToggle}>
                          <Icon icon={icon} />
                        </span>
                      </div>
                      {resetErr && (
                        <span className="error-msg">{resetErr}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>
                        <Image className="form-icon" src={Lockicon} />
                        Confirm New Password
                      </label>
                      <div className="password-input-wrap">
                        <input
                          type={type}
                          name="ConfirmPassword"
                          placeholder="Confirm New Password"
                          className="form-control"
                          onChange={handleResetChange}
                        />
                        <span className="pass-show-icon" onClick={handleToggle}>
                          <Icon icon={icon} />
                        </span>
                      </div>
                      {confirmErr && (
                        <span className="error-msg">{confirmErr}</span>
                      )}
                    </div>
                    <div className="form-group submit-form-wrapper">
                      <input
                        type="submit"
                        name=""
                        value="Change Password"
                        className="submit-btn-wrapper common-btn-pattern"
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-page-content">
        <section className="banner-image">
          <Image
            src={Bigimage}
            className="home-banner-img"
            alt="Banner Image"
          />
        </section>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default ResetPassword;
