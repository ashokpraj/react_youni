import * as image from "../../public/imagesURL";
import Image from "next/image";
import React, { useState } from "react";
import isEmpty from "../validation/isEmpty";
import { addContactData } from "../../redux/actions/contact";
import { useDispatch } from "react-redux";

const Home = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inqDate: new Date(),
  });
  const [nameErr, setNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [subjectErr, setSubjectErr] = useState("");
  const [messageErr, setMessageErr] = useState("");
  const dispatch = useDispatch();

  const validateForm = () => {
    let isValid = true;
    if (isEmpty(state.name)) {
      setNameErr("Please enter your name");
      isValid = false;
    }
    if (isEmpty(state.subject)) {
      setSubjectErr("Please enter the subject");
      isValid = false;
    }

    if (isEmpty(state.email)) {
      setEmailErr("Please enter email address");
      isValid = false;
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email)) {
        setEmailErr("Please enter valid email");
        isValid = false;
      }
    }

    if (isEmpty(state.message)) {
      setMessageErr("Please enter message");
    }

    return isValid;
  };

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setNameErr("");
    }
    if (e.target.name === "email") {
      setEmailErr("");
    }
    if (e.target.name === "subject") {
      setSubjectErr("");
    }
    if (e.target.name === "message") {
      setMessageErr("");
    }

    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactUs = (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      dispatch(addContactData(state));
      setState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  };
  return (
    <>
      <div className="main-page-content">
        <section className="banner-image front-screen-wrapper">
          <Image
            src={image.Bigimage}
            className="home-banner-img"
            alt="Banner Image"
          />
        </section>

        <section className="app-management-wrapper">
          <div className="section-spacing">
            <div className="contact-us-section">
              <div className="contact-head-wrapper">
                <h3 className="contact-sub-title">
                  WITH YOUNI THE UNIVERSE REALLY DOES REVOLVE AROUND YOU
                </h3>
                <h2 className="section-sub-title">Contact Us</h2>
              </div>
              <div className="contact-form-wrapper">
                <form>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          value={state.name}
                          placeholder="Name"
                          className="form-control"
                          onChange={handleChange}
                        />
                        {nameErr && (
                          <span className="error-msg">{nameErr}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <input
                          type="email"
                          name="email"
                          value={state.email}
                          placeholder="Email"
                          className="form-control"
                          onChange={handleChange}
                        />
                        {emailErr && (
                          <span className="error-msg">{emailErr}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <input
                          type="text"
                          name="subject"
                          value={state.subject}
                          placeholder="Subject"
                          className="form-control"
                          onChange={handleChange}
                        />
                        {subjectErr && (
                          <span className="error-msg">{subjectErr}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12 contact-message-wrapper">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          name="message"
                          value={state.message}
                          placeholder="Message"
                          onChange={handleChange}
                        ></textarea>
                        {messageErr && (
                          <span className="error-msg">{messageErr}</span>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12 send-messge-btn">
                      <div className="form-group">
                        <input
                          type="submit"
                          value="Send Message"
                          onClick={handleContactUs}
                          name=""
                          className="common-btn gradient-btn"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
