import * as type from "../types/type";

export const chnagePopupStateValue = (starModal) => {
  return {
    type: type.CHANGE_SIGNIN_POPUP_VALUE,
    payload: starModal,
  };
};

export const chnageCometPopupStateValue = (cometModal) => {
  return {
    type: type.CHANGE_COMET_POPUP_VALUE,
    payload: cometModal,
  };
};

export const chnagePanetPopupStateValue = (planetModal) => {
  return {
    type: type.CHANGE_PLANET_POPUP_VALUE,
    payload: planetModal,
  };
};

export const chnageMoonPopupStateValue = (moonModal) => {
  return {
    type: type.CHANGE_MOON_POPUP_VALUE,
    payload: moonModal,
  };
};

export const chnageSatelliteopupStateValue = (satelliteModal) => {
  return {
    type: type.CHANGE_SATELLITE_POPUP_VALUE,
    payload: satelliteModal,
  };
};
