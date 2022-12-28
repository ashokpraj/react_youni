import Modal from "react-bootstrap/Modal";
import _ from "lodash";
import Button from "react-bootstrap/Button";

const Popup = ({
  show = false,
  className = "",
  title = "",
  children,
  footer,
  onHide,
  isSubmitting,
}) => {
  return (
    <Modal show={show} className={className} onHide={onHide} centered>
      {!_.isEmpty(title) && (
        <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter"> {title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body  disabled={isSubmitting}> {children} </Modal.Body>
      {!_.isEmpty(footer) && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
};

export { Popup as Modal };
