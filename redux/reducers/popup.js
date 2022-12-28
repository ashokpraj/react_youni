import * as type from "../types/type";

const initialState = {
  starModal: false,
  cometModal: false,
  planetModal: false,
  moonModal: false,
  satelliteModal: false,
};
const popup = (state = initialState, action) => {
  switch (action.type) {
    case type.CHANGE_SIGNIN_POPUP_VALUE:
      return {
        ...state,
        starModal: action.payload,
      };

    case type.CHANGE_COMET_POPUP_VALUE:
      return {
        ...state,
        cometModal: action.payload,
      };

    case type.CHANGE_PLANET_POPUP_VALUE:
      return {
        ...state,
        planetModal: action.payload,
      };

    case type.CHANGE_MOON_POPUP_VALUE:
      return {
        ...state,
        moonModal: action.payload,
      };

    case type.CHANGE_MOON_POPUP_VALUE:
      return {
        ...state,
        moonModal: action.payload,
      };
    case type.CHANGE_SATELLITE_POPUP_VALUE:
      return {
        ...state,
        satelliteModal: action.payload,
      };

    default:
      return state;
  }
};

export default popup;
