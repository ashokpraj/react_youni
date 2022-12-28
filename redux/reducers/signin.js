import * as type from "../types/type";

const initialState = {
  signin: [],
  signin_google: [],
  signin_facebook: [],
  loading: false,
  error: "",
};

const signin = (state = initialState, action) => {
  switch (action.type) {
    case type.SIGNIN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case type.SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        signin: action.payload,
      };
    case type.SIGNIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case type.SIGNIN_GOOGLE:
      return {
        ...state.erro,
        loading: false,
        signin_google: action.payload,
      };

    case type.SIGNIN_FACEBOOK:
      return {
        ...state.erro,
        loading: false,
        signin_facebook: action.payload,
      };
    default:
      return state;
  }
};

export default signin;
