import { isEmpty } from "lodash";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addContactData } from "../../redux/actions/contact";

const Showcontactus = ({ setContactUs, hideModal }) => {
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
      hideModal();
    }
  };

  const handleClose = () => {
    setNameErr("");
    setEmailErr("");
    setSubjectErr("");
    setMessageErr("");
    hideModal();
  };

  return (
    <>
      <Modal
        show={setContactUs}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="contact-us-popup common-popup-details"
      >
        <Modal.Header>
          <Modal.Title>Contact Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                  {nameErr && <span className="error-msg">{nameErr}</span>}
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
                  {emailErr && <span className="error-msg">{emailErr}</span>}
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
              <div className="col-lg-12 contact-message">
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
              <div className="col-lg-12 contact-btn">
                <div className="form-group">
                  <input
                    type="submit"
                    value="Send Message"
                    onClick={handleContactUs}
                    name=""
                    className="btn gradient-btn"
                  />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Showcontactus;
