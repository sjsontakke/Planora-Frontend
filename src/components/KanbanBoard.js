import React from "react";
import TaskCard from "./TaskCard";

const KanbanColumn = ({ title, tasks }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 min-h-96">
      <h3 className="font-semibold text-lg mb-4 text-gray-700">
        {title} ({tasks.length})
      </h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks }) => {
  const columns = [
    { title: "To Do", status: "todo" },
    { title: "In Progress", status: "in-progress" },
    { title: "Completed", status: "completed" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          tasks={tasks.filter((task) => task.status === column.status)}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
