import { useState } from "react";
import type { Task } from "../utils/types";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../utils/appStore";
import { updateTask } from "../utils/taskSlice";
import { BASE_URL, LABELS, PRIORITY_OPTIONS } from "../utils/constants";

interface EditTaskProps {
    task: Task;
    onClose: () => void;
}

const EditTask = ({ task, onClose }: EditTaskProps) => {
    const [ title, setTitle ] = useState<string>(task.title);
    const [ description, setDescription ] = useState<string>(task.description || "");
    const [ status, setStatus ] = useState<"to-do" | "in-progress" | "done">(task.status);
    const [ error, setError ] = useState<string>("");
    const [ success, setSuccess ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ targetDate, setTargetDate ] = useState<string>(
        task.targetDate ? new Date(task.targetDate).toISOString().split("T")[0] : ""
    );
    const [ priority, setPriority ] = useState<"low" | "medium" | "high">(task.priority || "medium");
    const [ labels, setLabels ] = useState<string[]>(task.labels || []);
    const [ files, setFiles ] = useState<FileList | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const [ fileError, setFileError ] = useState<string>("");

    const toggleLabel = (label: string) => {
        setLabels((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    };

    const handleUpdate = async () => {
        setError("");
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("status", status);
            formData.append("targetDate", targetDate || "");
            formData.append("priority", priority);
            formData.append("labels", JSON.stringify(labels));

            if (files) {
                Array.from(files).forEach((file) => {
                    formData.append("attachments", file);
                });
            }

            const res = await axios.put(BASE_URL + "/update/task/" + task._id, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            dispatch(updateTask(res?.data?.data));
            setSuccess("Saved Changes Successfully!");
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch(err) {
            if (axios.isAxiosError(err)) {
                setError(err?.response?.data?.message || "Failed to update task");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="card bg-base-300 w-full max-w-md shadow-xl rounded-2xl">
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

                        <label className="my-2 block">
                            <p className="text-sm mb-1">Title <span className="text-red-500">*</span></p>
                            <input
                                type="text"
                                className={`input input-md w-full ${error ? "border-red-500 border-2" : ""}`}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        </label>

                        <label className="my-2 block">
                            <p className="text-sm mb-1">Description</p>
                            <textarea
                                className="textarea w-full"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>

                        <label className="my-2 block">
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

                        <label className="my-2 block">
                            <p className="text-sm mb-1">Target Date</p>
                            <input
                                type="date"
                                className="input input-md w-full"
                                value={targetDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setTargetDate(e.target.value)}
                            />
                        </label>

                        <div className="my-2">
                            <p className="text-sm mb-2">Priority</p>
                            <div className="flex gap-5 flex-wrap">
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="edit-priority"
                                            className="radio radio-sm radio-primary"
                                            value={opt.value}
                                            checked={priority === opt.value}
                                            onChange={() => setPriority(opt.value as "low" | "medium" | "high")}
                                        />
                                        <span className="text-sm">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="my-2">
                            <p className="text-sm mb-2">Labels</p>
                            <div className="flex flex-wrap gap-3">
                                {LABELS.map((label) => (
                                    <label key={label} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-sm checkbox-primary"
                                            checked={labels.includes(label)}
                                            onChange={() => toggleLabel(label)}
                                        />
                                        <span className="text-sm">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="my-2">
                            <p className="text-sm mb-2">Add Attachments</p>
                            <input
                                type="file"
                                className="file-input file-input-md w-full"
                                multiple
                                onChange={(e) => {
                                    const selectedFiles = e.target.files;
                                    if(!selectedFiles) return;

                                    const allowedFiles = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
                                    const invalidFiles = Array.from(selectedFiles).filter(
                                        (file) => !allowedFiles.includes(file.type)
                                    );

                                    if(invalidFiles.length > 0) {
                                        setFileError("Only images (JPG, PNG, GIF, WEBP) and PDF files are allowed");
                                        e.target.value="";
                                        setFiles(null);
                                        return;
                                    };

                                    setFileError("");
                                    setFiles(selectedFiles);
                                }}
                            />

                            {task.attachments && task.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-400">Existing files:</p>
                                    {task.attachments.map((file, i) => (
                                        <a
                                            key={i}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-400 hover:underline block"
                                        >
                                            📎 {file.originalName}
                                        </a>
                                    ))}
                                </div>
                            )}
                            
                            {fileError && <p className="text-red-500 text-sm mt-1">⚠️ {fileError}</p>}
                            {files && files.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-400">New files:</p>
                                    {Array.from(files).map((file, i) => (
                                        <p key={i} className="text-xs text-gray-400">
                                            📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>

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
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
                            </button>
                        </div>

                        {success && (
                            <div className="toast toast-top toast-center">
                                <div className="alert alert-success">
                                    <span>{success}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default EditTask;