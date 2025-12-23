import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import taskSlice from "./slices/taskSlice";
import projectSlice from "./slices/projectSlice";
import notificationSlice from "./slices/notificationSlice";
import searchSlice from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
    projects: projectSlice,
    notifications: notificationSlice,
    search: searchSlice,
  },
});
