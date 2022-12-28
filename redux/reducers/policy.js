import * as type from "../types/type";

const initialState = {
  termsService: [],
  privacyPolicy: [],
};
const policy = (state = initialState, action) => {
  switch (action.type) {
    case type.TERMS_AND_SERVICES:
      return {
        ...state,
        termsService: action.payload,
      };

    case type.PRIVACY_POLICY:
      return {
        ...state,
        privacyPolicy: action.payload,
      };

    default:
      return state;
  }
};

export default policy;
