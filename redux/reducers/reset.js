import * as type from "../types/type";

const initialState = {
  reset: [],
  loading: true,
};

const reset = (state = initialState, action) => {
  switch (action.type) {
    case type.RESET_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case type.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        reset: action.payload,
      };
    case type.RESET_PASSWORD_FAILUE:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default reset;
