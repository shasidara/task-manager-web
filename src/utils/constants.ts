export const BASE_URL : string = import.meta.env.VITE_BASE_URL as string;

export const LABELS = ["Urgent", "Bug", "Feature", "Improvement", "Design", "Research"];

export const PRIORITY_OPTIONS = [
    { value: "low", label: "🟢 Low" },
    { value: "medium", label: "🟡 Medium" },
    { value: "high", label: "🔴 High" },
]
