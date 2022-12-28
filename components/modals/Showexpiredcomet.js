import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getExpiredCometsDataOfUser } from "../../redux/actions/comet";

const Showexpiredcomet = ({
  setExpiredPopup,
  hideModal,
  totalExpiredAllComets,
  expiredAllCometsAll,
}) => {
  const dispatch = useDispatch();
  const userTokendata = useSelector((state) => state.signin.signin);

  useEffect(() => {
    // dispatch(getExpiredProjectData(userTokendata.userid));
  }, []);

  let pageNumber = 1;
  let PageSize = 10;
  const showPages = Math.ceil(totalExpiredAllComets?.length / PageSize);
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
    dispatch(getExpiredCometsDataOfUser(e, PageSize, userTokendata.userid));
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
          <Modal.Title>Expired Comets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <thead>
              <tr>
                <th>Comet Name</th>
                <th>Start Datetime</th>
                <th>Finish Datetime</th>
                <th>Alarm Datetime</th>
              </tr>
            </thead>
            <tbody>
              {expiredAllCometsAll?.length > 0 ? (
                expiredAllCometsAll?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.cometName}</td>
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
                })
              ) : (
                <td colspan="4" className="no-record-found">
                  No record found
                </td>
              )}
            </tbody>
          </table>
          {totalExpiredAllComets?.length > 10 ? (
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

export default Showexpiredcomet;
