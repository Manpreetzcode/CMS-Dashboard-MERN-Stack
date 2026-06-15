import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import postReducer from "./features/postSlice";
import categoryReducer from "./features/categorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    Post:postReducer,
    Category: categoryReducer,
  },
});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch = 
  typeof store.dispatch;