import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchAll, clearSearch } from "../redux/slices/searchSlice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { results, loading } = useSelector((state) => state.search);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(() => {
        dispatch(searchAll(query));
        setShowResults(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setShowResults(false);
      dispatch(clearSearch());
    }
  }, [query, dispatch]);

  const handleResultClick = (type, item) => {
    setShowResults(false);
    setQuery("");

    // Navigate to the item
    if (type === "tasks" && item.project) {
      window.location.href = `/project/${item.project._id}`;
    } else if (type === "projects") {
      window.location.href = `/project/${item._id}`;
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tasks, projects, people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          🔍
        </div>
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            <div className="p-2">
              {/* Tasks Results */}
              {results.tasks && results.tasks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 px-2 py-1">
                    Tasks
                  </h3>
                  {results.tasks.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => handleResultClick("tasks", task)}
                      className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                        📝
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{task.title}</div>
                        <div className="text-xs text-gray-500">
                          {task.project?.name &&
                            `Project: ${task.project.name}`}
                          {task.assignedTo?.name &&
                            ` • Assigned to: ${task.assignedTo.name}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Results */}
              {results.projects && results.projects.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 px-2 py-1">
                    Projects
                  </h3>
                  {results.projects.map((project) => (
                    <div
                      key={project._id}
                      onClick={() => handleResultClick("projects", project)}
                      className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
                        📁
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {project.manager?.name &&
                            `Manager: ${project.manager.name}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Users Results */}
              {results.users && results.users.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 px-2 py-1">
                    People
                  </h3>
                  {results.users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {user.name?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          {user.email} • {user.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {(!results.tasks || results.tasks.length === 0) &&
                (!results.projects || results.projects.length === 0) &&
                (!results.users || results.users.length === 0) && (
                  <div className="p-4 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
