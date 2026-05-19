import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../utils/appStore";
import { setTask, removeTask } from "../utils/taskSlice";
import BASE_URL from "../utils/constants";
import type { Task } from "../utils/types";
import EditTaskModal from "./EditTask";
import { Link } from "react-router-dom";

const TaskList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const tasks = useSelector((store: RootState) => store.task);
    const [ error, setError ] = useState<string>("");
    const [ editTask, setEditTask ] = useState<Task | null>(null);
    const [ deletingId, setDeletingId ] = useState<string | null>(null);
    const [ toast, setToast ] = useState<string>("");
    const [ search, setSearch ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ sort, setSort ] = useState<string>("latest");

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(""), 3000);
    };

    const fetchTasks = async (searchQuery: string = "", sortQuery: string = "latest") => {
        try {
            setLoading(true);
            setError("");

            let url = BASE_URL + "/all/tasks?";
            if(sortQuery) url += `search=${searchQuery}&`;
            url += `sort=${sortQuery}`;

            const res = await axios.get(url, {
                withCredentials: true
            });

            const data = Array.isArray(res.data.data) ? res.data.data : [];
            dispatch(setTask(data));
        } catch(err) {
            if(axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to fetch tasks");
            };
        }finally{
            setLoading(false)
        }
    };

    const getDateStatus = (targetDate: string, status: string) => {
        try {
            if(status === "done") return null;

            const today = new Date();
            const target = new Date(targetDate);

            today.setHours(0,0,0,0);
            target.setHours(0,0,0,0);

            if(target.getTime() === today.getTime()){
                return <p className="text-yellow-500 text-xs mt-1">⏰ Due Today!</p>;
            }else if(target < today ){
                return <p className="text-red-500 text-xs mt-1">❌ Overdue!</p>;
            }else{
                return <p className="text-green-500 text-xs mt-1">✅ Due </p>;
            }
        }catch(err) {
            if(axios.isAxiosError(err)){
                setError(err.response?.data?.message || "Failed to fetch status");
            };
        };
    };

    const handleDelete = async (taskId: string) => {
        const confirmed = window.confirm("Are you sure want to delete this task?");
        if(!confirmed) return;
        try{
            setDeletingId(taskId);

            dispatch(removeTask(taskId));

            await axios.delete(BASE_URL + "/delete/task/" + taskId, {
                withCredentials: true
            });
            showToast("Task deleted successfully");
        }catch(err) {
            fetchTasks();
            if(axios.isAxiosError(err)){
                showToast(err.response?.data?.message || "Failed to delete task");
            };
        } finally{
            setDeletingId(null);
        };
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks(search, sort);
        },500);
        return () => clearTimeout(timer);
    }, [search, sort]);

    useEffect(() => {
        fetchTasks();
    }, []);

    if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
            <span className="loading loading-spinner loading-lg text-blue-500"></span>
            <p className="text-sm text-gray-400">Fetching your tasks...</p>
        </div>
    )};

    if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
            <div className="text-4xl">⚠️</div>
            <p className="text-red-500 text-lg">{error}</p>
            <button
                className="btn bg-blue-500 text-white rounded-full px-6"
                onClick={() => fetchTasks()}
            >
                Try Again
            </button>
        </div>
    )};

    if (tasks.length === 0) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 gap-4">
            <div className="text-5xl">📋</div>
            <p className="text-gray-400 text-lg">No tasks yet!</p>
            <Link
                to="/task"
                className="btn bg-blue-500 text-white rounded-full px-6"
            >
                ➕ Create your first task
            </Link>
        </div>
    )};

    return (
        <div className="max-w-5xl mx-auto my-10 px-4">
            {toast && (
                <div className="toast toast-top toast-center z-50">
                    <div className="alert alert-success shadow-lg">
                        <span>{toast}</span>
                    </div>
                </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">
                    📋 My Tasks ({tasks.length})
                </h1>
                <div className="flex gap-2 items-center">
                    <button
                        className={`btn btn-sm rounded-full px-4 ${sort === "latest" ? "bg-blue-500 text-white" : "btn-ghost"}`}
                        onClick={() => setSort("latest")}
                    >
                        🆕 Latest
                    </button>
                    <button
                        className={`btn btn-sm rounded-full px-4 ${sort === "oldest" ? "bg-blue-500 text-white" : "btn-ghost"}`}
                        onClick={() => setSort("oldest")}
                    >
                        📅 Oldest
                    </button>
                    <input
                        type="text"
                        placeholder="🔍 Search tasks..."
                        className="input input-md w-full md:w-72 bg-base-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>  
                <Link to="/task">  
                    <button className="btn p-4 py-2 bg-base-300 text-white hover:bg-blue-500 rounded-full">
                        📋Create Task
                    </button>
                </Link>
            </div>
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
                                onClick={() => navigate("/single/task/" + task._id)}
                            >
                                {task.title}
                            </h2>

                            <p className="text-sm text-gray-400 mt-1">
                                {task.description || "No description"}
                            </p>

                            {task.targetDate && (
                                <p className="text-xs text-white-100 mt-1">
                                    🎯 Deadline: {new Date(task.targetDate).toLocaleDateString()}
                                </p>
                            )}
                            {task.targetDate && getDateStatus(task.targetDate, task.status)}

                            <div className="card-actions justify-end mt-3">
                                <button
                                    className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
                                    onClick={() => setEditTask(task)}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded-full px-4"
                                    onClick={() => handleDelete(task._id || "")}
                                    disabled={deletingId === task._id}
                                >
                                    {deletingId === task._id ? "..." : "🗑️ Delete"}
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