import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addUpcomingStar, editUpcomingStar } from "../../redux/actions/star";

const Addnewstar = ({
  handleAddNewStar,
  hideModal,
  pageNumber,
  PageSize,
  userId,
  bearerToken,
}) => {
  const dispatch = useDispatch();
  const [projectNameErr, setProjectNameErr] = useState();
  const userTokendata = useSelector((state) => state.signin.signin);
  const SingleStars = useSelector((state) => state?.star?.singleNewStar);

  const [addNewStar, setAddNewStar] = useState({
    projectName: "",
    description: "",
    note: "",
  });

  useEffect(() => {
    setAddNewStar(SingleStars);
  }, [SingleStars]);

  const handleChangeStar = (e) => {
    let { name, value } = e.target;
    setAddNewStar({ ...addNewStar, [name]: value });
    if (e.target.name === "projectName") {
      setProjectNameErr("");
    }
  };

  const validateStarForm = () => {
    let isValid = true;

    if (isEmpty(addNewStar.projectName)) {
      setProjectNameErr("Please enter star name");
      isValid = false;
    }

    return isValid;
  };

  const handlleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateStarForm();

    if (isValid && addNewStar?.projectId) {
      let dataSend = {
        updateProjectId: addNewStar.projectId,
        projectName: addNewStar.projectName,
        description: addNewStar.description,
        note: addNewStar.note,
        createdBy: userId,
      };
      dispatch(
        editUpcomingStar(dataSend, pageNumber, PageSize, userId, bearerToken)
      );
      handleClose();
    } else if (isValid) {
      let dataSend = {
        projectName: addNewStar.projectName,
        description: addNewStar.description,
        note: addNewStar.note,
        createdBy: userId,
        teams: [
          {
            userId: userTokendata?.userid,
            userName: userTokendata?.username,
          },
        ]
      };

      dispatch(
        addUpcomingStar(dataSend, pageNumber, PageSize, userId, bearerToken)
      );
      handleClose();
    }
  };

  const handleClose = () => {
    setAddNewStar({
      projectName: "",
      description: "",
      note: "",
    });
    hideModal();
    setProjectNameErr("");
  };

  //Handle Space
  const handlKeyDown = (e) => {
    if (e.key === " " && addNewStar?.projectName?.length === undefined) {
      e.preventDefault();
    }
  };

  const handlDecDown = (e) => {
    if (e.key === " " && addNewStar?.description?.length === undefined) {
      e.preventDefault();
    }
  };

  const handlNotesDown = (e) => {
    if (e.key === " " && addNewStar?.note?.length === undefined) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Modal
        show={handleAddNewStar}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="common-popup-details new-star-popup-details"
      >
        <Modal.Header>
          <Modal.Title>
            {addNewStar?.projectId ? "Update New Star" : "Add New Star"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Star Name</label>
              <input
                type="text"
                name="projectName"
                placeholder="Please enter star name"
                onChange={handleChangeStar}
                value={addNewStar?.projectName}
                onKeyDown={handlKeyDown}
                // pattern="[^\s]+"
              />
              {projectNameErr && (
                <span className="error-msg" style={{ color: "red" }}>
                  {projectNameErr}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="Please enter description"
                onChange={handleChangeStar}
                value={addNewStar?.description}
                onKeyDown={handlDecDown}
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <input
                type="text"
                name="note"
                placeholder="Please enter note"
                onChange={handleChangeStar}
                value={addNewStar?.note}
                onKeyDown={handlNotesDown}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlleSubmit}>
            {addNewStar?.projectId ? "Update" : "Add"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Addnewstar;
