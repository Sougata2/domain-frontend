import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import stageReducer from "./stageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    formStage: stageReducer,
  },
});
