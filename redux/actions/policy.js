import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import * as type from "../types/type";

const APIURL = "https://apiyouni.rlogical.com/api";

const storePrivacyPolicy = (data) => {
  return {
    type: type.PRIVACY_POLICY,
    payload: data,
  };
};

const termsAndServices = (data) => {
  return {
    type: type.TERMS_AND_SERVICES,
    payload: data,
  };
};

export const getPrivacyPolicy = () => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/TermsConditions/getTermsCondition`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(termsAndServices(response.data.data[0]));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};

export const getTermsAndService = () => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "get",
      url: `${APIURL}/PrivacyPolicy/getPrivacyPolicy`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          dispatch(storePrivacyPolicy(response.data.data[0]));
        }
      })
      .catch(function (response) {
        // console.log(response);
      });
  };
};
