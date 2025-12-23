// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "https://planora-backend-rf22.onrender.com/api";

// const getAuthHeaders = () => {
//   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   return {
//     headers: {
//       Authorization: `Bearer ${userInfo?.token}`,
//     },
//   };
// };

// // Async thunks
// export const fetchProjects = createAsyncThunk(
//   "projects/fetchProjects",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/projects`, getAuthHeaders());
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch projects"
//       );
//     }
//   }
// );

// export const createProject = createAsyncThunk(
//   "projects/createProject",
//   async (projectData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/projects`,
//         projectData,
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to create project"
//       );
//     }
//   }
// );

// export const updateProject = createAsyncThunk(
//   "projects/updateProject",
//   async ({ projectId, projectData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/projects/${projectId}`,
//         projectData,
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update project"
//       );
//     }
//   }
// );

// export const deleteProject = createAsyncThunk(
//   "projects/deleteProject",
//   async (projectId, { rejectWithValue }) => {
//     try {
//       await axios.delete(`${API_URL}/projects/${projectId}`, getAuthHeaders());
//       return projectId;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to delete project"
//       );
//     }
//   }
// );

// export const fetchProjectAnalytics = createAsyncThunk(
//   "projects/fetchProjectAnalytics",
//   async (projectId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/projects/${projectId}/analytics`,
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch analytics"
//       );
//     }
//   }
// );

// export const fetchUsers = createAsyncThunk(
//   "projects/fetchUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch users"
//       );
//     }
//   }
// );

// export const getProjectById = createAsyncThunk(
//   "projects/getProjectById",
//   async (projectId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/projects/${projectId}`,
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch project"
//       );
//     }
//   }
// );

// const projectSlice = createSlice({
//   name: "projects",
//   initialState: {
//     projects: [],
//     users: [],
//     currentProject: null,
//     analytics: null,
//     loading: false,
//     error: null,
//     success: false,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccess: (state) => {
//       state.success = false;
//     },
//     setCurrentProject: (state, action) => {
//       state.currentProject = action.payload;
//     },
//     resetProjectState: (state) => {
//       state.projects = [];
//       state.users = [];
//       state.currentProject = null;
//       state.analytics = null;
//       state.loading = false;
//       state.error = null;
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Projects
//       .addCase(fetchProjects.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(fetchProjects.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = action.payload;
//         state.success = true;
//       })
//       .addCase(fetchProjects.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.success = false;
//       })

//       // Create Project
//       .addCase(createProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(createProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects.push(action.payload);
//         state.success = true;
//       })
//       .addCase(createProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.success = false;
//       })

//       // Update Project
//       .addCase(updateProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(updateProject.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.projects.findIndex(
//           (project) => project._id === action.payload._id
//         );
//         if (index !== -1) {
//           state.projects[index] = action.payload;
//         }
//         // Also update currentProject if it's the one being updated
//         if (
//           state.currentProject &&
//           state.currentProject._id === action.payload._id
//         ) {
//           state.currentProject = action.payload;
//         }
//         state.success = true;
//       })
//       .addCase(updateProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.success = false;
//       })

//       // Delete Project
//       .addCase(deleteProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(deleteProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = state.projects.filter(
//           (project) => project._id !== action.payload
//         );
//         // Clear currentProject if it was deleted
//         if (
//           state.currentProject &&
//           state.currentProject._id === action.payload
//         ) {
//           state.currentProject = null;
//         }
//         state.success = true;
//       })
//       .addCase(deleteProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.success = false;
//       })

//       // Fetch Project Analytics
//       .addCase(fetchProjectAnalytics.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProjectAnalytics.fulfilled, (state, action) => {
//         state.loading = false;
//         state.analytics = action.payload;
//       })
//       .addCase(fetchProjectAnalytics.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Fetch Users
//       .addCase(fetchUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.users = action.payload;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Get Project By ID
//       .addCase(getProjectById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getProjectById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentProject = action.payload;
//       })
//       .addCase(getProjectById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const {
//   clearError,
//   clearSuccess,
//   setCurrentProject,
//   resetProjectState,
// } = projectSlice.actions;

// export default projectSlice.reducer;
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

// Async thunks
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/projects`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/projects`,
        projectData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/projects/${projectId}`,
        projectData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`, getAuthHeaders());
      return projectId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  }
);

export const fetchProjectAnalytics = createAsyncThunk(
  "projects/fetchProjectAnalytics",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/projects/${projectId}/analytics`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics"
      );
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "projects/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    users: [],
    currentProject: null,
    analytics: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearProjects: (state) => {
      state.projects = [];
      state.users = [];
      state.analytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
      })
      // Fetch analytics
      .addCase(fetchProjectAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      })
      // Fetch users
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const { clearError, setCurrentProject, clearProjects } =
  projectSlice.actions;
export default projectSlice.reducer;
