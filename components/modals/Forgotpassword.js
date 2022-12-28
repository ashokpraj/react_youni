import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordLink } from "../../redux/actions/forgot";
import * as image from "../../public/imagesURL";
import Loader from "../loader/Loader";

const Forgotpassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState({
    state: "",
  });

  const [emailError, setEmailError] = useState("");
  const isLoading = useSelector((state) => state.forgot.loading);

  const handleInputChange = (e) => {
    setEmailError("");
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  };

  const emailValidate = () => {
    let isValid = true;
    if (email.state) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.state)) {
        setEmailError("Please enter valid email");
        isValid = false;
      }
    }

    return isValid;
  };

  const handhleSubmit = (e) => {
    e.preventDefault();
    if (!email.state) {
      setEmailError("Please enter your email address");
    } else {
      const isValid = emailValidate();
      if (isValid) {
        dispatch(forgotPasswordLink(email.state));
        setEmail({
          state: "",
        });
      }
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
          className="modal fade modal-form-wrapper"
          id="forgotModalToggle"
          aria-hidden="true"
          aria-labelledby="forgotModalToggleleLabel"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="form-title">Forgot Password</h2>
              </div>
              <div className="modal-body">
                <div className="form-wrapper">
                  <form onSubmit={handhleSubmit}>
                    <div className="form-group">
                      <label>
                        <Image className="form-icon" src={image.Usericon} />
                        Email Address
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={email.state}
                        placeholder="Email Address"
                        className="form-control"
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                      />
                      {emailError && <p className="error-msg">{emailError}</p>}
                    </div>

                    <div className="reset-link-text">
                      Please enter email address. After submitting your email
                      address you will receive an email with a link to reset
                      your password
                    </div>
                    <div className="form-group submit-form-wrapper">
                      <input
                        type="submit"
                        name=""
                        value="SEND LINK"
                        className="submit-btn-wrapper common-btn-pattern"
                      />
                    </div>

                    {isLoading === true ? <Loader /> : ""}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgotpassword;
