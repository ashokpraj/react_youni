import * as type from "../types/type";

const initialState = {
  allUsers: [],
  item: [],
  loading: true,
  error: "",
  selectedMember: [],
  listMember: [],
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case type.GET_USERS_DATA:
      return {
        ...state,
        allUsers: action.payload,
        loading: false,
      };
    case type.SEARCH_DATA:
      return {
        ...state,
        item: action.payload,
        loading: false,
      };

    case type.SELECTED_MEMBER:
      const publicCommentLike = (state?.selectedMember || [])?.map(
        (members) => {
          return Number(members.userId);
        }
      );

      return {
        ...state,
        selectedMember: action.payload,
        listMember: publicCommentLike,
        loading: false,
      };
    default:
      return state;
  }
};

export default users;
