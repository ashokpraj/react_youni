import * as type from "../types/type";

const userprofile = {
  profileData: [],
  loading: true,
  error: "",
};

const star = (state = initialState, action) => {
  switch (action.type) {
    case type.EDIT_PROFILE:
      return {
        ...state,
        loading: false,
        profileData: action.payload,
      };

    default:
      return state;
  }
};

export default userprofile;
