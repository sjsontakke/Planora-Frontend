import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startTimeTracking, stopTimeTracking } from "../redux/slices/taskSlice";

const TimeTracking = ({ task }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);

  const activeEntry = task.timeEntries?.find(
    (entry) => entry.user._id === userInfo._id && !entry.endTime
  );

  useEffect(() => {
    let interval;
    if (isRunning && activeEntry) {
      interval = setInterval(() => {
        setCurrentDuration(
          Math.floor((new Date() - new Date(activeEntry.startTime)) / 1000)
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeEntry]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = async () => {
    try {
      await dispatch(
        startTimeTracking({
          taskId: task._id,
          description: "Working on task",
        })
      ).unwrap();
      setIsRunning(true);
    } catch (error) {
      console.error("Failed to start timer:", error);
    }
  };

  const handleStopTimer = async () => {
    try {
      await dispatch(stopTimeTracking(task._id)).unwrap();
      setIsRunning(false);
      setCurrentDuration(0);
    } catch (error) {
      console.error("Failed to stop timer:", error);
    }
  };

  const totalTime =
    task.timeEntries?.reduce((total, entry) => {
      return total + (entry.duration || 0);
    }, 0) || 0;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-500">
        ⏱️ {Math.floor(totalTime / 60)}m
      </span>

      {activeEntry ? (
        <button
          onClick={handleStopTimer}
          className="flex items-center text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        >
          ⏹️ {formatTime(currentDuration)}
        </button>
      ) : (
        <button
          onClick={handleStartTimer}
          className="flex items-center text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
        >
          ▶️ Start
        </button>
      )}
    </div>
  );
};

export default TimeTracking;
