import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getExpiredMoonsDataOfUser } from "../../redux/actions/moon";

const Showexpiredmoon = ({
  setExpiredPopup,
  hideModal,
  totalExpiredAllMoons,
  expiredAllMoonsAll,
  planetId,
}) => {
  const dispatch = useDispatch();
  const userTokendata = useSelector((state) => state.signin.signin);

  useEffect(() => {
    // dispatch(getExpiredProjectData(userTokendata.userid));
  }, []);

  let pageNumber = 1;
  let PageSize = 10;
  const showPages = Math.ceil(totalExpiredAllMoons?.length / PageSize);
  const renderTD = () => {
    let td = [];
    for (let i = 1; i <= showPages; i++) {
      td.push(
        <span key={i} onClick={() => handlePageChange(i)}>
          {i}
        </span>
      );
    }
    return td;
  };
  const handlePageChange = (e) => {
    dispatch(getExpiredMoonsDataOfUser(e, PageSize, planetId));
  };

  return (
    <>
      <Modal
        show={setExpiredPopup}
        onHide={hideModal}
        keyboard={false}
        scrollable={true}
        centered
        className="planet-details-popup common-popup-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>Extendend Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Moon Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
              </tr>
            </thead>
            <tbody>
              {expiredAllMoonsAll?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.moonName}</td>
                    <td>
                      {moment(item.startDateTime).format("DD-MM-yyyy h:mm A")}
                    </td>
                    <td>
                      {" "}
                      {moment(item.endDateTime).format("DD-MM-yyyy h:mm A")}
                    </td>
                    <td>
                      {item.alarmDateTime && moment(item.alarmDateTime).format("DD-MM-yyyy h:mm A")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {totalExpiredAllMoons?.length > 10 ? (
            <div className="pagination">{renderTD()}</div>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Showexpiredmoon;
