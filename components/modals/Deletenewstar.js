import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteUpcomeingStar } from "../../redux/actions/star";

const Deletenewstar = ({
  setShowDeletePopup,
  handleHideDeletepopup,
  deleteValue,
  pageNumber,
  PageSize,
  userId,
  bearerToken,
}) => {
  const dispatch = useDispatch();

  const hanleDeleteStar = () => {
    dispatch(
      deleteUpcomeingStar(
        deleteValue,
        pageNumber,
        PageSize,
        userId,
        bearerToken
      )
    );
    handleHideDeletepopup();
  };
  return (
    <>
      <Modal
        show={setShowDeletePopup}
        onHide={handleHideDeletepopup}
        keyboard={false}
        scrollable={true}
        centered
        className="new-star-popup-details common-popup-details delete-new-star"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Star</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2 className="popup-title">
            Are you sure you want to delete this star ?
          </h2>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hanleDeleteStar}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleHideDeletepopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Deletenewstar;
