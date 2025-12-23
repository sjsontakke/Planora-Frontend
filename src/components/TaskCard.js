// frontend/src/components/TaskCard.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, fetchProjectTasks } from "../redux/slices/taskSlice";

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "todo":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      console.log("Updating task status:", task._id, "to", newStatus);

      const result = await dispatch(
        updateTask({
          taskId: task._id,
          taskData: { status: newStatus },
        })
      ).unwrap();

      console.log("Update result:", result);

      // Refresh the project tasks to update the Kanban board
      if (task.project) {
        dispatch(fetchProjectTasks(task.project));
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  // Check if current user is the assigned employee
  const isAssignedEmployee = userInfo?._id === task.assignedTo?._id;

  return (
    <div className="bg-white p-4 rounded-lg shadow task-card">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{task.title}</h4>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3">{task.description}</p>

      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <span>Assigned to: {task.assignedTo?.name || "Unassigned"}</span>
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>

      {/* Status Update Buttons - Only show for assigned employees */}
      {isAssignedEmployee && (
        <div className="border-t pt-3 mt-3">
          <p className="text-xs text-gray-500 mb-2">Update Status:</p>
          <div className="flex gap-2">
            {task.status !== "todo" && (
              <button
                onClick={() => handleStatusUpdate("todo")}
                className="flex-1 bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                To Do
              </button>
            )}
            {task.status !== "in-progress" && (
              <button
                onClick={() => handleStatusUpdate("in-progress")}
                className="flex-1 bg-yellow-500 text-white py-1 px-2 rounded text-xs hover:bg-yellow-600 transition-colors"
              >
                In Progress
              </button>
            )}
            {task.status !== "completed" && (
              <button
                onClick={() => handleStatusUpdate("completed")}
                className="flex-1 bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600 transition-colors"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      )}

      {task.comments && task.comments.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {task.comments.length} comments
        </div>
      )}
    </div>
  );
};

export default TaskCard;
