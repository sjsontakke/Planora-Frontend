import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://planora-backend-rf22.onrender.com/api";

const getAuthHeaders = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  };
};

export const searchAll = createAsyncThunk(
  "search/searchAll",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/search?q=${encodeURIComponent(query)}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: {
      tasks: [],
      projects: [],
      users: [],
    },
    loading: false,
    error: null,
    recentSearches: [],
  },
  reducers: {
    clearSearch: (state) => {
      state.results = { tasks: [], projects: [], users: [] };
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addRecentSearch: (state, action) => {
      const search = action.payload;
      state.recentSearches = state.recentSearches.filter((s) => s !== search);
      state.recentSearches.unshift(search);
      state.recentSearches = state.recentSearches.slice(0, 5);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAll.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch, clearError, addRecentSearch } = searchSlice.actions;
export default searchSlice.reducer;
