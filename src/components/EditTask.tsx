import { useState } from "react";
import type { Task } from "../utils/types";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../utils/appStore";
import { updateTask } from "../utils/taskSlice";
import BASE_URL from "../utils/constants";


interface EditTaskProps {
    task: Task;
    onClose: () => void;
}

const EditTask = ({ task, onClose }: EditTaskProps) => {
    const [ title, setTitle ] = useState<string>(task.title);
    const [ description, setDescription ] = useState<string>(task.description || "");
    const [ status, setStatus ] = useState<"to-do" | "in-progress" | "done">(task.status);
    const [ error, setError ] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();

    const handleUpdate = async () => {
        setError("");
        if(!title){
            setError("Title is required");
            return;
        }

        try {
            const res = await axios.put(BASE_URL + "/update/task/" + task._id, {
                title,
                description,
                status,
            },{ withCredentials: true });
            dispatch(updateTask(res?.data?.data));
            onClose();

        }catch (err) {
            if(axios.isAxiosError(err)) {
                setError(err?.response?.data?.message || "Failed to update task");
            };
        };
    };

    return(
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="card bg-base-300 w-96 shadow-xl rounded-2xl">
                <div className="card-body">
                    <h2 className="card-title justify-between">
                        ✏️ Edit Task
                        <button
                            className="btn btn-ghost btn-sm btn-circle"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </h2>
                    <label className="my-2">
                        <p className="text-sm mb-1">Title <span className="text-red-500">*</span></p>
                        <input
                            type="text"
                            className="input input-md w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                    <label className="my-2">
                        <p className="text-sm mb-1">Description</p>
                        <textarea
                            className="textarea w-full"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>
                    <label className="my-2">
                        <p className="text-sm mb-1">Status</p>
                        <select
                            className="select select-md w-full"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as "to-do" | "in-progress" | "done")}
                        >
                            <option value="todo">📋 Todo</option>
                            <option value="in-progress">🔄 In Progress</option>
                            <option value="done">✅ Done</option>
                        </select>
                    </label>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                     <div className="card-actions justify-end mt-4 gap-2">
                        <button
                            className="btn btn-ghost rounded-full px-6"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6"
                            onClick={handleUpdate}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTask;