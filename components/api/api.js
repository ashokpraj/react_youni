import axios from "axios";

export const API_URL = "https://apiyouni.rlogical.com/api/";

//Get token after login
const getHeaders = () => {
  const token = localStorage.getItem("loginToken");
  return {
    headers: {
      Authorization: "Bearer " + token,
      "No-Auth-Challenge": true,
    },
  };
};

//Get Comtes of User
export const getAllCometsByUserData = async (pageNumber, PageSize, userId) => {
  const config = getHeaders();
  config.params = {
    PageNumber: pageNumber,
    PageSize: PageSize,
    userId: userId,
  };
  config["Content-Type"] = "application/json";

  return await axios.get(`${API_URL}Comet/GetCometsofUser`, config);
};

//Show All projects data
export const projectsAllDataMain = async (pageNumber, PageSize, userId) => {
  const config = getHeaders();
  config.params = {
    PageNumber: pageNumber,
    PageSize: PageSize,
    userId: userId,
  };
  config["Content-Type"] = "application/json";

  return await axios.get(`${API_URL}Projects/GetProjectsofUser`, config);
};

//Get Archive Planet data of particualr projects
export const getArchivePlanetsOfProjects = async (
  pageNumber,
  PageSize,
  projectId
) => {
  // console.log(
  //   "pageNumber, PageSize,projectId",
  //   pageNumber,
  //   PageSize,
  //   projectId
  // );
  // return;
  const config = getHeaders();
  config.params = {
    PageNumber: pageNumber,
    PageSize: PageSize,
    projectId: projectId,
  };
  config["Content-Type"] = "application/json";

  return await axios.get(`${API_URL}Planets/GetArchivePlanetsofUser`, config);
};

//Get Archive Stars data of user
export const getArchiveProjectsOfUser = async (
  pageNumber,
  pageSize,
  userId
) => {
  const config = getHeaders();
  config.params = {
    PageNumber: pageNumber,
    PageSize: pageSize,
    userId: userId,
  };
  config["Content-Type"] = "application/json";
  return await axios.get(`${API_URL}Projects/GetArchiveProjectsofUser`, config);
};

export const pushNotify = async ( subscribeReq) => {
  console.log("loggdinUserData:::",subscribeReq)
  return await axios.put(
    `${API_URL}Notifications/UpdateBrowserId`,
    subscribeReq,
    getHeaders()
  );
};
