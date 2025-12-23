import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, getProfile } from "../redux/slices/authSlice";
import { useTheme } from "../context/ThemeContext";

const UserProfile = ({ onClose }) => {
  const dispatch = useDispatch();
  const { userInfo, profileLoading } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    avatar: userInfo?.avatar || "",
    theme: userInfo?.theme || "light",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update profile
      await dispatch(updateProfile(formData)).unwrap();

      // Refresh user info to get the latest data including avatar
      await dispatch(getProfile()).unwrap();

      setIsEditing(false);

      // Only reload if theme changed
      if (formData.theme !== userInfo?.theme) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-25"
        onClick={onClose}
      />

      <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {/* Avatar Display */}
                {userInfo?.avatar ? (
                  <img
                    src={userInfo.avatar}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      // If image fails to load, hide it and rely on CSS fallback
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
                    {userInfo?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {userInfo?.name}
                  </h4>
                  <p className="text-sm text-gray-600">{userInfo?.email}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userInfo?.role}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Theme:</span>
                  <span className="capitalize">
                    {isDark ? "Dark" : "Light"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Member since:</span>
                  <span>
                    {userInfo?.createdAt
                      ? new Date(userInfo.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com/avatar.jpg"
                />
                {formData.avatar && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img
                      src={formData.avatar}
                      alt="Avatar preview"
                      className="w-12 h-12 rounded-full object-cover border"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  disabled={profileLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
