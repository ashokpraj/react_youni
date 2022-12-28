import * as type from "../types/type";

const initialState = {
  star: [],
  loading: false,
  error: "",
  successMessage: "",
  editSuccess: "",
  selectedStar: null,
  ucomeingStras: [],
  upcomeingSuccessMessage: "",
  ucomeingStrasUser: [],
  singleNewStar: [],
  editMessage: "",
  deleteMessage: "",
  archiveStars: "",
  archiveStarData: [],
  successArchiveMessage: "",
  archiveStarsOfUser: [],
};

const star = (state = initialState, action) => {
  switch (action.type) {
    case type.SELECTED_STAR_SUCCESS:
      return {
        ...state,
        selectedStar: action?.payload,
      };
    case type.ADD_STAR_DATA:
      return {
        ...state,
        star: action.payload,
        loading: false,
      };

    case type.ADD_STAR_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };
    case type.EDIT_STAR_SUCCESS_DATA:
      return {
        ...state,
        loading: false,
        editSuccess: action.payload,
      };
    case type.UPCOMEING_STARS_DATA:
      return {
        ...state,
        loading: false,
        ucomeingStras: action.payload,
      };
    case type.UPCOMEING_STARS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        upcomeingSuccessMessage: action.payload,
      };

    case type.UPCOMEING_STARS_OF_USERS:
      return {
        ...state,
        loading: false,
        ucomeingStrasUser: action.payload,
      };
    case type.SINGLE_UPCOMEING_STARS_DATA:
      return {
        ...state,
        loading: false,
        singleNewStar: action.payload,
      };

    case type.UPCOMEING_EDIT_STARS_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        editMessage: action.payload,
      };

    case type.DELETE_UPCOMEING_STARS:
      return {
        ...state,
        loading: false,
        ucomeingStras: state.ucomeingStras.filter(
          (item) => item.projectId !== action.payload
        ),
      };

    case type.DELETE_UPCOMEING_STARS_SUCCESS:
      return {
        ...state,
        loading: false,
        deleteMessage: action.payload,
      };

    case type.ARCHIVE_STAR_DATA:
      return {
        ...state,
        loading: false,
        archiveStars: action.payload,
      };

    case type.ARCHIVE_STAR_DATA_OF_USER:
      return {
        ...state,
        loading: false,
        archiveStarsOfUser: action.payload,
      };

    case type.ADD_ARCHIVE_STAR_DATA:
      return {
        ...state,
        loading: false,
        archiveStarData: action.payload,
      };

    case type.ADD_ARCHIVE_STAR_SUCCESS:
      return {
        ...state,
        loading: false,
        successArchiveMessage: action.payload,
      };

    case type.ADD_STAR_REQUEST:
      return {
        loading: true,
      };

    case type.ADD_STAR_FAIL:
      return {
        loading: false,
      };
    default:
      return state;
  }
};

export default star;
