// make it premium + professional with a modern glassmorphism + gradient hybrid look (clean, futuristic, ₹10L client presentation level). Keep your logic and structure unchanged.
//
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProjects, deleteProject } from "../redux/slices/projectSlice";
import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects } = useSelector((state) => state.projects);
  const { userInfo } = useSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteProject(projectId)).unwrap();
        dispatch(fetchProjects());
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "from-green-500 to-emerald-600";
      case "completed":
        return "from-blue-500 to-cyan-600";
      case "on-hold":
        return "from-yellow-500 to-amber-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return "🟢";
      case "completed":
        return "✅";
      case "on-hold":
        return "🟡";
      default:
        return "⚪";
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesTab = activeTab === "all" || project.status === activeTab;
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    onHold: projects.filter((p) => p.status === "on-hold").length,
  };

  const getProgressPercentage = (project) => {
    // This would ideally come from your backend analytics
    return Math.floor(Math.random() * 100); // Mock data for demo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Project Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Welcome back,{" "}
              <span className="font-semibold text-slate-800">
                {userInfo?.name}
              </span>
              ! Here's your project overview.
            </p>
          </div>

          {(userInfo?.role === "admin" || userInfo?.role === "manager") && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
            >
              <span className="flex items-center space-x-2">
                <span className="text-xl">+</span>
                <span>Create Project</span>
              </span>
              <div className="absolute inset-0 rounded-2xl bg-white/20 blur-md group-hover:blur-lg transition-all duration-300"></div>
            </button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.completed}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">On Hold</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {stats.onHold}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-2xl">🟡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          {/* Header with Search and Filters */}
          <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                All Projects
              </h3>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white/80 border border-slate-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 backdrop-blur-sm transition-all duration-300 w-full sm:w-64"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">🔍</span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-slate-100/80 p-1 rounded-xl backdrop-blur-sm">
                  {["all", "active", "completed", "on-hold"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-white text-slate-800 shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="p-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <span className="text-4xl">📁</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  {searchTerm ? "No projects found" : "No projects yet"}
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {searchTerm
                    ? `No projects match "${searchTerm}". Try different keywords.`
                    : "Get started by creating your first project to organize your team's work."}
                </p>
                {!searchTerm &&
                  (userInfo?.role === "admin" ||
                    userInfo?.role === "manager") && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                    >
                      Create Your First Project
                    </button>
                  )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project._id}
                    className="group bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-blue-200/50 transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm"
                    onClick={() => navigate(`/project/${project._id}`)}
                  >
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4 ">
                      <div className="flex-1">
                        <div className="flex items-center space-x- mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                            <span className="text-xl">📋</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                              {project.name}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(
                                  project.status
                                )} text-white`}
                              >
                                {getStatusIcon(project.status)}{" "}
                                {project.status.charAt(0).toUpperCase() +
                                  project.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      {(userInfo?.role === "admin" ||
                        userInfo?.role === "manager") && (
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProject(project);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Project"
                          >
                            ✏️
                          </button>
                          {userInfo?.role === "admin" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(project._id);
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Project"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                        <span>Progress</span>
                        <span>{getProgressPercentage(project)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${getProgressPercentage(project)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Project Meta */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="flex items-center space-x-1 text-slate-600 min-w-0">
                            <span>👨‍💼</span>
                            <span className="font-medium truncate max-w-[100px]">
                              {project.manager?.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-slate-600">
                            <span>👥</span>
                            <span>{project.teamMembers?.length || 0}</span>
                          </div>
                        </div>
                        <div className="text-slate-500 text-xs whitespace-nowrap flex-shrink-0 ml-2">
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditProjectModal
        project={selectedProject}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default Dashboard;
