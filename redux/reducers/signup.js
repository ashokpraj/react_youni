import * as type from "../types/type";

const initialState = {
  users: [],
  signup: [],
  loading: false,
  error: "",
};

const signup = (state = initialState, action) => {
  switch (action.type) {
    case type.SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case type.SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        signup: action.payload,
      };
    case type.SIGNUP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case type.SIGNUP_WITH_FACEBOOK:
      return {
        ...state,
        users: action.payload,
        loading: false,
      };

    case type.SIGNUP_WITH_GOOGLE:
      return {
        ...state,
        users: action.payload,
        loading: true,
      };
    default:
      return state;
  }
};

export default signup;
