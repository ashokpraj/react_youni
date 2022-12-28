import { combineReducers } from "redux";
import popup from "./popup";
import signin from "./signin";
import signupReducers from "./signup";
import forgotreducer from "./forgot";
import resetReducer from "./reset";
import dashboard from "./dashboard";
import user from "./users";
import addstar from "./star";
import planet from "./planet";
import moon from "./moon";
import satellite from "./satellite";
import comet from "./comet";
import policy from "./policy";

const rootReducers = combineReducers({
  data: popup,
  signup: signupReducers,
  signin: signin,
  forgot: forgotreducer,
  reset: resetReducer,
  dashboard: dashboard,
  user: user,
  star: addstar,
  comet: comet,
  planet: planet,
  moon: moon,
  satellite: satellite,
  policy: policy,
});

export default rootReducers;
