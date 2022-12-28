import axios from "axios";
import Router from "next/router";
import { toast } from "react-toastify";
import * as type from "../types/type";
import { getUserdataByToken, userAllData } from "./dashboard";
import { db } from "../../lib/firebase";

const APIURL = "https://apiyouni.rlogical.com/api";

export const editProfile = (profileData) => {
  return {
    type: type.EDIT_PROFILE,
    payload: profileData,
  };
};

export const editUserProfile = (updateData, userId) => {
  const token = localStorage.getItem("loginToken");
  return function (dispatch) {
    axios({
      method: "put",
      data: updateData,
      url: `${APIURL}/Authenticate/updateuser`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        if (response.data.code === 200) {
          const data = response.data.data;
          const datas = async () => {
            db.collection("User")
              .where("user_id", "==", response?.data?.data?.userid)
              .limit(1)
              .get()
              .then((query) => {
                const thing = query.docs[0];
                let tmp = thing.data();
                tmp.user_profile_picture = data?.photo;
                thing.ref.update(tmp);
              })
              .catch((err) => {
               console.log("err",err)
              });
          };
          datas();
          dispatch(userAllData(updateData.Userid, token));
          dispatch(getUserdataByToken(token));
          Router.push({
            pathname: '/viewProfile',
            query: { userId: updateData?.Userid }
        }, '/viewProfile');
          toast.success("Your Profile Updated Successfully.");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch(function (response) {
        toast.error(response.response.data.message);
      });
  };
};
