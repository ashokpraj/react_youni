import { pushNotify } from "../../components/api/api";

export const pushNotification = (body) => {
    return () => {
      return pushNotify(body)
        .then((res) => {
          // console.log("response data:::::",res)
        })
        .catch((err) => {
          // toast.error(err?.response?.data?.message);
        });
    };
  };