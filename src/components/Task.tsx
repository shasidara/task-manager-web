import { useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../utils/appStore"; 
import { addTask } from "../utils/taskSlice";

const TaskForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [ title, setTitle ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ status, setStatus ] = useState<"todo" | "in-progress" | "done">("todo");
    const [ success, setSuccess ] = useState<string>("");

    const handleTask = async () => {
        try {
            const res = await axios.post(BASE_URL + "/task", {
                title,
                description,
                status,
            }, {
                withCredentials: true
            });
            dispatch(addTask(res?.data?.data));
            setTitle("");
            setDescription("");
            setStatus("todo");
            setSuccess("Task Created Successfully!");
            setTimeout(() => setSuccess(""), 3000);
        }catch(err) {
            if(err instanceof Error) {
                console.log("ERROR: " + err.message);
            }
        };
    };

    return (
        <div className="max-w-lg mx-auto my-10 p-6 bg-base-300 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
                ➕ Create New Task
            </h2>

            <label className="my-3 block">
                <p className="text-sm mb-1">
                    Title <span className="text-red-500">*</span>
                </p>
                <input
                    type="text"
                    className="input input-md w-full"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </label>

            <label className="my-3 block">
                <p className="text-sm mb-1">Description</p>
                <textarea
                    className="textarea w-full"
                    rows={3}
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>

            <label className="my-3 block">
                <p className="text-sm mb-1">Status</p>
                <select
                    className="select select-md w-full"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "todo" | "in-progress" | "done")}
                >
                    <option value="todo">📋 Todo</option>
                    <option value="in-progress">🔄 In Progress</option>
                    <option value="done">✅ Done</option>
                </select>
            </label>

            <div className="mt-6 text-center">
                <button
                    className="btn bg-blue-500 hover:bg-blue-600 text-white px-10 rounded-full"
                    onClick={handleTask}
                >
                    Submit
                </button>
            </div>

            {success && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>Task Created Successfully!.</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskForm;