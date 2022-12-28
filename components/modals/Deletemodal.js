import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteComet } from "../../redux/actions/comet";
import { deleteMoonData } from "../../redux/actions/moon";
import { deletePlanet } from "../../redux/actions/planet";
import { deleteSatelliteData } from "../../redux/actions/satellite";
import { deleteStar } from "../../redux/actions/star";

const Deletemodal = ({
  showPopup,
  onHide,
  deltedId,
  pageNumber,
  PageSize,
  clickKey,
  projectID,
  planetId,
  moonId,
  count
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.signin.signin);

  const deleteData = () => {
    if (clickKey === "star") {
      dispatch(deleteStar(deltedId, pageNumber, PageSize, user?.userid,count));
    } else if (clickKey === "comet") {
      dispatch(deleteComet(deltedId, pageNumber, PageSize, user?.userid,count));
    } else if (clickKey === "planet") {
      dispatch(
        deletePlanet(deltedId, pageNumber, PageSize, projectID, user?.userid, count)
      );
    } else if (clickKey === "moon") {
      dispatch(
        deleteMoonData(deltedId, pageNumber, PageSize, planetId, user?.userid,count)
      );
    } else if (clickKey === "satellite") {
      dispatch(
        deleteSatelliteData(
          pageNumber,
          PageSize,
          moonId,
          deltedId,
          user?.userid, count
        )
      );
    }

    onHide();
  };

  return (
    <>
      <Modal
        show={showPopup}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="common-popup-details delete-task-popup"
      >
        <Modal.Body>
          <h2 className="popup-title">Are you sure you want to delete ?</h2>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={deleteData}>Yes</Button>
          <Button onClick={onHide}>close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Deletemodal;
