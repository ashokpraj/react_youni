import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { requestForToken } from "../../lib/firebase";
import { getUserdataByToken } from "../../redux/actions/dashboard";
// import Notification from "../../lib/notification";

function Validateuser() {
  const dispatch = useDispatch();

  const payload = {
    notification: {
      title: "commented on your Post.",
      body: "commentData.comment.text",
    },
    token:
      "cD3MR1wqkYByRLCz_cK3ox:APA91bFiBUOj4K-cgCxDulPpnHPZCWYiZ6viSEWB9rKhcxNjFlymuAEbG2NI49kognnsEWzjhtjM7tn9OgFUxl40hGvrvxUxwFAfilubNA6yvGqJv244pshLJXysV_EwN557uG5i4ArQ",
  };
  const data = JSON?.stringify(payload);

  useEffect(() => {
    const accessToken = localStorage.getItem("loginToken");
    const userid = JSON.parse(localStorage.getItem("userData"));

    // requestForToken(dispatch, userid?.userID);
    if (accessToken) {
      dispatch(getUserdataByToken(accessToken));
    }
  }, []);

  return <>{/* <Notification/> */}</>;
}

export default Validateuser;
