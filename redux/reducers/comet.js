import * as type from "../types/type";

const initialState = {
  star: [],
  loading: false,
  error: "",
  successMessage: "",
  signleComet: [],
  cometTeams: [],
  cometAttachments: [],
  editSuccess: "",
  cometsData: [],
  totalCometsCount: "",
  firstComet: "",
  selectedComet: null,
  ucomeingComets: [],
  upcomeingSuccessMessage: "",
  ucomeingCometsUser: [],
  signleNewComet: [],
  archiveCometData: [],
  successArchiveMessage: "",
  archiveCometsOfUser: [],
  cometDataOfUsers: [],
  expiredCometData: [],
  expiredCometDataAll: [],
};

const comet = (state = initialState, action) => {
  switch (action.type) {
    case type.GET_COMET_OF_USERS_ALL:
      return {
        ...state,
        cometDataOfUsers: action.payload,
      };

    case type.SELECTED_COMET_SUCCESS:
      return {
        ...state,
        selectedComet: action?.payload,
      };

    case type.ADD_COMET_DATA:
      return {
        ...state,
        star: action.payload,
        loading: false,
        totalCometsCount: state.totalCometsCount + 1,
      };

    case type.TOTAL_COMETS_COUNT:
      return {
        ...state,
        loading: false,
        totalCometsCount: action.payload,
      };

    case type.FIRST_COMET_ID:
      return {
        ...state,
        loading: false,
        firstComet: action.payload,
      };

    case type.GET_ALL_COMETS_BY_USERID:
      return {
        ...state,
        loading: false,
        cometsData: action.payload,
      };

    case type.ADD_COMET_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };
    case type.GET_SINGLE_COMET_BY_ID:
      return {
        ...state,
        loading: false,
        signleComet: action.payload,
      };

    case type.CLEAR_COMET_STATE:
      return {
        ...state,
        signleComet: [],
        cometTeams: [],
        cometAttachments: [],
        star: [],
      };

    case type.GET_SINGLE_COMET_TEAMS_BY_ID:
      return {
        ...state,
        loading: false,
        cometTeams: action.payload,
      };

    case type.GET_SINGLE_COMET_FILES_BY_ID:
      return {
        ...state,
        loading: false,
        cometAttachments: action.payload,
      };

    case type.EDIT_COMET_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        editSuccess: action.payload,
      };
    case type.DELETE_STAR:
      return {
        ...state,
        loading: false,
        cometsData: state.cometsData.filter(
          (item) => item.cometId !== action.payload
        ),
        totalCometsCount: state.totalCometsCount - 1,
      };

    case type.GET_UPCOMING_COMET:
      return {
        ...state,
        loading: false,
        ucomeingComets: action.payload,
      };
    case type.UPCOMING_COMET_OF_USERS:
      return {
        ...state,
        loading: false,
        ucomeingCometsUser: action.payload,
      };
    case type.SINGLE_UPCOMEING_STARS_DATA:
      return {
        ...state,
        loading: false,
        signleNewComet: action.payload,
      };

    case type.DELETE_UPCOMEING_STARS:
      return {
        ...state,
        loading: false,
        ucomeingComets: state.ucomeingComets.filter(
          (item) => item.cometId !== action.payload
        ),
      };

    case type.GET_ARCHIVE_COMETS:
      return {
        ...state,
        loading: false,
        archiveCometData: action.payload,
      };

    case type.GET_ARCHIVE_COMETS_OF_SUERS:
      return {
        ...state,
        loading: false,
        archiveCometsOfUser: action.payload,
      };

    case type.ADD_COMET_FAIL:
      return {
        loading: false,
      };

    case type.ADD_COMET_REQUEST:
      return {
        loading: true,
      };

    case type.GET_EXPIRED_COMET_DATA:
      return {
        ...state,
        expiredCometData: action.payload,
      };
    case type.GET_EXPIRED_COMET_DATA_ALL:
      return {
        ...state,
        expiredCometDataAll: action.payload,
      };
    default:
      return state;
  }
};

export default comet;
