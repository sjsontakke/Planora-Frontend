import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Use the correct backend URL
const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  };
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log("Attempting login to:", `${API_URL}/auth/login`);

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Attempting registration to:", `${API_URL}/auth/register`);
      console.log("User data:", userData);

      const response = await axios.post(`${API_URL}/auth/register`, userData);

      console.log("Registration response:", response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      console.log("Updating profile with data:", profileData);

      const response = await axios.put(
        `${API_URL}/users/profile`,
        profileData,
        getAuthHeaders()
      );

      console.log("Profile update response:", response.data);

      // Update localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const updatedUserInfo = { ...userInfo, ...response.data };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      return response.data;
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/users/profile`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo,
    loading: false,
    error: null,
    profileLoading: false,
    profileError: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    clearError: (state) => {
      state.error = null;
      state.profileError = null;
    },
    updateUserTheme: (state, action) => {
      if (state.userInfo) {
        state.userInfo.theme = action.payload;
        // Update localStorage
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const updatedUserInfo = { ...userInfo, theme: action.payload };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      }
    },
    updateUserAvatar: (state, action) => {
      if (state.userInfo) {
        state.userInfo.avatar = action.payload;
        // Update localStorage
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const updatedUserInfo = { ...userInfo, avatar: action.payload };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userInfo = action.payload;
        state.profileError = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.userInfo = action.payload;
        state.profileError = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });
  },
});

export const { logout, clearError, updateUserTheme, updateUserAvatar } =
  authSlice.actions;
export default authSlice.reducer;
