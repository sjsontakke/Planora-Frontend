import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProject, fetchUsers } from "../redux/slices/projectSlice";

const EditProjectModal = ({ project, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.projects);
  const { userInfo } = useSelector((state) => state.auth);

  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "active",
    teamMembers: [],
  });

  useEffect(() => {
    if (isOpen && project) {
      setProjectData({
        name: project.name || "",
        description: project.description || "",
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        status: project.status || "active",
        teamMembers: project.teamMembers?.map((member) => member._id) || [],
      });

      // Fetch users for team member selection
      dispatch(fetchUsers());
    }
  }, [isOpen, project, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateProject({
          projectId: project._id,
          projectData,
        })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update project:", error);
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

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Edit Project</h3>
          <p className="text-gray-600 mt-1">
            Update project details and team members
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={projectData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={projectData.description}
                onChange={handleChange}
                placeholder="Describe the project..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={projectData.startDate}
                  onChange={handleChange}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={projectData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Team Members Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Team Members
              </label>
              <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto bg-gray-50">
                {users
                  .filter((user) => user._id !== userInfo._id)
                  .map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center mb-3 p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`edit-user-${user._id}`}
                        checked={projectData.teamMembers.includes(user._id)}
                        onChange={() => handleTeamMemberChange(user._id)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`edit-user-${user._id}`}
                        className="ml-3 flex-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                            {user.role}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                {users.filter((user) => user._id !== userInfo._id).length ===
                  0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No other users available.
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Selected {projectData.teamMembers.length} team member(s)
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
