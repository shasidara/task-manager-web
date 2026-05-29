import { useState } from "react";
import axios from "axios";
import { BASE_URL, LABELS, PRIORITY_OPTIONS } from "../utils/constants";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../utils/appStore";
import { addTask } from "../utils/taskSlice";
import { useNavigate } from "react-router-dom";

const TaskForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [ title, setTitle ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ status, setStatus ] = useState<"todo" | "in-progress" | "done">("todo");
    const [ success, setSuccess ] = useState<string>("");
    const [ error, setError ] = useState<string>("");
    const [ loading, setLoading ] = useState<boolean>(false);
    const navigate = useNavigate();
    const [ targetDate, setTargetDate ] = useState<string>("");
    const [ priority, setPriority ] = useState<"low" | "medium" | "high">("medium");
    const [ labels, setLabels ] = useState<string[]>([]);
    const [ files, setFiles ] = useState<FileList | null>(null);
    const [ fileError, setFileError ] = useState<string>("");

    const toggleLabel = (label: string) => {
        setLabels((prev) =>
            prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
        );
    };

    const handleTask = async () => {
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

            const res = await axios.post(BASE_URL + "/task", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            dispatch(addTask(res?.data?.data));
            setTitle("");
            setDescription("");
            setStatus("todo");
            setTargetDate("");
            setPriority("medium");
            setLabels([]);
            setFiles(null);
            setSuccess("Task Created Successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch(err) {
            if (axios.isAxiosError(err)) {
                setError(err?.response?.data?.message || "Failed to create task");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto my-10 p-6 bg-base-300 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">
                ➕ Create New Task
            </h2>

            <label className="my-3 block">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm">Title <span className="text-red-500">*</span></p>
                    <p className={`text-xs ${title.length > 90 ? "text-red-500" : "text-gray-400"}`}>
                        {title.length}/100
                    </p>
                </div>
                <input
                    type="text"
                    className={`input input-md w-full ${error ? "border-red-500 border-2" : ""}`}
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => { 
                        setTitle(e.target.value);
                        if(e.target.value.trim()) setError("");
                    }}
                />
                {error && <p className="text-red-500 text-sm mt-1">⚠️ {error}</p>}
            </label>

            <label className="my-3 block">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm">Description</p>
                    <p className={`text-xs ${description.length > 450 ? "text-red-500" : "text-gray-400"}`}>
                        {description.length}/500
                    </p>
                </div>
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

            <label className="my-3 block">
                <p className="text-sm mb-1">Target Date</p>
                <input
                    type="date"
                    className="input input-md w-full"
                    value={targetDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setTargetDate(e.target.value)}
                />
            </label>

            <div className="my-3">
                <p className="text-sm mb-2">Priority</p>
                <div className="flex gap-5 flex-wrap">
                    {PRIORITY_OPTIONS.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="priority"
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

            <div className="my-3">
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

            <div className="my-3">
                <p className="text-sm mb-2">Attachments</p>
                <input
                    type="file"
                    className="file-input file-input-md w-full"
                    multiple
                    onChange={(e) => {
                        const selectedFiles = e.target.files;
                        if(!selectedFiles) return;

                        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];
                        const invalidFiles = Array.from(selectedFiles).filter(
                            (file) => !allowedTypes.includes(file.type)
                        );

                        if(invalidFiles.length > 0) {
                            setFileError("Only images (JPG, PNG, GIF, WEBP) and PDF files are allowed");
                            e.target.value = "";
                            setFiles(null);
                            return;
                        };

                        setFileError("");
                        setFiles(selectedFiles);
                    }}
                />
                {fileError && <p className="text-red-500 text-sm mt-1">⚠️ {fileError}</p>}
                {files && files.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {Array.from(files).map((file, i) => (
                            <p key={i} className="text-xs text-gray-400">
                                📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </p>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6 text-center">
                <button
                    className="btn bg-blue-500 hover:bg-blue-600 text-white px-10 rounded-full"
                    onClick={handleTask}
                    disabled={loading}
                >
                    {loading ? <span className="loading loading-spinner loading-sm" /> : "Submit"}
                </button>
            </div>

            <button
                className="btn btn-ghost mt-2"
                onClick={() => navigate("/")}
            >
                ← Back to Tasks
            </button>

            {success && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>{success}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskForm;