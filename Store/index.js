import { configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import userSlice from "./Slices/userSlice";





const persistConfig = {
    key: "AttendanceApp",
    storage:ReactNativeAsyncStorage
}

const persistUserReducer = persistReducer(persistConfig, userSlice)

export const store = configureStore({
    reducer: {
        userSlice : persistUserReducer
    },
  })

  export const persistedStore = persistStore(store);