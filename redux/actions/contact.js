import axios from "axios";
import { toast } from "react-toastify";
import * as type from "../types/type";

const APIURL = "https://apiyouni.rlogical.com/api";

const addContact = (data) => {
  return {
    type: type.ADD_CONTACT_DATA,
    payload: data,
  };
};

export const addContactData = (contact) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "post",
      data: contact,
      url: `${APIURL}/ContactUs/AddContactInfo`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(addContact(response.data.data));
          toast.success("Details are submitted successfully");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        console.log("Catch Console", response);
      });
  };
};
