import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectTasks, createTask } from "../redux/slices/taskSlice";
import KanbanBoard from "../components/KanbanBoard";
import CreateTaskModal from "../components/CreateTaskModal";

const ProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { userInfo } = useSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProjectTasks(id));
  }, [id, dispatch]);

  const handleCreateTask = async (taskData) => {
    try {
      console.log("Creating task with data:", taskData);
      const result = await dispatch(createTask(taskData)).unwrap();
      console.log("Task created successfully:", result);
      setShowCreateModal(false);
      // Refresh tasks after creation
      dispatch(fetchProjectTasks(id));
    } catch (error) {
      console.error("Failed to create task:", error);
      throw error; // Re-throw to handle in modal
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Project Tasks</h1>
        {(userInfo?.role === "admin" || userInfo?.role === "manager") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Create Task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No tasks yet. Create your first task!
          </p>
        </div>
      ) : (
        <KanbanBoard tasks={tasks} />
      )}

      <CreateTaskModal
        projectId={id}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default ProjectPage;
