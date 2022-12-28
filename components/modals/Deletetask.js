import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { deleteTasksData } from "../../redux/actions/task";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const Deletetask = ({ setDeleteTask, onHide }) => {
  const dispatch = useDispatch();

  const singleTask = useSelector((state) => state.task.singleTasksData);
  const start = moment(singleTask?.start).format("yyyy-MM-DD");
  const user = useSelector((state) => state.signin.signin);

  const deleteUserData = () => {
    dispatch(deleteTasksData(singleTask?.coTaskId, user?.userid, start));
    onHide();
  };

  return (
    <>
      <Modal
        show={setDeleteTask}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="common-popup-details delete-task-popup"
      >
        <Modal.Body>
          <h2 className="popup-title">Do you really want to delete ?</h2>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={deleteUserData}>Yes</Button>
          <Button onClick={onHide}>close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Deletetask;
