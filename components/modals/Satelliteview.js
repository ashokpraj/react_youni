import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import Image from "next/image";
import NotesIcone from "../../style/assets/images/notes-icon.png";
import Calendaricone from "../../style/assets/images/calendar-icon.png";
import TaskIcon from "../../style/assets/images/task-icon.png";
import { useDispatch, useSelector } from "react-redux";
import { getSatelliteDeailsById } from "../../redux/actions/satellite";
import moment from "moment";
import { docShow, imageShow, pdfShow } from "../utils/showImages";

const Satelliteview = ({
  setShowSatelliteModal,
  hideShowSatelliteModal,
  showSatelliteId,
}) => {
  const dispatch = useDispatch();
  const singleSatelliteData = useSelector(
    (state) => state.satellite.signleSatellite
  );

  useEffect(() => {
    if (showSatelliteId && setShowSatelliteModal) {
      dispatch(getSatelliteDeailsById(showSatelliteId));
    }
  }, [showSatelliteId, setShowSatelliteModal]);

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };
  return (
    <>
      <Modal
        show={setShowSatelliteModal}
        onHide={hideShowSatelliteModal}
        scrollable={true}
        centered
        className="show-task-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>{singleSatelliteData?.sateliteName} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-field-wrapper">
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={Calendaricone} />
                <label>Start Datetime:- </label>
              </div>
              <div className="form-value">
                {moment(singleSatelliteData?.startDateTime).format(
                  "DD-MM-yyyy h:mm A"
                )}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={Calendaricone} />
                <label>End Datetime:- </label>
              </div>
              <div className="form-value">
                {" "}
                {moment(singleSatelliteData?.endDateTime).format(
                  "DD-MM-yyyy h:mm A"
                )}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={Calendaricone} />
                <label>End Datetime:- </label>
              </div>
              <div className="form-value">
                {" "}
                {moment(singleSatelliteData?.alarmDateTime).format(
                  "DD-MM-yyyy h:mm A"
                )}
              </div>
            </div>

            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={TaskIcon} />
                <label>Added Member:- </label>
              </div>
              <div className="form-value">
                {singleSatelliteData?.teams
                  ?.map((item) => item.userName)
                  .join(", ")}
              </div>
            </div>

            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Priority:- </label>
              </div>
              <div className="form-value">{singleSatelliteData?.priority}</div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Description:- </label>
              </div>
              <div className="form-value">
                {singleSatelliteData?.description}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Notes:- </label>
              </div>
              <div className="form-value">{singleSatelliteData?.note}</div>
            </div>
          </div>

          <div className="form-value-fields input-document">
            <div className="form-label-wrapper">
              <Image className="form-icon" src={NotesIcone} />
              <label>Document:- </label>
            </div>
            <div className="form-value">
              <div className="file_img">
                {singleSatelliteData?.attachments?.map((items) => {
                  return (
                    <>
                      {get_url_extension(items.attachmentPath) === "doc" ||
                      get_url_extension(items.attachmentPath) === "docx"
                        ? docShow(items.attachmentPath)
                        : get_url_extension(items?.attachmentPath) === "pdf"
                        ? pdfShow(items?.attachmentPath)
                        : imageShow(items?.attachmentPath)}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Satelliteview;
