import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, fetchUsers } from "../redux/slices/projectSlice";

const CreateProjectModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.projects);

  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    teamMembers: [],
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setProjectData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        teamMembers: [],
      });

      // Fetch users for team member selection
      console.log("Fetching users for project creation...");
      dispatch(fetchUsers());
    }
  }, [isOpen, dispatch]);

  // Debug: Log users data
  useEffect(() => {
    if (isOpen) {
      console.log("Available users:", users);
      console.log("Current user ID:", userInfo?._id);
      console.log("Users loading:", loading);
      console.log("Users error:", error);
    }
  }, [users, loading, error, userInfo, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      console.log("Creating project with data:", projectData);
      await dispatch(createProject(projectData)).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
      alert(`Failed to create project: ${error.message || "Please try again"}`);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleTeamMemberChange = (userId) => {
    const updatedTeamMembers = projectData.teamMembers.includes(userId)
      ? projectData.teamMembers.filter((id) => id !== userId)
      : [...projectData.teamMembers, userId];

    setProjectData({
      ...projectData,
      teamMembers: updatedTeamMembers,
    });
  };

  const handleChange = (e) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  // Calculate minimum date for end date (start date or today)
  const getMinEndDate = () => {
    return projectData.startDate || new Date().toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Create New Project
              </h3>
              <p className="text-gray-600 mt-1">
                Start a new project and assign team members
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={projectData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                disabled={createLoading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                value={projectData.description}
                onChange={handleChange}
                placeholder="Describe the project goals, objectives, and requirements..."
                disabled={createLoading}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={projectData.startDate}
                  onChange={handleChange}
                  disabled={createLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  min={getMinEndDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={projectData.endDate}
                  onChange={handleChange}
                  disabled={createLoading}
                />
              </div>
            </div>

            {/* Team Members Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Team Members
                <span className="text-gray-500 text-sm font-normal ml-1">
                  (Optional)
                </span>
              </label>

              {loading ? (
                <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">
                      Loading team members...
                    </span>
                  </div>
                </div>
              ) : error ? (
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center space-x-2 text-red-700">
                    <span>⚠️</span>
                    <div>
                      <p className="text-sm font-medium">
                        Failed to load users
                      </p>
                      <p className="text-xs text-red-600 mt-1">{error}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch(fetchUsers())}
                    className="mt-3 text-sm text-red-700 hover:text-red-800 underline"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                  {users && users.length > 0 ? (
                    <>
                      {users
                        .filter((user) => user._id !== userInfo?._id)
                        .map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center mb-3 p-2 hover:bg-white rounded-lg transition-colors group"
                          >
                            <input
                              type="checkbox"
                              id={`user-${user._id}`}
                              checked={projectData.teamMembers.includes(
                                user._id
                              )}
                              onChange={() => handleTeamMemberChange(user._id)}
                              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                              disabled={createLoading}
                            />
                            <label
                              htmlFor={`user-${user._id}`}
                              className="ml-3 flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  {user.avatar ? (
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextElementSibling.style.display =
                                          "flex";
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className={`w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                                      user.avatar ? "hidden" : "flex"
                                    }`}
                                  >
                                    {user.name?.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 block group-hover:text-indigo-600 transition-colors">
                                      {user.name}
                                    </span>
                                    <span className="text-xs text-gray-500 block">
                                      {user.email}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    user.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : user.role === "manager"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </div>
                            </label>
                          </div>
                        ))}

                      {users.filter((user) => user._id !== userInfo?._id)
                        .length === 0 && (
                        <div className="text-center py-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-gray-500 text-xl">👥</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-1">
                            No other users available
                          </p>
                          <p className="text-xs text-gray-400">
                            You're the only user in the system
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-gray-500 text-xl">👥</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">
                        No users found in the system
                      </p>
                      <p className="text-xs text-gray-400">
                        Make sure you have other users registered
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  Selected {projectData.teamMembers.length} team member(s)
                </p>
                {projectData.teamMembers.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setProjectData({ ...projectData, teamMembers: [] })
                    }
                    className="text-xs text-red-600 hover:text-red-700 underline"
                    disabled={createLoading}
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={createLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={createLoading}
            >
              {createLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>📋</span>
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
