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
// export const fetchProjectTasks = createAsyncThunk(
//   "tasks/fetchProjectTasks",
//   async (projectId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/tasks/project/${projectId}`,
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch tasks"
//       );
//     }
//   }
// );

// export const fetchUserTasks = createAsyncThunk(
//   "tasks/fetchUserTasks",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/tasks/my-tasks`,
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch your tasks"
//       );
//     }
//   }
// );

// export const createTask = createAsyncThunk(
//   "tasks/createTask",
//   async (taskData, { rejectWithValue }) => {
//     try {
//       console.log("Creating task with data:", taskData);
//       const response = await axios.post(
//         `${API_URL}/tasks`,
//         taskData,
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Create task error:",
//         error.response?.data || error.message
//       );
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to create task"
//       );
//     }
//   }
// );

// export const updateTask = createAsyncThunk(
//   "tasks/updateTask",
//   async ({ taskId, taskData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/tasks/${taskId}`,
//         taskData,
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update task"
//       );
//     }
//   }
// );

// // ADD THIS - Employee status update function
// export const updateTaskStatus = createAsyncThunk(
//   "tasks/updateTaskStatus",
//   async ({ taskId, status }, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(
//         `${API_URL}/tasks/${taskId}/status`,
//         { status },
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update task status"
//       );
//     }
//   }
// );

// export const addComment = createAsyncThunk(
//   "tasks/addComment",
//   async ({ taskId, text }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/tasks/${taskId}/comment`,
//         { text },
//         getAuthHeaders()
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to add comment"
//       );
//     }
//   }
// );

// const taskSlice = createSlice({
//   name: "tasks",
//   initialState: {
//     tasks: [],
//     userTasks: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch project tasks
//       .addCase(fetchProjectTasks.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProjectTasks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tasks = action.payload;
//       })
//       .addCase(fetchProjectTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Fetch user tasks
//       .addCase(fetchUserTasks.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserTasks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userTasks = action.payload;
//       })
//       .addCase(fetchUserTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Create task
//       .addCase(createTask.fulfilled, (state, action) => {
//         state.tasks.push(action.payload);
//       })
//       // Update task status
//       .addCase(updateTaskStatus.fulfilled, (state, action) => {
//         // Update task in userTasks array
//         const index = state.userTasks.findIndex(
//           (task) => task._id === action.payload.task._id
//         );
//         if (index !== -1) {
//           state.userTasks[index].status = action.payload.task.status;
//         }
//       });
//   },
// });

// export const { clearError } = taskSlice.actions;
// export default taskSlice.reducer;
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

// 🔥 FIXED: Get user role and choose correct endpoint
const getUserRole = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  return userInfo?.role || "employee";
};

// 🔥 UPDATED: Fetch tasks based on user role
export const fetchUserTasks = createAsyncThunk(
  "tasks/fetchUserTasks",
  async (_, { rejectWithValue }) => {
    try {
      const userRole = getUserRole();
      let endpoint;

      // Choose endpoint based on role
      if (userRole === "employee") {
        endpoint = "/tasks/employee/my-tasks"; // ✅ Employee endpoint
        console.log("Employee: Fetching from", endpoint);
      } else {
        endpoint = "/tasks/my-tasks"; // ✅ Manager/Admin endpoint
        console.log("Manager/Admin: Fetching from", endpoint);
      }

      const response = await axios.get(
        `${API_URL}${endpoint}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Fetch tasks error:",
        error.response?.data || error.message
      );

      // 🔥 FALLBACK: If employee endpoint fails, try regular endpoint
      if (getUserRole() === "employee") {
        try {
          console.log("Trying fallback endpoint: /tasks/my-tasks");
          const fallbackResponse = await axios.get(
            `${API_URL}/tasks/my-tasks`,
            getAuthHeaders()
          );
          return fallbackResponse.data;
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your tasks"
      );
    }
  }
);

// 🔥 ADD THIS: Separate endpoint for employees (for TaskPage)
export const fetchEmployeeTasks = createAsyncThunk(
  "tasks/fetchEmployeeTasks",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching employee-specific tasks...");
      const response = await axios.get(
        `${API_URL}/tasks/employee/my-tasks`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Employee tasks error:",
        error.response?.data || error.message
      );

      // Fallback to regular tasks endpoint
      try {
        console.log("Trying fallback to /tasks/my-tasks");
        const fallbackResponse = await axios.get(
          `${API_URL}/tasks/my-tasks`,
          getAuthHeaders()
        );
        return fallbackResponse.data;
      } catch (fallbackError) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch employee tasks"
        );
      }
    }
  }
);

export const fetchProjectTasks = createAsyncThunk(
  "tasks/fetchProjectTasks",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/tasks/project/${projectId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      console.log("Creating task with data:", taskData);
      const response = await axios.post(
        `${API_URL}/tasks`,
        taskData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Create task error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        taskData,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

// 🔥 ADD DEBUGGING to updateTaskStatus
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      console.log(`Updating task ${taskId} status to: ${status}`);

      const response = await axios.patch(
        `${API_URL}/tasks/${taskId}/status`,
        { status },
        getAuthHeaders()
      );

      console.log("Update status response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Update status error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "tasks/addComment",
  async ({ taskId, text }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/tasks/${taskId}/comment`,
        { text },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add comment"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    userTasks: [],
    employeeTasks: [], // 🔥 ADD THIS for employee-specific tasks
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // 🔥 ADD THIS: Clear employee tasks on logout
    clearEmployeeTasks: (state) => {
      state.employeeTasks = [];
      state.userTasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch project tasks
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user tasks (updated)
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.userTasks = action.payload;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔥 NEW: Fetch employee tasks
      .addCase(fetchEmployeeTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeTasks = action.payload;
      })
      .addCase(fetchEmployeeTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.userTasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.userTasks[index] = action.payload;
        }
      })
      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        // Update in userTasks
        const userIndex = state.userTasks.findIndex(
          (task) => task._id === action.payload.task?._id
        );
        if (userIndex !== -1 && action.payload.task) {
          state.userTasks[userIndex].status = action.payload.task.status;
        }

        // Update in employeeTasks
        const empIndex = state.employeeTasks.findIndex(
          (task) => task._id === action.payload.task?._id
        );
        if (empIndex !== -1 && action.payload.task) {
          state.employeeTasks[empIndex].status = action.payload.task.status;
        }
      });
  },
});

export const { clearError, clearEmployeeTasks } = taskSlice.actions;
export default taskSlice.reducer;
