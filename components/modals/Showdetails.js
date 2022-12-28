import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getStarImages,
  getStarTeamMember,
} from "../../redux/actions/dashboard";
import { getMoonImages, getMoonTeamMember } from "../../redux/actions/moon";
import {
  getPlanetImages,
  getPlanetTeamMember,
} from "../../redux/actions/planet";
import { getSatelliteImages } from "../../redux/actions/satellite";
import Image from "next/image";
import NotesIcone from "../../style/assets/images/notes-icon.png";
import Calendaricone from "../../style/assets/images/calendar-icon.png";
import TaskIcon from "../../style/assets/images/task-icon.png";
import { docShow, imageShow, pdfShow } from "../utils/showImages";

const Showdetails = ({
  setShowDetailModal,
  hideDetailsModal,
  allStarData,
  allPlanetData,
  allMoonData,
  allSatelliteliteData,
  click,
  signleStelliteImage,
  singleSatelliteTeamData,
  singleDatas,
  userDataDisp,
  userId,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const query = router.query;

  const starTeams = useSelector((state) => state.dashboard.starTeams);
  const starImages = useSelector((state) => state.dashboard.starAttachments);
  const planetTeams = useSelector((state) => state.planet.planetTeams);
  const planetImages = useSelector((state) => state.planet.planetAttachments);
  const moonTeams = useSelector((state) => state.moon.moonTeams);
  const moonImages = useSelector((state) => state.moon.moonAttachments);
  // const assignUserName = allStarData.createdBy;

  // console.log("allStarData ::::", allStarData);
  // console.log("assignUserName :::::", assignUserName);

  const stelliteTeam =
    singleSatelliteTeamData &&
    singleSatelliteTeamData.map((item) => item.username).join(", ");

  useEffect(() => {
    setTimeout(function () {
      if (query.projectId) {
        // dispatch(getStarTeamMember(starId));
        // dispatch(getStarImages(query.projectId));
      }
      if (query.planetId) {
        dispatch(getPlanetTeamMember(query.planetId));
        dispatch(getPlanetImages(query.planetId));
      }

      if (query.moonId) {
        // dispatch(getMoonTeamMember(query.moonId));
        // dispatch(getMoonImages(query.moonId));
      }

      if (allSatelliteliteData?.length > 0) {
        dispatch(getSatelliteImages(allSatelliteliteData?.sateliteId));
      }
    }, 500);
  }, [router.query]);

  const get_url_extension = (url) => {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  };

  return (
    <>
      <Modal
        show={setShowDetailModal}
        onHide={hideDetailsModal}
        scrollable={true}
        centered
        className="show-task-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            {click === "allMoonData"
              ? allMoonData?.moonName
              : click === "allPlanetData"
              ? allPlanetData?.planetName
              : click === "allStarData"
              ? allStarData?.projectName
              : click === "allSatelliteliteData"
              ? allSatelliteliteData?.sateliteName
              : ""}{" "}
            Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-field-wrapper">
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={Calendaricone} />
                <label>Start Datetime:- </label>
              </div>
              <div className="form-value">
                {click === "allMoonData"
                  ? moment(allMoonData?.startDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : click === "allPlanetData"
                  ? moment(allPlanetData?.startDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : click === "allStarData"
                  ? moment(allStarData?.startDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : click === "allSatelliteliteData"
                  ? moment(allSatelliteliteData?.startDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : ""}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={Calendaricone} />
                <label>End Datetime:- </label>
              </div>
              <div className="form-value">
                {click === "allMoonData"
                  ? moment(allMoonData?.endDateTime).format("DD-MM-yyyy h:mm A")
                  : click === "allPlanetData"
                  ? moment(allPlanetData?.endDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : click === "allStarData"
                  ? moment(allStarData?.endDateTime).format("DD-MM-yyyy h:mm A")
                  : click === "allSatelliteliteData"
                  ? moment(allSatelliteliteData?.endDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : ""}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={Calendaricone} />
                <label>Alarm Datetime:- </label>
              </div>
              <div className="form-value">
                {click === "allMoonData"
                  ? allMoonData?.alarmDateTime && moment(allMoonData?.alarmDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : click === "allPlanetData"
                  ? allPlanetData?.alarmDateTime && moment(allPlanetData?.alarmDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : click === "allStarData"
                  ? allStarData?.alarmDateTime && moment(allStarData?.alarmDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : click === "allSatelliteliteData"
                  ? allSatelliteliteData?.alarmDateTime && moment(allSatelliteliteData?.alarmDateTime).format(
                      "DD-MM-yyyy h:mm A"
                    )
                  : ""}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={TaskIcon} />
                <label>Added Member:- </label>
              </div>

              <div className="form-value">
                {click === "allMoonData"
                  ? allMoonData?.teams?.map((item) => item.userName).join(", ")
                  : click === "allPlanetData"
                  ? allPlanetData?.teams
                      ?.map((item) => item.userName)
                      .join(", ")
                  : click === "allStarData"
                  ? allStarData?.teams?.map((item) => item.userName).join(", ")
                  : click === "allSatelliteliteData"
                  ? allSatelliteliteData?.teams
                      ?.map((item) => item.userName)
                      .join(", ")
                  : ""}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Priority:- </label>
              </div>
              <div className="form-value">
                {click === "allMoonData"
                  ? allMoonData?.priority
                  : click === "allPlanetData"
                  ? allPlanetData?.priority
                  : click === "allStarData"
                  ? allStarData?.priority
                  : click === "allSatelliteliteData"
                  ? allSatelliteliteData?.priority
                  : ""}
              </div>
            </div>

            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Description:- </label>
              </div>
              <div className="form-value">
                {click === "allMoonData"
                  ? allMoonData?.description
                  : click === "allPlanetData"
                  ? allPlanetData?.description
                  : click === "allStarData"
                  ? allStarData?.description
                  : click === "allSatelliteliteData"
                  ? allSatelliteliteData?.description
                  : ""}
              </div>
            </div>
            <div className="form-value-fields">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Notes:- </label>
              </div>
              <div className="form-value">
                {click === "allMoonData"
                  ? allMoonData?.note
                  : click === "allPlanetData"
                  ? allPlanetData?.note
                  : click === "allStarData"
                  ? allStarData?.note
                  : click === "allSatelliteliteData"
                  ? allSatelliteliteData?.note
                  : ""}
              </div>
            </div>
            <div className="form-value-fields input-document">
              <div className="form-label-wrapper">
                <Image className="form-icon" src={NotesIcone} />
                <label>Document:- </label>
              </div>
              <div className="form-value">
                <div className="file_img">
                  {click === "allStarData"
                    ? allStarData?.attachments?.map((items, index) => {
                        return get_url_extension(items.attachmentPath) ===
                          "doc" ||
                          get_url_extension(items.attachmentPath) === "docx"
                          ? docShow(items.attachmentPath)
                          : get_url_extension(items.attachmentPath) === "pdf"
                          ? pdfShow(items.attachmentPath)
                          : imageShow(items.attachmentPath);
                      })
                    : click === "allPlanetData"
                    ? allPlanetData?.attachments?.map((items, index) => {
                        return get_url_extension(items.attachmentPath) ===
                          "doc" ||
                          get_url_extension(items.attachmentPath) === "docx"
                          ? docShow(items.attachmentPath)
                          : get_url_extension(items.attachmentPath) === "pdf"
                          ? pdfShow(items.attachmentPath)
                          : imageShow(items.attachmentPath);
                      })
                    : click === "allMoonData"
                    ? allMoonData?.attachments?.map((items, index) => {
                        return get_url_extension(items.attachmentPath) ===
                          "doc" ||
                          get_url_extension(items.attachmentPath) === "docx"
                          ? docShow(items.attachmentPath)
                          : get_url_extension(items.attachmentPath) === "pdf"
                          ? pdfShow(items.attachmentPath)
                          : imageShow(items.attachmentPath);
                      })
                    : click === "allSatelliteliteData"
                    ? allSatelliteliteData?.attachments?.map((items, index) => {
                        return get_url_extension(items.attachmentPath) ===
                          "doc" ||
                          get_url_extension(items.attachmentPath) === "docx"
                          ? docShow(items.attachmentPath)
                          : get_url_extension(items.attachmentPath) === "pdf"
                          ? pdfShow(items.attachmentPath)
                          : imageShow(items.attachmentPath);
                      })
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Showdetails;
