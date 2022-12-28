import * as type from "../types/type";

const initialState = {
  moon: [],
  planetMoons: [],
  planetName: "",
  loading: false,
  error: "",
  successMessage: "",
  signleMoon: null,
  moonTeams: [],
  moonAttachments: [],
  editSuccess: "",
  firstMoon: "",
  userMoonCount: "",
  selectedMoon: null,
  archiveMoonsData: [],
  archiveMoonsOfUser: [],
  moonDataByPlanets: [],
  expiredMoonData: [],
  expiredMoonDataAll: [],
};

const moon = (state = initialState, action) => {
  switch (action.type) {
    case type.SELECTED_MOON_SUCCESS:
      return {
        ...state,
        selectedMoon: action?.payload,
      };
    case type.ADD_MOON_DATA:
      return {
        ...state,
        moon: action.payload,
        loading: false,
      };

    case type.FIRST_MOON_ID:
      return {
        ...state,
        loading: false,
        firstMoon: action.payload,
      };

    case type.GET_ALL_MOON_BY_PLANET_ID:
      return {
        ...state,
        planetMoons: action.payload,
        loading: false,
      };

    case type.GET_PLANET_BY_ID:
      return {
        ...state,
        planetName: action.payload,
        loading: false,
      };

    case type.ADD_MOON_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };

    case type.GET_SINGLE_MOON_BY_ID:
      return {
        ...state,
        loading: false,
        signleMoon: action.payload,
      };
    case type.CLEAR_MOON_STATE:
      return {
        ...state,
        loading: false,
        signleMoon: null,
      };

    case type.GET_SINGLE_MOON_TEAMS_BY_ID:
      return {
        ...state,
        loading: false,
        moonTeams: action.payload,
      };

    case type.GET_SINGLE_MOON_FILES_BY_ID:
      return {
        ...state,
        loading: false,
        moonAttachments: action.payload,
      };
    case type.EDIT_MOON_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        editSuccess: action.payload,
      };

    case type.DELETE_STAR:
      return {
        ...state,
        loading: false,
        planetMoons: state.planetMoons.filter(
          (item) => item.moonId !== action.payload
        ),
      };
    case type.MOON_COUNT_DATA:
      return {
        ...state,
        loading: false,
        userMoonCount: action.payload,
      };

    case type.GET_ARCHIVE_MOONS:
      return {
        ...state,
        loading: false,
        archiveMoonsData: action.payload,
      };

    case type.GET_ARCHIVE_MOONS_OF_SUERS:
      return {
        ...state,
        loading: false,
        archiveMoonsOfUser: action.payload,
      };

    case type.GET_MOONS_ALL_DATA_BY_PLANT:
      return {
        ...state,
        loading: false,
        moonDataByPlanets: action.payload,
      };

    case type.ADD_MOON_REQUEST:
      return {
        loading: true,
      };

    case type.ADD_MOON_FAIL:
      return {
        loading: false,
      };

    case type.GET_EXPIRED_MOONS_DATA:
      return {
        ...state,
        expiredMoonData: action.payload,
      };

    case type.GET_EXPIRED_MOONS_DATA_ALL:
      return {
        ...state,
        expiredMoonDataAll: action.payload,
      };
    default:
      return state;
  }
};

export default moon;
