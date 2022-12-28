import * as type from "../types/type";

const initialState = {
  forgot: [],
  loading: false,
};

const forgot = (state = initialState, action) => {
  switch (action.type) {
    case type.FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case type.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        forgot: action.payload,
      };
    case type.FORGOT_PASSWORD_FAILUE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default forgot;
