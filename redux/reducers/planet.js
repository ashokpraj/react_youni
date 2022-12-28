import * as type from "../types/type";

const initialState = {
  planet: [],
  projectPlanets: [],
  starData: [],
  loading: false,
  error: "",
  successMessage: "",
  signlePlanet: [],
  planetTeams: [],
  planetAttachments: [],
  editSuccess: "",
  firstPlanet: "",
  userPlanetCount: "",
  selectedPlanet: null,
  projectName: "",
  archivePlanetsData: [],
  archivePlanetsOfUser: [],
  planetsAllData: [],
  expiredPlanetData: [],
  expiredPlanetDataAll: [],
};

const planet = (state = initialState, action) => {
  switch (action.type) {
    case type.ADD_PLANET_REQUEST:
      return {
        loading: true,
      };

    case type.ADD_PLANET_FAIL:
      return {
        loading: false,
      };

    case type.SELECTED_PLANET_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedPlanet: action?.payload,
      };
    case type.ADD_PLANET_DATA:
      return {
        ...state,
        planet: action.payload,
        loading: false,
      };

    case type.GET_ALL_PLANETS_BY_PROJECT_ID:
      return {
        ...state,
        projectPlanets: action.payload,
        loading: false,
      };

    case type.FIRST_PLANET_ID:
      return {
        ...state,
        loading: false,
        firstPlanet: action.payload,
      };

    case type.GET_PROJECT_BY_ID:
      return {
        ...state,
        starData: action.payload,
        loading: false,
      };

    case type.ADD_PLANET_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };
    case type.GET_SINGLE_PLANET_BY_ID:
      return {
        ...state,
        loading: false,
        signlePlanet: action.payload,
      };

    case type.CLEAR_PLANET_STATE:
      return {
        ...state,
        loading: false,
        signlePlanet: [],
      };

    case type.GET_SINGLE_PLANET_TEAMS_BY_ID:
      return {
        ...state,
        loading: false,
        planetTeams: action.payload,
      };

    case type.GET_SINGLE_PLANET_FILES_BY_ID:
      return {
        ...state,
        loading: false,
        planetAttachments: action.payload,
      };
    case type.EDIT_PLANET_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        editSuccess: action.payload,
      };

    case type.DELETE_PLANET:
      return {
        ...state,
        loading: false,
        projectPlanets: state.projectPlanets.filter(
          (item) => item.planetId !== action.payload
        ),
      };
    case type.PLANET_COUNT_DATA:
      return {
        ...state,
        loading: false,
        userPlanetCount: action.payload,
      };
    case type.STAR_NAME_FOR_SATELLITE:
      return {
        ...state,
        projectName: action.payload,
      };

    case type.GET_ARCHIVE_PLANETS:
      return {
        ...state,
        loading: false,
        archivePlanetsData: action.payload,
      };

    case type.GET_ARCHIVE_PLANETS_OF_SUERS:
      return {
        ...state,
        loading: false,
        archivePlanetsOfUser: action.payload,
      };

    case type.PLANTES_ALL_DATA:
      return {
        ...state,
        loading: false,
        planetsAllData: action.payload,
      };

    case type.GET_EXPIRED_PLANET_DATA:
      return {
        ...state,
        expiredPlanetData: action.payload,
      };

    case type.GET_EXPIRED_PLANET_DATA_ALL:
      return {
        ...state,
        expiredPlanetDataAll: action.payload,
      };
    default:
      return state;
  }
};

export default planet;
