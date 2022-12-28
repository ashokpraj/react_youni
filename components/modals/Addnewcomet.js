import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addUpcomingComets,
  editUpcomingComet,
} from "../../redux/actions/comet";
// import { addUpcomingComet, editUpcomingComet } from "../../redux/actions/Comet";

const Addnewcomet = ({
  handleAddNewComet,
  hideModal,
  pageNumber,
  PageSize,
  userId,
}) => {
  const dispatch = useDispatch();
  const [cometNameErr, setCometNameErr] = useState();
  const userTokendata = useSelector((state) => state.signin.signin);
  const SingleComets = useSelector((state) => state?.comet?.signleComet);

  const [addNewComet, setAddNewComet] = useState({
    cometName: "",
    description: "",
    note: "",
  });

  useEffect(() => {
    setAddNewComet(SingleComets);
  }, [SingleComets]);

  const handleChangeComet = (e) => {
    let { name, value } = e.target;
    setAddNewComet({ ...addNewComet, [name]: value });
    if (e.target.name === "cometName") {
      setCometNameErr("");
    }
  };

  const validateCometForm = () => {
    let isValid = true;

    if (isEmpty(addNewComet?.cometName)) {
      setCometNameErr("Please enter comet name");
      isValid = false;
    }

    return isValid;
  };

  const handlleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateCometForm();

    if (isValid && addNewComet?.cometId) {
      let dataSend = {
        updatecometId: addNewComet.cometId,
        cometId: addNewComet.cometId,
        cometName: addNewComet.cometName,
        description: addNewComet.description,
        note: addNewComet.note,
        createdBy: userId,
      };

      // console.log("dataSendEdit :::", dataSend);
      // return;
      dispatch(editUpcomingComet(dataSend, pageNumber, PageSize, userId));
      handleClose();
    } else if (isValid) {
      let dataSend = {
        cometName: addNewComet.cometName,
        description: addNewComet.description,
        note: addNewComet.note,
        createdBy: userId,
        teams: [
          {
            userId: userTokendata?.userid,
            userName: userTokendata?.username,
          },
        ]
      };
      // console.log("dataSend :::", dataSend);
      // return;

      dispatch(addUpcomingComets(dataSend, pageNumber, PageSize, userId));
      handleClose();
    }
  };

  const handleClose = () => {
    setAddNewComet({
      cometName: "",
      description: "",
      note: "",
    });
    hideModal();
    setCometNameErr("");
  };

  //Handle Space
  const handlKeyDown = (e) => {
    if (e.key === " " && addNewComet?.cometName?.length === undefined) {
      e.preventDefault();
    }
  };

  const handlDecDown = (e) => {
    if (e.key === " " && addNewComet?.description?.length === undefined) {
      e.preventDefault();
    }
  };

  const handlNotesDown = (e) => {
    if (e.key === " " && addNewComet?.note?.length === undefined) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Modal
        show={handleAddNewComet}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="common-popup-details new-star-popup-details"
      >
        <Modal.Header>
          <Modal.Title>
            {addNewComet?.cometId ? "Update New Comet" : "Add New Comet"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Comet Name</label>
              <input
                type="text"
                name="cometName"
                placeholder="Please enter comet name"
                onChange={handleChangeComet}
                value={addNewComet?.cometName}
                onKeyDown={handlKeyDown}
              />
              {cometNameErr && (
                <span className="error-msg" style={{ color: "red" }}>
                  {cometNameErr}
                </span>
              )}
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="Please enter description"
                onChange={handleChangeComet}
                value={addNewComet?.description}
                onKeyDown={handlDecDown}
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <input
                type="text"
                name="note"
                placeholder="Please enter note"
                onChange={handleChangeComet}
                value={addNewComet?.note}
                onKeyDown={handlNotesDown}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlleSubmit}>
            {addNewComet?.cometId ? "Update" : "Add"}
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Addnewcomet;
