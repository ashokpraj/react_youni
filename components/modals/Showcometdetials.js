import moment from "moment";
import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCometDetailsById } from "../../redux/actions/comet";
import NotesIcone from "../../style/assets/images/notes-icon.png";
import Calendaricone from "../../style/assets/images/calendar-icon.png";
import TaskIcon from "../../style/assets/images/task-icon.png";
import { docShow, imageShow, pdfShow } from "../utils/showImages";
import Image from "next/image";

const Showcometdetials = ({
  setShowComeDetailModal,
  hideDetailsModal,
  cometViewId,
}) => {
  const dispatch = useDispatch();

  const cometSingleData = useSelector((state) => state.comet.signleComet);

  useEffect(() => {
    if (cometViewId && setShowComeDetailModal) {
      dispatch(getCometDetailsById(cometViewId));
    }
  }, [cometViewId, setShowComeDetailModal]);

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  return (
    <>
      <Modal
        show={setShowComeDetailModal}
        onHide={hideDetailsModal}
        scrollable={true}
        centered
        className="show-task-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>{cometSingleData?.cometName} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <div className="form-field-wrapper">
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={Calendaricone} />
                <label>Start Datetime:- </label>
              </div>
              <div className="form-value">
                {moment(cometSingleData?.startDateTime).format(
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
                {moment(cometSingleData?.endDateTime).format(
                  "DD-MM-yyyy h:mm A"
                )}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={Calendaricone} />
                <label>Alarm Datetime:- </label>
              </div>
              <div className="form-value">
                {" "}
                {cometSingleData?.alarmDateTime && moment(cometSingleData?.alarmDateTime).format(
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
                {cometSingleData?.teams
                  ?.map((item) => item.userName)
                  .join(", ")}
              </div>
            </div>

            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Priority:- </label>
              </div>
              <div className="form-value">{cometSingleData?.priority}</div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Description:- </label>
              </div>
              <div className="form-value">{cometSingleData?.description}</div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Notes:- </label>
              </div>
              <div className="form-value">{cometSingleData?.note}</div>
            </div>
          </div>
          <div className="form-value-fields input-document">
            <div className="form-label-wrapper">
              <Image className="form-icon" src={NotesIcone} />
              <label>Document:- </label>
            </div>
            <div className="form-value">
              <div className="file_img">
                {cometSingleData?.attachments?.map((items) => {
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

export default Showcometdetials;
