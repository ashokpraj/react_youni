import * as type from "../types/type";

const initialState = {
  userData: [],
  projectsData: [],
  signleStar: [],
  starTeams: [],
  starAttachments: [],
  loading: true,
  totalStarCount: "",
  firstStar: "",
  userStarCount: "",
  userCometCount: "",
  storeStarId: "",
  contactSuccessMessage: "",
  accesUserData: [],
  userNotification: [],
  markAsRead: "",
  expiredProjectData: [],
  expiredProjectDataAll: [],
  notifyCount: "",
};

const dashboard = (state = initialState, action) => {
  switch (action.type) {
    case type.STORE_NOTIFI_COUNT:
      return {
        ...state,
        notifyCount: action.payload,
      };

    case type.DASHBOARD_DATA:
      return {
        ...state,
        loading: false,
        userData: action.payload,
      };

    case type.CHECK_STAR_COUNT:
      return {
        ...state,
        loading: false,
        userStarCount: action.payload,
      };

    case type.CHECK_COMET_COUNT:
      return {
        ...state,
        loading: false,
        userCometCount: action.payload,
      };

    case type.GET_ALL_PROJECTS_BY_USERID:
      return {
        ...state,
        loading: false,
        projectsData: action.payload,
      };

    case type.TOTAL_STAR_COUNT:
      return {
        ...state,
        loading: false,
        totalStarCount: action.payload,
      };

    case type.STORE_STAR_ID:
      return {
        ...state,
        loading: false,
        storeStarId: action.payload,
      };
    case type.FIRST_STAR_ID:
      return {
        ...state,
        loading: false,
        firstStar: action.payload,
      };
    case type.GET_SINGLE_PROJECT_BY_ID:
      return {
        ...state,
        loading: false,
        signleStar: action.payload,
      };
    case type.GET_SINGLE_PROJECT_TEAMS_BY_ID:
      return {
        ...state,
        loading: false,
        starTeams: action.payload,
      };
    case type.CLEAR_STAR_STATE:
      return {
        ...state,
        signleStar: [],
      };
    case type.GET_SINGLE_PROJECT_FILES_BY_ID:
      return {
        ...state,
        loading: false,
        starAttachments: action.payload,
      };
    case type.DELETE_STAR:
      return {
        ...state,
        loading: false,
        projectsData: state.projectsData.filter(
          (item) => item.projectId !== action.payload
        ),
      };

    case type.ADD_CONTACT_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        contactSuccessMessage: action.payload,
      };

    case type.GET_ACCESS_TOKEN_USER_DATA:
      return {
        ...state,
        accesUserData: action.payload,
      };

    case type.GET_USER_NOTIFICATION:
      return {
        ...state,
        userNotification: [...state?.userNotification, ...action.payload],
      };

    case type.MARK_AD_READ_NOTIFICATION:
      return {
        ...state,
        markAsRead: action.payload,
      };

    case type.GET_EXPIRED_PROJECT_DATA:
      return {
        ...state,
        expiredProjectData: action.payload,
      };
    case type.GET_EXPIRED_PROJECT_DATA_ALL:
      return {
        ...state,
        expiredProjectDataAll: action.payload,
      };
    default:
      return state;
  }
};

export default dashboard;
