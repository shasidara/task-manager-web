import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "../utils/constants";
import type { Task } from "../utils/types";

const TaskDetail = () => {
    const [error, setError] = useState<string>("");
    const { id } = useParams<{ id: string }>();
    const [ task, setTask ] = useState<Task | null>(null);
    const navigate = useNavigate();

    const fetchTask = async () => {
        try{
            setError("");
            const res = await axios.get(BASE_URL + "/single/task/" + id, {
                withCredentials: true
            })
            setTask(res?.data?.data);
        }catch(err) {
            if(axios.isAxiosError(err)) {
                setError(err?.response?.data?.message || "Faild to fetch task");
            };
        };
    };

    useEffect(() => {
        fetchTask();
    }, [id]);

    if(error) {
        return(
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    };

    if(!task){
        return(
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-400 text-lg">Task not found 😕</p>
            </div>
        );
    };

    return(
        <div className="max-w-lg mx-auto my-10 px-4">
            <button
                className="btn btn-ghost mb-4"
                onClick={() => navigate("/")}
            >
                ← Back to Tasks
            </button>
            <div className="card bg-base-300 shadow-xl rounded-2xl">
                <div className="card-body gap-4">

                    <div className="flex justify-between items-center">
                        <span className={`badge text-xs font-semibold ${
                            task.status === "done"
                                ? "badge-success"
                                : task.status === "in-progress"
                                ? "badge-warning"
                                : "badge-ghost"
                        }`}>{task.status === "done" ? "✅ Done"
                                : task.status === "in-progress" ? "🔄 In Progress"
                                : "📋 Todo"}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(task.createdAt || "").toLocaleDateString()}
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold">{task.title}</h2>

                    <div>
                        <p className="text-sm text-gray-400 mb-1">Description</p>
                        <p className="text-base">
                            {task.description || "No description available"}
                        </p>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <p>Created: {new Date(task.createdAt || "").toLocaleString()}</p>
                        <p>Updated: {new Date(task.updatedAt || "").toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TaskDetail;