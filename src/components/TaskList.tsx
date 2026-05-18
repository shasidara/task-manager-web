import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../utils/appStore";
import { setTask } from "../utils/taskSlice";
import BASE_URL from "../utils/constants";
import type { Task } from "../utils/types";
import EditTaskModal from "./EditTask";

const TaskList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const tasks = useSelector((store: RootState) => store.task);
    const [error, setError] = useState<string>("");
    const [editTask, setEditTask] = useState<Task | null>(null);

    const fetchTasks = async () => {
        try {
            setError("");
            const res = await axios.get(BASE_URL + "/all/tasks", {
                withCredentials: true,
            });
            dispatch(setTask(res.data.data));
        } catch(err) {
            if(axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to fetch tasks");
            }
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-400 text-lg">No tasks yet. Create one! ➕</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto my-10 px-4">
            <h1 className="text-2xl font-bold mb-6">📋 My Tasks ({tasks.length})</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className="card bg-base-300 shadow-md rounded-2xl hover:shadow-xl transition-all"
                    >
                        <div className="card-body">

                            <div className="flex justify-between items-center">
                                <span className={`badge text-xs font-semibold ${
                                    task.status === "done"
                                        ? "badge-success"
                                        : task.status === "in-progress"
                                        ? "badge-warning"
                                        : "badge-ghost"
                                }`}>
                                    {task.status === "done" ? "✅ Done"
                                        : task.status === "in-progress" ? "🔄 In Progress"
                                        : "📋 Todo"}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(task.createdAt || "").toLocaleDateString()}
                                </span>
                            </div>

                            <h2
                                className="card-title text-lg mt-2 cursor-pointer hover:text-blue-400"
                                onClick={() => navigate("/task/" + task._id)}
                            >
                                {task.title}
                            </h2>

                            <p className="text-sm text-gray-400 mt-1">
                                {task.description || "No description"}
                            </p>

                            <div className="card-actions justify-end mt-3">
                                <button
                                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
                                    onClick={() => setEditTask(task)}
                                >
                                    ✏️ Edit
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editTask && (
                <EditTaskModal
                    task={editTask}
                    onClose={() => setEditTask(null)}
                />
            )}
        </div>
    );
};

export default TaskList;