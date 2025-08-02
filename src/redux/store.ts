import { combineReducers, configureStore } from "@reduxjs/toolkit";

// import productReducer from "@/lib/redux/slice/productSlice";
import userReducer from "./slice/authSlice";
import postFormReducer from "./slice/blogSlice";
import blogReducer from "./slice/postSlice";


const rootReducer = combineReducers({
  auth: userReducer,
  postForm: postFormReducer,
  blogs: blogReducer


});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false, // ✅ Ensures async thunks work properly
  }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const store = makeStore();
