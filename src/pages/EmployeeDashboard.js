// frontend/src/pages/EmployeeDashboard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Remove navigate import since we're not using it for now
import { fetchProjects } from "../redux/slices/projectSlice"; // Use fetchProjects instead of fetchUserProjects
import { fetchUserTasks } from "../redux/slices/taskSlice";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  // Remove navigate since not used
  const { userInfo } = useSelector((state) => state.auth);
  const { projects, loading: projectsLoading } = useSelector(
    (state) => state.projects
  ); // Use projects instead of userProjects
  const { userTasks, loading: tasksLoading } = useSelector(
    (state) => state.tasks
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchProjects()); // Use fetchProjects instead of fetchUserProjects
    dispatch(fetchUserTasks());
  }, [dispatch]);

  // Filter projects to show only those where user is a team member or manager
  const userProjects = projects.filter(
    (project) =>
      project.teamMembers?.some((member) => member._id === userInfo?._id) ||
      project.manager?._id === userInfo?._id
  );

  // Filter projects based on search and active tab
  const filteredProjects = userProjects.filter((project) => {
    const matchesTab = activeTab === "all" || project.status === activeTab;
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Get project statistics
  const getProjectStats = (projectId) => {
    const projectTasks = userTasks.filter(
      (task) => task.project?._id === projectId
    );
    const completed = projectTasks.filter(
      (task) => task.status === "completed"
    ).length;
    const inProgress = projectTasks.filter(
      (task) => task.status === "in-progress"
    ).length;
    const todo = projectTasks.filter((task) => task.status === "todo").length;

    return {
      total: projectTasks.length,
      completed,
      inProgress,
      todo,
      progress:
        projectTasks.length > 0
          ? Math.round((completed / projectTasks.length) * 100)
          : 0,
    };
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

  const stats = {
    total: userProjects.length,
    active: userProjects.filter((p) => p.status === "active").length,
    completed: userProjects.filter((p) => p.status === "completed").length,
    onHold: userProjects.filter((p) => p.status === "on-hold").length,
  };

  const loading = projectsLoading || tasksLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              My Projects
            </h1>
            <p className="text-slate-600 text-lg">
              Welcome back,{" "}
              <span className="font-semibold text-slate-800">
                {userInfo?.name}
              </span>
              ! Here are the projects you're working on.
            </p>
          </div>
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
                <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📁</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  {searchTerm ? "No projects found" : "No projects assigned"}
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  {searchTerm
                    ? `No projects match "${searchTerm}". Try different keywords.`
                    : "You're not assigned to any projects yet. Projects assigned to you will appear here."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const stats = getProjectStats(project._id);

                  return (
                    <div
                      key={project._id}
                      onClick={() =>
                        (window.location.href = `/project/${project._id}`)
                      }
                      className="group bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-6 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-blue-200/50 transition-all duration-500 hover:scale-105 cursor-pointer backdrop-blur-sm"
                    >
                      {/* Project Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
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
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-500 mb-2">
                          <span>Task Progress</span>
                          <span>{stats.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${stats.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Task Stats */}
                      {/* <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="text-blue-600 font-bold text-sm">
                            {stats.total}
                          </div>
                          <div className="text-blue-500 text-xs">Total</div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-2">
                          <div className="text-yellow-600 font-bold text-sm">
                            {stats.inProgress}
                          </div>
                          <div className="text-yellow-500 text-xs">
                            In Progress
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2">
                          <div className="text-green-600 font-bold text-sm">
                            {stats.completed}
                          </div>
                          <div className="text-green-500 text-xs">Done</div>
                        </div>
                      </div> */}

                      {/* Project Meta */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4 min-w-0 flex-1">
                            <div className="flex items-center space-x-1 text-slate-600 min-w-0">
                              <span>👨‍💼</span>
                              <span className="font-medium truncate max-w-[140px]">
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
