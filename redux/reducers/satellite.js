import * as type from "../types/type";

const initialState = {
  satellite: [],
  moonSatellite: [],
  moonName: "",
  loading: false,
  error: "",
  successMessage: "",
  signleSatellite: [],
  satelliteTeams: [],
  satelliteAttachments: [],
  editSuccess: "",
  moonsData: [],
  useSatelliteCount: [],
  selectedSatellite: null,
  archiveSatellitesData: [],
  archiveSatellitesOfUser: [],
  staellitesOfPalnets: [],
  satellites: [],
  expiredSatelliteData: [],
  expiredSatelliteDataAll: [],
};

const satellite = (state = initialState, action) => {
  switch (action.type) {
    case type.SELECTED_SATELLITE_SUCCESS:
      return {
        ...state.editSuccess,
        selectedSatellite: action.payload,
      };
    case type.CLEAR_SATELLITE_CHAT_STATE:
      return {
        ...state.editSuccess,
        selectedSatellite: [],
      };

    case type.ADD_SATELLITE_DATA:
      return {
        ...state,
        satellite: action.payload,
        loading: false,
      };

    case type.CLEAR_SATELLITE_STATE:
      return {
        ...state,
        signleSatellite: [],
        satelliteTeams: [],
        satelliteAttachments: [],
        satellite: [],
      };

    case type.ADD_STAR_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };

    case type.GET_ALL_SATELLITE_BY_MOON_ID:
      return {
        ...state,
        moonSatellite: action.payload,
        loading: false,
      };

    case type.GET_SATELLITE_BY_ID:
      return {
        ...state,
        moonName: action.payload,
        loading: false,
      };
    case type.GET_SINGLE_SATELLITE_BY_ID:
      return {
        ...state,
        loading: false,
        signleSatellite: action.payload,
      };

    case type.GET_SINGLE_SATELLITE_TEAMS_BY_ID:
      return {
        ...state,
        loading: false,
        satelliteTeams: action.payload,
      };

    case type.GET_SINGLE_SATELLITE_FILES_BY_ID:
      return {
        ...state,
        loading: false,
        satelliteAttachments: action.payload,
      };
    case type.ADD_SATELLITE_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };
    case type.EDIT_SATELLITE_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        editSuccess: action.payload,
        satelliteAttachments: [],
        signleSatellite: [],
      };
    case type.GET_MOON_DETAILS_BY_ID:
      return {
        ...state,
        loading: false,
        moonsData: action.payload,
      };

    case type.DELETE_SATELLITE:
      return {
        ...state,
        loading: false,
        projectPmoonSatellitelanets: state.moonSatellite.filter(
          (item) => item.satelliteId !== action.payload
        ),
      };
    case type.SATELLITE_COUNT_DATA:
      return {
        ...state,
        loading: false,
        useSatelliteCount: action.payload,
      };

    case type.GET_ARCHIVE_SATELLITE:
      return {
        ...state,
        loading: false,
        archiveSatellitesData: action.payload,
      };

    case type.GET_ARCHIVE_SATELLITE_OF_SUERS:
      return {
        ...state,
        loading: false,
        archiveSatellitesOfUser: action.payload,
      };

    case type.GET_SATELLITE_OF_MOON_OF_USERS:
      return {
        ...state,
        loading: false,
        staellitesOfPalnets: action.payload,
      };

    case type.ADD_SATELLITE_REQUEST:
      return {
        loading: true,
      };

    case type.ADD_SATELLITE_FAIL:
      return {
        loading: false,
      };

    case type.ADD_SATELLITE_SUCCESS_ALL_DATA:
      return {
        ...state,
        loading: false,
        satellites: action.payload,
      };

    case type.GET_EXPIRED_SATELLITE_DATA:
      return {
        ...state,
        expiredSatelliteData: action.payload,
      };

    case type.GET_EXPIRED_SATELLITE_DATA_ALL:
      return {
        ...state,
        expiredSatelliteDataAll: action.payload,
      };

    default:
      return state;
  }
};

export default satellite;
