import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTask,
  startTimeTracking,
  stopTimeTracking,
} from "../redux/slices/taskSlice";
import FileUpload from "./FileUpload";
import TimeTracking from "./TimeTracking";
import TaskDependencies from "./TaskDependencies";
import RichTextEditor from "./RichTextEditor";

const EnhancedTaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await dispatch(
        updateTask({
          taskId: task._id,
          taskData: { status: newStatus },
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
      {/* Task Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          {isEditing ? (
            <input
              type="text"
              defaultValue={task.title}
              className="text-lg font-semibold border border-gray-300 rounded px-2 py-1 w-full"
              onBlur={(e) =>
                dispatch(
                  updateTask({
                    taskId: task._id,
                    taskData: { title: e.target.value },
                  })
                )
              }
            />
          ) : (
            <h4 className="text-lg font-semibold text-gray-900">
              {task.title}
            </h4>
          )}
          <div className="flex space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✏️
            </button>
          </div>
        </div>

        {/* Description with Rich Text */}
        <div className="mb-3">
          {isEditing ? (
            <RichTextEditor
              content={task.description}
              onSave={(content) =>
                dispatch(
                  updateTask({
                    taskId: task._id,
                    taskData: { description: content },
                  })
                )
              }
            />
          ) : (
            <div
              className="text-gray-600 text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: task.description }}
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className="flex items-center text-xs text-gray-500 hover:text-gray-700"
          >
            📎 Attachments ({task.attachments?.length || 0})
          </button>
          <button
            onClick={() => setShowDependencies(!showDependencies)}
            className="flex items-center text-xs text-gray-500 hover:text-gray-700"
          >
            🔗 Dependencies ({task.dependsOn?.length || 0})
          </button>
          <TimeTracking task={task} />
        </div>
      </div>

      {/* Task Details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Assigned to:</span>
            <p className="mt-1">{task.assignedTo?.name}</p>
          </div>
          <div>
            <span className="font-medium">Due Date:</span>
            <p className="mt-1">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="font-medium">Time Spent:</span>
            <p className="mt-1">
              {Math.round(task.totalTimeSpent / 60)}h {task.totalTimeSpent % 60}
              m
            </p>
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Attachments Section */}
        {showAttachments && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium text-sm">Attachments</h5>
              <FileUpload taskId={task._id} />
            </div>
            {task.attachments?.length > 0 ? (
              <div className="space-y-2">
                {task.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">📄</span>
                      <div>
                        <p className="text-sm font-medium">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} •{" "}
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://planora-backend-rf22.onrender.com${file.url}`}
                      download
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No attachments yet
              </p>
            )}
          </div>
        )}

        {/* Dependencies Section */}
        {showDependencies && (
          <div className="mb-4">
            <TaskDependencies task={task} />
          </div>
        )}

        {/* Comments Section */}
        {task.comments && task.comments.length > 0 && (
          <div className="border-t border-gray-200 pt-3">
            <h5 className="font-medium text-sm mb-2">
              Comments ({task.comments.length})
            </h5>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {task.comments.map((comment, index) => (
                <div key={index} className="flex gap-2 text-sm">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-xs">
                    {comment.user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{comment.user?.name}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTaskCard;
